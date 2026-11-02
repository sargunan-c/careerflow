import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobApplication, DashboardMetrics, ApplicationStatus, APPLICATION_STATUSES } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function calculateMetrics(applications: JobApplication[]): DashboardMetrics {
  const total = applications.length;

  // Active applications = not Rejected and not Withdrawn
  const active = applications.filter(
    (app) => app.status !== "Rejected" && app.status !== "Withdrawn"
  ).length;

  const interviews = applications.filter((app) => app.status === "Interview").length;
  const offers = applications.filter((app) => app.status === "Offer").length;

  // Status Distribution
  const counts: Record<ApplicationStatus, number> = {
    Saved: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
    Withdrawn: 0,
  };

  applications.forEach((app) => {
    if (counts[app.status] !== undefined) {
      counts[app.status]++;
    }
  });

  const statusDistribution = APPLICATION_STATUSES.map((status) => ({
    status,
    count: counts[status],
    percentage: total > 0 ? Math.round((counts[status] / total) * 100) : 0,
  }));

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Upcoming deadlines: assessment or interview date >= today (or within the last 24h)
  const upcomingDeadlines = applications
    .filter((app) => {
      if (app.status === "Rejected" || app.status === "Withdrawn") return false;
      const targetDate = app.assessment_date || app.interview_date;
      if (!targetDate) return false;
      const d = new Date(targetDate);
      return !isNaN(d.getTime());
    })
    .sort((a, b) => {
      const dateA = new Date(a.assessment_date || a.interview_date || "").getTime();
      const dateB = new Date(b.assessment_date || b.interview_date || "").getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  // Pending follow-ups
  const pendingFollowUps = applications
    .filter((app) => {
      if (app.status === "Rejected" || app.status === "Withdrawn") return false;
      if (!app.follow_up_date) return false;
      const d = new Date(app.follow_up_date);
      return !isNaN(d.getTime());
    })
    .sort((a, b) => {
      const dateA = new Date(a.follow_up_date || "").getTime();
      const dateB = new Date(b.follow_up_date || "").getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  return {
    total,
    active,
    interviews,
    offers,
    statusDistribution,
    upcomingDeadlines,
    pendingFollowUps,
  };
}

export function generateCSV(applications: JobApplication[]): string {
  const headers = [
    "Company",
    "Job Title",
    "Status",
    "Application Date",
    "Location",
    "Employment Type",
    "Salary Range",
    "Assessment Date",
    "Interview Date",
    "Follow-up Date",
    "Job URL",
    "Notes",
  ];

  const escapeCSV = (val: string | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = applications.map((app) => [
    escapeCSV(app.company),
    escapeCSV(app.job_title),
    escapeCSV(app.status),
    escapeCSV(app.application_date),
    escapeCSV(app.location),
    escapeCSV(app.employment_type),
    escapeCSV(app.salary),
    escapeCSV(app.assessment_date),
    escapeCSV(app.interview_date),
    escapeCSV(app.follow_up_date),
    escapeCSV(app.job_url),
    escapeCSV(app.notes),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

export function downloadCSV(applications: JobApplication[], filename = "careerflow_applications.csv") {
  const csvContent = generateCSV(applications);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
