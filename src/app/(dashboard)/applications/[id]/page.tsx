"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ApplicationForm } from "@/components/applications/application-form";
import { DeleteDialog } from "@/components/applications/delete-dialog";
import { ApplicationFormData } from "@/lib/validations/application";
import { SupabaseConfigBanner } from "@/components/ui/supabase-config-banner";
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  Loader2,
  Share2,
} from "lucide-react";

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const configured = isSupabaseConfigured();
  const supabase = createClient();

  useEffect(() => {
    async function loadApplication() {
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
          .eq("id", applicationId)
          .single();

        if (fetchErr) {
          throw fetchErr;
        }

        setApplication(data as JobApplication);
      } catch (err: any) {
        setError(err.message || "Application not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId, configured, supabase]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application || !configured) return;
    try {
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));

      const { error: updateErr } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", application.id);

      if (updateErr) {
        throw updateErr;
      }
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  const handleUpdate = async (data: ApplicationFormData) => {
    if (!application || !configured) return;
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
          source: data.source || "Direct / Other",
          notes: data.notes,
        })
        .eq("id", application.id);

      if (updateErr) {
        throw updateErr;
      }

      setApplication({
        ...application,
        company: data.company,
        job_title: data.job_title,
        location: data.location ?? null,
        job_url: data.job_url ?? null,
        salary: data.salary ?? null,
        employment_type: data.employment_type ?? "Full-time",
        status: data.status,
        application_date: data.application_date,
        assessment_date: data.assessment_date ?? null,
        interview_date: data.interview_date ?? null,
        follow_up_date: data.follow_up_date ?? null,
        source: data.source ?? "Direct / Other",
        notes: data.notes ?? null,
      });
      setIsEditOpen(false);
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!application || !configured) return;
    setIsDeleting(true);
    try {
      const { error: delErr } = await supabase
        .from("applications")
        .delete()
        .eq("id", application.id);

      if (delErr) {
        throw delErr;
      }

      router.push("/applications");
      router.refresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link href="/applications">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" /> Back to Applications
          </Button>
        </Link>
        {application && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        )}
      </div>

      {!configured && <SupabaseConfigBanner />}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          <p className="text-sm">Loading application details...</p>
        </div>
      ) : error || !application ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-3">
          <p className="text-destructive font-medium text-sm">{error || "Application not found."}</p>
          <Link href="/applications">
            <Button variant="outline" size="sm">
              Return to Pipeline
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Overview Card */}
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {application.company}
                  </h2>
                  {application.job_url && (
                    <a
                      href={application.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      title="Open job posting in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mt-0.5">{application.job_title}</p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <StatusBadge status={application.status} />
                <span className="text-xs text-muted-foreground">
                  Applied on {formatDate(application.application_date)}
                </span>
              </div>
            </div>

            {/* Quick Stage Progression Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Update Pipeline Stage
              </label>
              <div className="flex flex-wrap gap-1.5">
                {APPLICATION_STATUSES.map((status) => {
                  const isActive = application.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-foreground border-border"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" /> Location
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {application.location || "Not specified"}
                </span>
              </div>

              <div className="rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3" /> Compensation
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {application.salary || "Not specified"}
                </span>
              </div>

              <div className="rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block flex items-center gap-1 mb-1">
                  <Briefcase className="h-3 w-3" /> Role Type
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {application.employment_type || "Full-time"}
                </span>
              </div>

              <div className="rounded-lg bg-muted/30 p-3">
                <span className="text-xs text-muted-foreground block flex items-center gap-1 mb-1">
                  <Share2 className="h-3 w-3" /> Source Channel
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {application.source || "Direct / Other"}
                </span>
              </div>
            </div>
          </div>

          {/* Deadlines & Scheduling Card */}
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Key Deadlines & Milestone Dates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 bg-muted/10 space-y-1">
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 block">
                  Online Assessment (OA)
                </span>
                <div className="font-bold text-sm text-foreground">
                  {formatDateTime(application.assessment_date)}
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/10 space-y-1">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-400 block">
                  Interview Call / Round
                </span>
                <div className="font-bold text-sm text-foreground">
                  {formatDateTime(application.interview_date)}
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/10 space-y-1">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400 block">
                  Follow-Up Reminder
                </span>
                <div className="font-bold text-sm text-foreground">
                  {formatDate(application.follow_up_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Context Memory Card */}
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-3">
            <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Candidate Notes & Context
            </h3>
            {application.notes ? (
              <div className="rounded-lg bg-muted/30 p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {application.notes}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No personal notes or preparation points recorded for this application yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Application"
        description="Modify details for this job application."
      >
        {application && (
          <ApplicationForm
            initialData={application}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
            isSubmitting={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        application={application}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
