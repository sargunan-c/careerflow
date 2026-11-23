"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Modal } from "@/components/ui/modal";
import { ApplicationForm } from "@/components/applications/application-form";
import { ApplicationFormData } from "@/lib/validations/application";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const handleCreateApplication = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      if (!configured) {
        throw new Error(
          "Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to persist applications."
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to create an application.");
      }

      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
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
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsAddModalOpen(false);
      // Trigger a soft refresh across client components
      window.dispatchEvent(new Event("careerflow:refresh"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => setIsAddModalOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Global Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Job Application"
        description="Record a new application to keep track of interview rounds, OAs, and follow-ups."
      >
        <ApplicationForm
          onSubmit={handleCreateApplication}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
