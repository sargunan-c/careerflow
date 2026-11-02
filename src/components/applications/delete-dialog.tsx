"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { JobApplication } from "@/types";

interface DeleteDialogProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteDialog({
  application,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteDialogProps) {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Application"
      description="This action cannot be undone. Are you sure you want to permanently remove this application?"
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-3 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-sm">
              {application.company} — {application.job_title}
            </p>
            <p className="text-muted-foreground mt-0.5">
              Status: {application.status} • Applied: {application.application_date}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
