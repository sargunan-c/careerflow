"use client";

import React from "react";
import Link from "next/link";
import { JobApplication, ApplicationStatus } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ExternalLink, Edit2, Trash2, Calendar, Clock, MapPin, DollarSign, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (app: JobApplication, newStatus: ApplicationStatus) => void;
}

export function ApplicationCard({
  application: app,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs space-y-3">
      {/* Top row: Company, Role & Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
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
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{app.job_title}</p>
        </div>
        <StatusBadge status={app.status} size="sm" />
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
        {app.source && (
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
            {app.source}
          </span>
        )}
        {app.location && (
          <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded">
            <MapPin className="h-3 w-3" />
            {app.location}
          </span>
        )}
        {app.salary && (
          <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded">
            <DollarSign className="h-3 w-3" />
            {app.salary}
          </span>
        )}
        <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded">
          <Calendar className="h-3 w-3" />
          Applied: {formatDate(app.application_date)}
        </span>
      </div>

      {/* Deadline Alert if active */}
      {app.assessment_date && (
        <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-2 text-xs text-amber-800 dark:text-amber-300">
          <Clock className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Assessment:</strong> {formatDateTime(app.assessment_date)}
          </span>
        </div>
      )}

      {app.interview_date && (
        <div className="flex items-center gap-2 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-2 text-xs text-purple-800 dark:text-purple-300">
          <Calendar className="h-4 w-4 shrink-0 text-purple-600" />
          <span>
            <strong>Interview:</strong> {formatDateTime(app.interview_date)}
          </span>
        </div>
      )}

      {/* Actions row */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Link href={`/applications/${app.id}`}>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            <Eye className="mr-1 h-3.5 w-3.5" /> Details
          </Button>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onEdit(app)}
          >
            <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(app)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
