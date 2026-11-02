export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export type EmploymentType = "Full-time" | "Internship" | "Contract" | "Part-time" | "Other";

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  job_title: string;
  location: string | null;
  job_url: string | null;
  salary: string | null;
  employment_type: string | null;
  status: ApplicationStatus;
  application_date: string; // YYYY-MM-DD
  assessment_date: string | null; // ISO string
  interview_date: string | null; // ISO string
  follow_up_date: string | null; // YYYY-MM-DD
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">;

export interface DashboardMetrics {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  statusDistribution: { status: ApplicationStatus; count: number; percentage: number }[];
  upcomingDeadlines: JobApplication[];
  pendingFollowUps: JobApplication[];
}

export interface ApplicationFilters {
  search: string;
  status: ApplicationStatus | "All";
  sortBy: "application_date" | "company" | "status" | "assessment_date" | "interview_date";
  sortOrder: "asc" | "desc";
}
