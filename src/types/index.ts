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
  source?: string | null; // e.g. LinkedIn, Referral, Company Site, Job Board, Campus
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = Omit<JobApplication, "id" | "user_id" | "created_at" | "updated_at">;

export interface StatusDistributionItem {
  status: ApplicationStatus;
  count: number;
  percentage: number;
}

export interface ActivityOverTimeItem {
  period: string; // e.g. "2026-10", "Oct 2026"
  count: number;
}

export interface SourceBreakdownItem {
  source: string;
  count: number;
  percentage: number;
}

export interface DashboardMetrics {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  interviewConversionRate: number; // (interviews / total) * 100
  rejectionRate: number; // (rejected / total) * 100
  offerConversionRate: number; // (offers / total) * 100
  statusDistribution: StatusDistributionItem[];
  activityOverTime: ActivityOverTimeItem[];
  sourceBreakdown: SourceBreakdownItem[];
  upcomingDeadlines: JobApplication[];
  pendingFollowUps: JobApplication[];
}

export interface ApplicationFilters {
  search: string;
  status: ApplicationStatus | "All";
  sortBy: "application_date" | "company" | "status" | "assessment_date" | "interview_date";
  sortOrder: "asc" | "desc";
}

export interface LearningPriority {
  skill: string;
  priority: "High" | "Medium" | "Low";
  actionableAdvice: string;
}

export interface JDAnalysisResult {
  jobTitle: string;
  experienceLevel: string;
  keyRequirements: string[];
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  candidateSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  learningPriorities: LearningPriority[];
  disclaimer: string;
}
