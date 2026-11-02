"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormData } from "@/lib/validations/application";
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  initialData?: JobApplication | null;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ApplicationFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues: Partial<ApplicationFormData> = {
    company: initialData?.company || "",
    job_title: initialData?.job_title || "",
    location: initialData?.location || "",
    job_url: initialData?.job_url || "",
    salary: initialData?.salary || "",
    employment_type: (initialData?.employment_type as any) || "Full-time",
    status: initialData?.status || "Applied",
    application_date: initialData?.application_date || new Date().toISOString().split("T")[0],
    assessment_date: initialData?.assessment_date ? initialData.assessment_date.slice(0, 16) : "",
    interview_date: initialData?.interview_date ? initialData.interview_date.slice(0, 16) : "",
    follow_up_date: initialData?.follow_up_date || "",
    notes: initialData?.notes || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: ApplicationFormData) => {
    try {
      setServerError(null);
      // Normalize empty strings to null for optional fields
      const normalizedData: ApplicationFormData = {
        ...data,
        location: data.location?.trim() ? data.location.trim() : null,
        job_url: data.job_url?.trim() ? data.job_url.trim() : null,
        salary: data.salary?.trim() ? data.salary.trim() : null,
        assessment_date: data.assessment_date?.trim() ? new Date(data.assessment_date).toISOString() : null,
        interview_date: data.interview_date?.trim() ? new Date(data.interview_date).toISOString() : null,
        follow_up_date: data.follow_up_date?.trim() ? data.follow_up_date.trim() : null,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      };
      await onSubmit(normalizedData);
    } catch (err: any) {
      setServerError(err?.message || "Failed to save application. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-sm">
      {serverError && (
        <div className="rounded-md bg-destructive/15 p-3 text-xs text-destructive">
          {serverError}
        </div>
      )}

      {/* Row 1: Company & Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-foreground mb-1">
            Company Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Google, Stripe, Local Startup"
            {...register("company")}
            aria-invalid={!!errors.company}
          />
          {errors.company && (
            <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-foreground mb-1">
            Job Title <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Junior Software Engineer"
            {...register("job_title")}
            aria-invalid={!!errors.job_title}
          />
          {errors.job_title && (
            <p className="mt-1 text-xs text-destructive">{errors.job_title.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Status & Employment Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-foreground mb-1">Status</label>
          <select
            {...register("status")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-foreground mb-1">Employment Type</label>
          <select
            {...register("employment_type")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Row 3: Application Date & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-foreground mb-1">
            Application Date <span className="text-destructive">*</span>
          </label>
          <Input type="date" {...register("application_date")} />
          {errors.application_date && (
            <p className="mt-1 text-xs text-destructive">{errors.application_date.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-foreground mb-1">Location</label>
          <Input placeholder="e.g. Remote, New York, London" {...register("location")} />
        </div>
      </div>

      {/* Row 4: Job URL & Salary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-foreground mb-1">Job Post URL</label>
          <Input placeholder="https://..." {...register("job_url")} />
          {errors.job_url && (
            <p className="mt-1 text-xs text-destructive">{errors.job_url.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-foreground mb-1">Salary Range (Optional)</label>
          <Input placeholder="e.g. $70,000 - $85,000" {...register("salary")} />
        </div>
      </div>

      {/* Critical Milestone Dates Section */}
      <div className="rounded-lg border bg-muted/30 p-3.5 space-y-3">
        <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block">
          Key Deadlines & Scheduling
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Assessment Deadline
            </label>
            <Input type="datetime-local" {...register("assessment_date")} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Interview Date/Time
            </label>
            <Input type="datetime-local" {...register("interview_date")} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Follow-Up Date
            </label>
            <Input type="date" {...register("follow_up_date")} />
          </div>
        </div>
      </div>

      {/* Notes Field */}
      <div>
        <label className="block font-medium text-foreground mb-1">Notes & Follow-up Details</label>
        <textarea
          rows={3}
          placeholder="Contact recruiter names, referral notes, OA topics, interview preparation links..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register("notes")}
        />
        {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-3 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Application" : "Save Application"}
        </Button>
      </div>
    </form>
  );
}

