import { describe, it, expect } from "vitest";
import { applicationSchema } from "../src/lib/validations/application";

describe("Application Zod Schema Validation", () => {
  it("validates a complete, valid job application object", () => {
    const validData = {
      company: "Google",
      job_title: "Associate Product Manager",
      location: "Mountain View, CA",
      job_url: "https://careers.google.com/jobs/123",
      salary: "$120,000 - $140,000",
      employment_type: "Full-time",
      status: "Applied",
      application_date: "2026-11-01",
      assessment_date: "2026-11-05T10:00:00.000Z",
      interview_date: "2026-11-10T14:00:00.000Z",
      follow_up_date: "2026-11-15",
      notes: "Met recruiter at university career fair",
    };

    const result = applicationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when company name is missing or empty", () => {
    const invalidData = {
      company: "",
      job_title: "Software Engineer",
      application_date: "2026-11-01",
    };

    const result = applicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.company).toContain(
        "Company name is required"
      );
    }
  });

  it("fails when job title is missing or empty", () => {
    const invalidData = {
      company: "Microsoft",
      job_title: "   ",
      application_date: "2026-11-01",
    };

    const result = applicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.job_title).toContain(
        "Job title is required"
      );
    }
  });

  it("rejects an invalid recruitment status", () => {
    const invalidData = {
      company: "Amazon",
      job_title: "SDE I",
      status: "SuperSaved", // invalid status
      application_date: "2026-11-01",
    };

    const result = applicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("rejects malformed URLs in job_url", () => {
    const invalidData = {
      company: "Stripe",
      job_title: "Frontend Engineer",
      job_url: "not-a-valid-url",
      application_date: "2026-11-01",
    };

    const result = applicationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("allows empty or null optional fields", () => {
    const minimalData = {
      company: "Apple",
      job_title: "Hardware Engineer Intern",
      application_date: "2026-11-01",
      location: null,
      job_url: "",
      salary: null,
      notes: null,
    };

    const result = applicationSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});
