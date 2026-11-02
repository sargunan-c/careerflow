"use client";

import React from "react";
import Link from "next/link";
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ExternalLink, Edit2, Trash2, Calendar, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationTableProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (app: JobApplication, newStatus: ApplicationStatus) => void;
}

export function ApplicationTable({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground border-b">
          <tr>
            <th className="py-3 px-4 font-semibold">Company & Role</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Applied</th>
            <th className="py-3 px-4 font-semibold">Key Milestone / Deadline</th>
            <th className="py-3 px-4 font-semibold">Location / Salary</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((app) => {
            const hasUpcomingAssessment = app.assessment_date;
            const hasUpcomingInterview = app.interview_date;

            return (
              <tr
                key={app.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Company & Role */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Link
                      href={`/applications/${app.id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {app.company}
                    </Link>
                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-primary inline-flex items-center"
                        title="Open Job Posting"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{app.job_title}</div>
                </td>

                {/* Status with Quick Change */}
                <td className="py-3.5 px-4">
                  <div className="relative inline-block">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        onStatusChange(app, e.target.value as ApplicationStatus)
                      }
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      title="Click to update status"
                    >
                      {APPLICATION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <StatusBadge status={app.status} />
                  </div>
                </td>

                {/* Applied Date */}
                <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(app.application_date)}
                </td>

                {/* Key Milestone / Deadline */}
                <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                  {hasUpcomingAssessment ? (
                    <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      <Clock className="h-3.5 w-3.5" />
                      <span>OA: {formatDateTime(app.assessment_date)}</span>
                    </div>
                  ) : hasUpcomingInterview ? (
                    <div className="inline-flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Interview: {formatDateTime(app.interview_date)}</span>
                    </div>
                  ) : app.follow_up_date ? (
                    <div className="text-muted-foreground">
                      Follow-up: {formatDate(app.follow_up_date)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </td>

                {/* Location / Salary */}
                <td className="py-3.5 px-4 text-xs text-muted-foreground">
                  <div>{app.location || "Remote / Unspecified"}</div>
                  {app.salary && <div className="text-foreground/80 font-medium">{app.salary}</div>}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/applications/${app.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(app)}
                      title="Edit Application"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(app)}
                      title="Delete Application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
