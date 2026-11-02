"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from "@/types";
import { ApplicationTable } from "@/components/applications/application-table";
import { ApplicationCard } from "@/components/applications/application-card";
import { DeleteDialog } from "@/components/applications/delete-dialog";
import { Modal } from "@/components/ui/modal";
import { ApplicationForm } from "@/components/applications/application-form";
import { ApplicationFormData } from "@/lib/validations/application";
import { downloadCSV } from "@/lib/utils";
import { SupabaseConfigBanner } from "@/components/ui/supabase-config-banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Plus,
  Loader2,
  Briefcase,
} from "lucide-react";

export default function ApplicationsPipelinePage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"application_date" | "company" | "status" | "assessment_date" | "interview_date">("application_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Edit / Delete Modals
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const configured = isSupabaseConfigured();
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("applications")
        .select("*")
        .order("application_date", { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }

      setApplications((data as JobApplication[]) || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [configured, supabase]);

  useEffect(() => {
    fetchApplications();

    const handleRefresh = () => {
      fetchApplications();
    };

    window.addEventListener("careerflow:refresh", handleRefresh);
    return () => {
      window.removeEventListener("careerflow:refresh", handleRefresh);
    };
  }, [fetchApplications]);

  // Status Change directly from row
  const handleStatusChange = async (app: JobApplication, newStatus: ApplicationStatus) => {
    if (!configured) return;
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((item) => (item.id === app.id ? { ...item, status: newStatus } : item))
      );

      const { error: updateErr } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", app.id);

      if (updateErr) {
        throw updateErr;
      }
    } catch (err: any) {
      fetchApplications(); // Revert on failure
      alert(`Could not update status: ${err.message}`);
    }
  };

  // Submit edit form
  const handleUpdateApplication = async (data: ApplicationFormData) => {
    if (!editingApp || !configured) return;
    setIsUpdating(true);
    try {
      const { error: updateErr } = await supabase
        .from("applications")
        .update({
          company: data.company,
          job_title: data.job_title,
          location: data.location,
          job_url: data.job_url,
          salary: data.salary,
          employment_type: data.employment_type,
          status: data.status,
          application_date: data.application_date,
          assessment_date: data.assessment_date,
          interview_date: data.interview_date,
          follow_up_date: data.follow_up_date,
          notes: data.notes,
        })
        .eq("id", editingApp.id);

      if (updateErr) {
        throw updateErr;
      }

      setEditingApp(null);
      fetchApplications();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingApp || !configured) return;
    setIsDeleting(true);
    try {
      const { error: delErr } = await supabase
        .from("applications")
        .delete()
        .eq("id", deletingApp.id);

      if (delErr) {
        throw delErr;
      }

      setDeletingApp(null);
      fetchApplications();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Status filter
        if (selectedStatus !== "All" && app.status !== selectedStatus) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCompany = app.company.toLowerCase().includes(q);
          const matchTitle = app.job_title.toLowerCase().includes(q);
          const matchLocation = (app.location || "").toLowerCase().includes(q);
          const matchNotes = (app.notes || "").toLowerCase().includes(q);
          return matchCompany || matchTitle || matchLocation || matchNotes;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [applications, searchQuery, selectedStatus, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-6">
      {!configured && <SupabaseConfigBanner />}

      {/* Control Bar: Search, Filters, Sorting & Export */}
      <div className="flex flex-col gap-4 bg-card border rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, title, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Action buttons: Export CSV */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadCSV(filteredApplications)}
              disabled={filteredApplications.length === 0}
              className="gap-1.5 text-xs w-full sm:w-auto"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Status Filter Chips & Sort Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-3 border-t">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setSelectedStatus("All")}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
                selectedStatus === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              All ({applications.length})
            </button>
            {APPLICATION_STATUSES.map((status) => {
              const count = applications.filter((a) => a.status === status).length;
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {status} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs w-full md:w-auto justify-end">
            <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="application_date">Application Date</option>
              <option value="company">Company Name</option>
              <option value="status">Status</option>
              <option value="assessment_date">Assessment Date</option>
              <option value="interview_date">Interview Date</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSortOrder}
              title={`Toggle sort order (Current: ${sortOrder})`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main List / Table Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          <p className="text-sm">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchApplications}>
            Retry
          </Button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground">
              {searchQuery || selectedStatus !== "All"
                ? "No matching applications found"
                : "No applications logged yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              {searchQuery || selectedStatus !== "All"
                ? "Try clearing your search query or changing your status filter."
                : "Record your first job application using the Add Application button in the header."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ApplicationTable
              applications={filteredApplications}
              onEdit={(app) => setEditingApp(app)}
              onDelete={(app) => setDeletingApp(app)}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={(app) => setEditingApp(app)}
                onDelete={(app) => setDeletingApp(app)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}

      {/* Edit Application Modal */}
      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title="Edit Job Application"
        description="Update company information, recruitment stage, or scheduled deadlines."
      >
        {editingApp && (
          <ApplicationForm
            initialData={editingApp}
            onSubmit={handleUpdateApplication}
            onCancel={() => setEditingApp(null)}
            isSubmitting={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        application={deletingApp}
        isOpen={!!deletingApp}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

