import { describe, it, expect } from "vitest";
import { generateCSV } from "../src/lib/utils";
import { JobApplication } from "../src/types";

describe("CSV Export Generator", () => {
  const sampleApps: JobApplication[] = [
    {
      id: "app-1",
      user_id: "user-1",
      company: 'Acme "Global", Inc.',
      job_title: "Software Engineer",
      location: "San Francisco, CA",
      job_url: "https://acme.com/jobs/1",
      salary: "$100,000",
      employment_type: "Full-time",
      status: "Applied",
      application_date: "2026-11-01",
      assessment_date: null,
      interview_date: null,
      follow_up_date: null,
      notes: "Line 1\nLine 2 with comma, and quotes",
      created_at: "2026-11-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
    },
  ];

  it("includes the correct CSV column headers", () => {
    const csv = generateCSV(sampleApps);
    const lines = csv.split("\r\n");

    expect(lines[0]).toBe(
      "Company,Job Title,Status,Application Date,Location,Employment Type,Salary Range,Source,Assessment Date,Interview Date,Follow-up Date,Job URL,Notes"
    );
  });

  it("escapes quotes and handles special characters in fields", () => {
    const csv = generateCSV(sampleApps);
    const lines = csv.split("\r\n");
    // Row 2 is the data row
    expect(lines[1]).toContain('"Acme ""Global"", Inc."');
    expect(lines[1]).toContain('"$100,000"');
  });

  it("handles null or undefined fields cleanly without throwing", () => {
    const minimalApp: JobApplication = {
      id: "app-2",
      user_id: "user-1",
      company: "Startup",
      job_title: "Intern",
      location: null,
      job_url: null,
      salary: null,
      employment_type: null,
      status: "Saved",
      application_date: "2026-11-02",
      assessment_date: null,
      interview_date: null,
      follow_up_date: null,
      notes: null,
      created_at: "2026-11-02T00:00:00Z",
      updated_at: "2026-11-02T00:00:00Z",
    };

    const csv = generateCSV([minimalApp]);
    expect(csv).toBeDefined();
    expect(csv).toContain('"Startup"');
    expect(csv).toContain('""');
  });
});

