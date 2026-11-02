import { describe, it, expect } from "vitest";
import { calculateMetrics } from "../src/lib/utils";
import { JobApplication } from "../src/types";

describe("Dashboard Metrics Calculation", () => {
  const mockApplications: JobApplication[] = [
    {
      id: "1",
      user_id: "u1",
      company: "Stripe",
      job_title: "Fullstack Engineer",
      location: "San Francisco, CA",
      job_url: "https://stripe.com",
      salary: "$130k",
      employment_type: "Full-time",
      status: "Applied",
      application_date: "2026-10-01",
      assessment_date: null,
      interview_date: null,
      follow_up_date: "2026-10-15",
      notes: null,
      created_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
    },
    {
      id: "2",
      user_id: "u1",
      company: "Datadog",
      job_title: "Software Engineer",
      location: "New York, NY",
      job_url: null,
      salary: null,
      employment_type: "Full-time",
      status: "Interview",
      application_date: "2026-10-05",
      assessment_date: null,
      interview_date: "2026-11-12T15:00:00Z",
      follow_up_date: null,
      notes: "System design round",
      created_at: "2026-10-05T00:00:00Z",
      updated_at: "2026-10-05T00:00:00Z",
    },
    {
      id: "3",
      user_id: "u1",
      company: "Meta",
      job_title: "Product Engineer",
      location: "Menlo Park, CA",
      job_url: null,
      salary: "$150k",
      employment_type: "Full-time",
      status: "Offer",
      application_date: "2026-09-15",
      assessment_date: null,
      interview_date: null,
      follow_up_date: null,
      notes: "Received written offer",
      created_at: "2026-09-15T00:00:00Z",
      updated_at: "2026-09-15T00:00:00Z",
    },
    {
      id: "4",
      user_id: "u1",
      company: "Netflix",
      job_title: "UI Engineer",
      location: "Los Gatos, CA",
      job_url: null,
      salary: null,
      employment_type: "Full-time",
      status: "Rejected",
      application_date: "2026-09-20",
      assessment_date: null,
      interview_date: null,
      follow_up_date: null,
      notes: "Position closed",
      created_at: "2026-09-20T00:00:00Z",
      updated_at: "2026-09-20T00:00:00Z",
    },
    {
      id: "5",
      user_id: "u1",
      company: "Uber",
      job_title: "Backend Engineer",
      location: "Seattle, WA",
      job_url: null,
      salary: null,
      employment_type: "Full-time",
      status: "Withdrawn",
      application_date: "2026-09-25",
      assessment_date: null,
      interview_date: null,
      follow_up_date: null,
      notes: "Accepted another role",
      created_at: "2026-09-25T00:00:00Z",
      updated_at: "2026-09-25T00:00:00Z",
    },
  ];

  it("calculates total, active, interview, and offer counts accurately", () => {
    const metrics = calculateMetrics(mockApplications);

    expect(metrics.total).toBe(5);
    // Active excludes Rejected (id: 4) and Withdrawn (id: 5)
    expect(metrics.active).toBe(3);
    expect(metrics.interviews).toBe(1);
    expect(metrics.offers).toBe(1);
  });

  it("calculates status distribution accurately with percentages", () => {
    const metrics = calculateMetrics(mockApplications);

    const appliedStat = metrics.statusDistribution.find((s) => s.status === "Applied");
    const interviewStat = metrics.statusDistribution.find((s) => s.status === "Interview");
    const offerStat = metrics.statusDistribution.find((s) => s.status === "Offer");
    const rejectedStat = metrics.statusDistribution.find((s) => s.status === "Rejected");
    const withdrawnStat = metrics.statusDistribution.find((s) => s.status === "Withdrawn");

    expect(appliedStat?.count).toBe(1);
    expect(appliedStat?.percentage).toBe(20);

    expect(interviewStat?.count).toBe(1);
    expect(offerStat?.count).toBe(1);
    expect(rejectedStat?.count).toBe(1);
    expect(withdrawnStat?.count).toBe(1);
  });

  it("handles zero applications gracefully without division by zero", () => {
    const emptyMetrics = calculateMetrics([]);

    expect(emptyMetrics.total).toBe(0);
    expect(emptyMetrics.active).toBe(0);
    expect(emptyMetrics.interviews).toBe(0);
    expect(emptyMetrics.offers).toBe(0);
    expect(emptyMetrics.upcomingDeadlines).toHaveLength(0);
    expect(emptyMetrics.pendingFollowUps).toHaveLength(0);

    emptyMetrics.statusDistribution.forEach((stat) => {
      expect(stat.count).toBe(0);
      expect(stat.percentage).toBe(0);
    });
  });
});
