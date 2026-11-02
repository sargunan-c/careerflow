# 06. Product Requirements Document (PRD): CareerFlow MVP

> **Document Status:** Complete (MVP Execution Phase)  
> **Author:** Senior Product Manager & Full-Stack Engineer  
> **Target Audience:** Final-year university students & recent graduates (0–2 years experience)  
> **Repository:** `scratch/careerflow`

---

## 1. Executive Summary & Problem Scope
Early-career job applicants simultaneously manage 30–100+ job applications across diverse platforms (job boards, company ATS, referrals, college placement cells). Without a centralized, high-density dashboard, applicants experience cognitive overload, lose critical context when contacted by recruiters, and suffer from **critical date slippage** (missing tight 48–72 hour online assessment deadlines or interview calls).

### Verified Technical Facts vs. Explicit Working Assumptions
*In accordance with our strict product integrity rules, we explicitly distinguish technical facts from unvalidated user problem assumptions:*

- **Verified Technical Fact:** Supabase Row Level Security (RLS) guarantees complete per-user data isolation at the database layer; users can never read, modify, or delete another user's applications.
- **Verified Technical Fact:** Client-side Zod validation coupled with database CHECK/ENUM constraints prevents invalid recruitment stages and malformed URLs.
- **Unvalidated Assumption A1:** Fresh graduates submit applications in high volume (30+) and abandon spreadsheets primarily because of manual formatting and mobile friction.
- **Unvalidated Assumption A2:** Assessment deadlines (48–72h) are frequently missed without dedicated notification widgets.
- **Unvalidated Assumption A3:** Fresh grads actively execute post-application follow-ups (to be validated through user interviews).

---

## 2. Target Persona: "The Active Graduate Applicant"
- **Profile:** Final-year student (undergraduate or master's) or recent graduate (0–2 years experience) actively applying for graduate schemes, junior developer roles, or internships.
- **Core Jobs-to-be-Done (JTBD):**
  1. *When I submit a job application,* I want to log it in under 30 seconds so that my tracking overhead doesn't slow down my application batch.
  2. *When an employer sends an online assessment (OA) or interview invite,* I want to pin the deadline prominently so that I never miss an evaluation window.
  3. *When an interviewer calls me,* I want to search and view the exact role, salary notes, and company context immediately so that I sound prepared.
  4. *When I evaluate my job hunt progress,* I want to see my stage distribution and active pipeline at a glance so that I stay motivated and organized.

---

## 3. Product Principles
1. **Speed & Zero Bloat:** No AI resume generators, no web scraping permissions, no paywalled features. 100% focused on candidate execution.
2. **First-Class Deadlines:** Assessments and interview countdowns are elevated above static job lists.
3. **Candidate Data Privacy & Ownership:** Personal Supabase PostgreSQL database isolation; 1-click CSV export so applicants own their data forever.
4. **Resilient UX States:** Dedicated loading spinners, informative empty states with call-to-actions, and clear error messaging.

---

## 4. MVP Feature Specification

### 4.1 Authentication & Multi-Tenancy
- Email and password sign-up, sign-in, and sign-out via Supabase Auth.
- Session persistence with `@supabase/ssr` cookies and Next.js middleware protection.
- If Supabase environment variables are not yet configured, the system gracefully presents an honest configuration guidance banner with zero crashes.

### 4.2 Application CRUD Operations
- **Data Model:**
  - Company (required, 1–100 chars)
  - Job Title (required, 1–100 chars)
  - Location (optional, e.g. "Remote", "New York")
  - Job Posting URL (optional, validated URL)
  - Salary Range (optional, e.g. "$75k - $90k")
  - Employment Type (`Full-time`, `Internship`, `Contract`, `Part-time`, `Other`)
  - Status (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`)
  - Application Date (required, YYYY-MM-DD)
  - Assessment Deadline (optional, ISO timestamp)
  - Interview Date (optional, ISO timestamp)
  - Follow-up Date (optional, YYYY-MM-DD)
  - Notes (optional, up to 2000 chars)
- **Inline Status Mutations:** 1-click stage updates directly from the pipeline table or details view.

### 4.3 Search, Filtering & Sorting
- Real-time client-side text search across Company, Job Title, Location, and Notes.
- Status filter pills (`All`, `Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`) with dynamic counts.
- Multi-field sorting (Application Date, Company, Status, Assessment Date, Interview Date) with ascending/descending toggle.

### 4.4 Dashboard Analytics & Visualizations
- **Summary Metrics Cards:**
  - Total Lifetime Applications
  - Active Pipeline (all non-rejected, non-withdrawn roles)
  - Active Interviews Count
  - Job Offers Received
- **Application Stage Funnel Chart:** Interactive Recharts bar visualization showing count and percentage distribution across all 7 statuses.
- **Deadline Radar:** Top 5 upcoming Online Assessments / Interviews and top 5 scheduled follow-ups with color-coded urgency badges.

### 4.5 Data Portability
- Instant CSV export triggering RFC-4180 compliant CSV file generation with proper quote escaping.

---

## 5. Explicit MVP Non-Goals
- Automated job board scraping (violates terms of service, creates flaky brittle integrations).
- AI resume/cover letter writing (feature bloat that detracts from execution clarity).
- Invasive browser extensions (privacy risk).
- Paywalls, subscriptions, or Stripe billing.
