import { z } from "zod";

export const applicationStatusEnum = z.enum([
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
]);

export const applicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(100, "Company name cannot exceed 100 characters"),
  job_title: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(100, "Job title cannot exceed 100 characters"),
  location: z.string().trim().max(100, "Location cannot exceed 100 characters").optional().nullable(),
  job_url: z
    .string()
    .trim()
    .url("Please enter a valid URL (e.g. https://...)")
    .or(z.literal(""))
    .optional()
    .nullable(),
  salary: z.string().trim().max(50, "Salary range cannot exceed 50 characters").optional().nullable(),
  employment_type: z
    .enum(["Full-time", "Internship", "Contract", "Part-time", "Other"])
    .default("Full-time"),
  status: applicationStatusEnum.default("Applied"),
  application_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  assessment_date: z.string().optional().nullable(),
  interview_date: z.string().optional().nullable(),
  follow_up_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .or(z.literal(""))
    .optional()
    .nullable(),
  source: z.string().trim().max(100, "Source cannot exceed 100 characters").optional().nullable(),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional().nullable(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const authSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AuthFormData = z.infer<typeof authSchema>;
