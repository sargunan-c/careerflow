# 07. User Stories and Acceptance Criteria (AC)

> **Standard:** Gherkin syntax (`Given... When... Then...`)  
> **Status:** MVP Implemented & Verified

---

## Story 1: Fast Application Entry
**As an** active graduate applicant submitting batches of applications,  
**I want to** quickly record a new job application with key role details and dates in under 30 seconds,  
**So that** I don't lose track of where I have applied without slowing down my application momentum.

### Acceptance Criteria
- **AC 1.1:** Clicking "Add Application" opens an accessible, focused modal dialog.
- **AC 1.2:** Company name, Job Title, and Application Date are strictly validated as mandatory fields.
- **AC 1.3:** If Job URL is provided, it must be validated as a syntactically valid web URL; invalid URLs show inline error feedback.
- **AC 1.4:** Status defaults to `Applied` with full options: `Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
- **AC 1.5:** Submitting saves the record directly to the database scoped to the authenticated `user_id` and immediately updates the UI without requiring a hard browser reload.

---

## Story 2: Critical Assessment & Interview Deadline Tracking
**As an** applicant with tight 48–72 hour online assessments,  
**I want to** clearly see upcoming assessment and interview deadlines on my dashboard,  
**So that** I never miss an evaluation window or scramble unprepared for an interview.

### Acceptance Criteria
- **AC 2.1:** Applications allow setting an optional `assessment_date` (datetime) and `interview_date` (datetime).
- **AC 2.2:** Active deadlines are displayed in the "Upcoming Deadlines & Interviews" dashboard widget, sorted chronologically.
- **AC 2.3:** Applications with statuses `Rejected` or `Withdrawn` are automatically excluded from the active deadline radar.
- **AC 2.4:** In the application table, upcoming assessments are badged in amber (`OA: <Date>`), and interviews in purple (`Interview: <Date>`).

---

## Story 3: Application Pipeline Management & Fast Inline Status Progression
**As an** applicant navigating multiple interview stages,  
**I want to** update the status of any application with a single click,  
**So that** my pipeline reflects my current hiring stage with zero administrative friction.

### Acceptance Criteria
- **AC 3.1:** Users can change an application's status directly from the table or card dropdown without opening a full edit form.
- **AC 3.2:** Status changes immediately update the row visually (optimistic update) and persist to Supabase.
- **AC 3.3:** The stage distribution funnel chart and active pipeline count automatically recalculate.

---

## Story 4: Search, Filtering & Instant Recall
**As an** applicant receiving an unexpected call from a recruiter,  
**I want to** search for the company name, role, or notes instantly,  
**So that** I have immediate context on the job description, salary expectation, and referral notes.

### Acceptance Criteria
- **AC 4.1:** The search input performs case-insensitive client-side filtering across `company`, `job_title`, `location`, and `notes`.
- **AC 4.2:** Filter chips allow isolating applications by status (`All`, `Saved`, `Applied`, etc.) with real-time record counts.
- **AC 4.3:** Multi-field sorting supports ordering by Application Date, Company, Status, Assessment Date, and Interview Date with Ascending/Descending toggle.

---

## Story 5: Data Portability via CSV Export
**As an** applicant who values ownership of their career data,  
**I want to** export all my tracked applications to a standard CSV file,  
**So that** I have an offline backup or can share my progress with a career mentor.

### Acceptance Criteria
- **AC 5.1:** Clicking "Export CSV" generates an RFC-4180 compliant CSV file containing all visible/filtered application records.
- **AC 5.2:** Commas, quotation marks, and multiline notes are safely escaped (`"..."`).
- **AC 5.3:** The file downloads immediately in the browser with filename `careerflow_applications.csv`.

---

## Story 6: Per-User Data Isolation (Security)
**As a** privacy-conscious job seeker,  
**I want to** ensure that only I can view and edit my application records,  
**So that** my salary expectations, notes, and application history remain completely confidential.

### Acceptance Criteria
- **AC 6.1:** Supabase Row Level Security (RLS) is enabled on `public.applications`.
- **AC 6.2:** Queries use `auth.uid() = user_id` for SELECT, INSERT, UPDATE, and DELETE policies.
- **AC 6.3:** Attempting to query or mutate another user's application returns empty or unauthorized errors at the database layer.

