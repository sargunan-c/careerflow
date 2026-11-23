# Product Requirements Document (PRD) — CareerFlow

**Document Version:** 1.2  
**Author:** Sargunan C (Targeting APM / Product Analyst / Ops Analyst Roles)  
**Status:** Implemented & Verified in Codebase  

---

## 1. Problem Statement

Final-year college students and early-career job seekers apply to 50–150+ opportunities across multiple platforms (LinkedIn, Naukri, Internshala, campus placement drives, and company career portals). However:
1. **Pipeline Disorganization:** Applications, follow-up dates, and online assessment (OA) deadlines are tracked across disparate spreadsheets or forgotten in email threads.
2. **Missing Milestone Governance:** Candidates miss critical 48-hour online assessment windows or scheduled recruiter calls due to lack of date-anchored milestone tracking.
3. **Skill-to-JD Mismatch:** Applicants blindly send generic resumes without understanding how their current skillset maps to specific job requirements or what technical gaps need immediate study.
4. **Lack of Conversion Analytics:** Job seekers cannot see where they are falling out of the hiring funnel (Application -> Assessment -> Interview -> Offer) or which application sources produce the highest interview rates.

---

## 2. Target Users & Personas

### Persona A: The Final-Year Engineering Student (Campus & Off-Campus)
* **Demographics:** Final-year B.Tech graduate in India (e.g., ECE, CSE, IT) targeting fresher roles (APM, Junior PM, Analyst, Software Engineer).
* **Pain Points:** Balancing college exams with multiple off-campus hiring drives; tracking OA test links with strict 48-hour expirations; determining which skills to prepare for upcoming interviews.
* **Goal:** A unified dashboard to record applications within 10 seconds, track deadlines, analyze job descriptions, and see interview conversion metrics.

### Persona B: The 0–1 Year Trainee / Early Career Switcher
* **Demographics:** Early career professional applying for entry-level analyst or associate product roles.
* **Pain Points:** Spreadsheets lack visual funnel metrics; difficulty comparing multi-round interview stages; need to benchmark skill requirements across target job descriptions.
* **Goal:** Clean operational tracking with CSV export, RLS data security, and automated JD parsing without expensive paid subscriptions.

---

## 3. Product Goals & Success Metrics

| Goal | Success Metric (KPI) | Target |
|---|---|---|
| Streamline Application Logging | Time to create and record a new application | < 30 seconds |
| Prevent Missed OA Deadlines | Zero missed upcoming milestones via deadline alerts | 100% visible on dashboard |
| Actionable JD Skill Matching | Instant extraction of required skills and gaps without paid APIs | < 1 second local parse |
| Pipeline Visibility | Accurate real-time conversion rates (Interview %, Rejection %, Offer %) | 100% database-driven |
| Data Portability | 1-click CSV backup with all metadata fields | Full CSV export |

---

## 4. Scope & System Architecture

### 4.1 In-Scope (Implemented)
* **Authentication & Security:** Supabase Auth with PostgreSQL Row-Level Security (RLS) guaranteeing per-user isolation.
* **Application Lifecycle Management:** 7 status stages (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`).
* **Milestone & Follow-Up Tracking:** Datetime tracking for Online Assessments (OA), technical/HR interviews, and recruiter follow-ups.
* **Product Analytics Dashboard:** Total applications, active pipeline count, interview conversion rate (%), rejection rate (%), offer conversion rate (%), status funnel chart, monthly application activity trend, and application source distribution.
* **Job Description Intelligence:** Local heuristic parsing engine extracting job title, experience level, responsibilities, requirements, required/preferred skills, candidate match score (%), and ranked learning priorities.
* **Data Management:** Search across company, title, location, source, and notes; multi-status filtering; multi-attribute sorting; and RFC 4180-compliant CSV export.

### 4.2 Out-of-Scope (Deliberately Excluded)
* **Paid LLM / Third-party AI APIs:** Replaced with deterministic local regex and taxonomy-based parsing to ensure 100% uptime, zero API key dependency, and zero operating cost.
* **Automated Scraping of Job Portals:** Excluded to avoid bot blocks, brittle scrapers, and legal TOS violations; user pastes JD directly.
* **Resume PDF Generation:** Excluded to keep the SaaS focused on pipeline tracking and interview prep intelligence rather than document formatting.

---

## 5. Functional Requirements

### FR-01: Authentication & Session
* Users can sign up and log in via email/password.
* Unauthenticated requests to protected dashboard routes are redirected to `/login`.
* If Supabase credentials are not yet configured in local environment, a prominent informational banner displays guidance without crashing the application.

### FR-02: Pipeline Management & CRUD
* Users can create, view, edit, and delete application records.
* Form validation enforces mandatory company name, job title, and application date (YYYY-MM-DD format).
* Optional fields include location, salary/stipend, employment type, application source, job URL, assessment datetime, interview datetime, follow-up date, and notes.

### FR-03: Real-Time Metrics & Funnel Visualization
* Dashboard calculates metrics dynamically from actual database records:
  $$\text{Interview Conversion Rate} = \left(\frac{\text{Interviews}}{\text{Total Applications}}\right) \times 100$$
  $$\text{Rejection Rate} = \left(\frac{\text{Rejected}}{\text{Total Applications}}\right) \times 100$$
  $$\text{Offer Conversion Rate} = \left(\frac{\text{Offers}}{\text{Total Applications}}\right) \times 100$$
* Empty database states must render clear, helpful zero-state cards with zero hardcoded sample metrics.
* Monthly volume timeline groups records chronologically by `application_date`.
* Source distribution visualizes application channels (LinkedIn, Referral, Career Site, etc.).

### FR-04: Job Description Intelligence Engine
* Accepts pasted JD text and candidate's current skill profile.
* Deterministically identifies:
  * Job title (e.g. Associate Product Manager, Product Analyst, Software Engineer).
  * Experience expectations (e.g. 0-1 years, Fresher).
  * Key responsibilities and requirements bullets.
  * Required skills vs. preferred skills using a curated taxonomy of 20+ product and tech competencies.
  * Match score percentage against candidate's entered skills.
  * Actionable, ranked learning priorities for identified skill gaps.
* Outputs a prominent disclaimer: *"Automated Heuristic Analysis: Intended for preparation and alignment; not a predictive hiring guarantee."*

### FR-05: Data Export
* Generates CSV format containing all 13 fields including `Source` and dates, escaping quotes and commas correctly.

---

## 6. Non-Functional Requirements (NFRs)

* **Performance:** Client-side state transitions complete in < 100ms. Local JD parsing executes in < 50ms.
* **Security & Privacy:** Enforced Supabase Row-Level Security (RLS) ensures users can never read, update, or delete another user's job applications. No secret service-role keys are exposed in client bundles.
* **Reliability:** Built with TypeScript strict mode, Zod input validation, and Vitest test coverage across utilities and parsing engines.
* **Responsiveness:** Fully responsive interface tested across mobile viewports (collapsible drawer, card layout) and desktop viewports (table, persistent sidebar).
