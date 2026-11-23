# Product Roadmap — CareerFlow

**Document Version:** 1.1  
**Product Strategy:** Transitioning CareerFlow from a personal job tracker into a comprehensive career intelligence and workflow platform for early-career professionals in India.

---

## Strategic Themes

1. **Pipeline Reliability & Data Isolation (Q3 2026 — Completed):**  
   Core CRUD, Supabase PostgreSQL RLS multi-tenant security, date-anchored milestone reminders, and responsive layout.

2. **Analytics & Funnel Intelligence (Q4 2026 — Completed / Current):**  
   Calculated conversion rates (Interview %, Rejection %, Offer %), chronological application volume trends, source breakdown, and local Job Description Intelligence with skill-gap extraction.

3. **Interview Preparation & Workflow Automation (Q1 2027 — Planned):**  
   Targeted question banks per role type, browser extension for 1-click job clipping, and email notification webhooks.

4. **Peer Benchmarking & Career Community (Q2 2027 — Future Vision):**  
   Aggregated salary insights for entry-level roles in India, anonymous placement timelines, and peer mock interviews.

---

## Release Milestones

```
+----------------------------------------------------------------------------------------------------+
| 2026                                                              | 2027                           |
| Q3 (v1.0 - Core Pipeline) | Q4 (v1.1 - Intelligence & Analytics)  | Q1 (v1.2 - Automation)         |
| [X] Supabase Auth + RLS   | [X] Interview & Rejection Rates       | [ ] Chrome Job Clipper         |
| [X] 7-Stage Status Enum   | [X] Monthly Activity Timeline         | [ ] Calendar Sync (.ics/Google)|
| [X] Milestone OA Dates    | [X] Application Channel Breakdown     | [ ] Role Question Bank (APM/BA)|
| [X] CSV Export Engine     | [X] Local Job Description Intelligence| [ ] Email Reminder Webhooks    |
| [X] Responsive UI Shell   | [X] Skill Match & Learning Priorities | [ ] Multi-resume Tagging       |
+----------------------------------------------------------------------------------------------------+
```

---

## Detailed Milestone Breakdown

### Milestone 1: Core Application Pipeline (v1.0 — Completed)
* **Goal:** Replace unstructured spreadsheets with an isolated, authenticated relational SaaS.
* **Delivered Capabilities:**
  * Supabase Auth integration (login/register).
  * Strict Row-Level Security (`USING (auth.uid() = user_id)`).
  * Comprehensive form validation with Zod and React Hook Form.
  * Desktop data table with quick inline status updates and mobile-friendly card layout.
  * RFC-compliant CSV export for offline backups.

### Milestone 2: Product Intelligence & Funnel Analytics (v1.1 — Completed / Current)
* **Goal:** Provide actionable analytics on pipeline health and candidate skill readiness.
* **Delivered Capabilities:**
  * **Core Conversion KPIs:** Dynamic computation of Interview Conversion Rate, Rejection Rate, and Offer Conversion Rate from real database records.
  * **Activity Over Time:** Monthly application volume timeline visualizing job hunt momentum.
  * **Channel Breakdown:** Tracking performance across LinkedIn, Referrals, Company Portals, and Campus Placement.
  * **Job Description Intelligence:** Deterministic regex-and-taxonomy parsing extracting job title, experience level, responsibilities, requirements, and required vs. preferred skills.
  * **Candidate Skill-Match Benchmarking:** Side-by-side comparison yielding match score (%) and ranked learning priorities with actionable preparation advice.
  * **Zero-State Resilience:** Graceful handling of empty pipelines with helpful onboarding guidance.

### Milestone 3: Workflow Automation & Extensions (v1.2 — Next Horizon / Planned)
* **Goal:** Reduce application logging friction from 30 seconds to 3 seconds.
* **Features in Backlog:**
  * **Browser Extension (Manifest V3):** Clip job details directly from LinkedIn and Naukri job posts into the user's CareerFlow account.
  * **Calendar Sync Integration:** Export OA deadlines and interview times directly as `.ics` downloads or Google Calendar sync links.
  * **APM & Analyst Case Study Framework:** Built-in template for structuring take-home assignments and design challenges.

### Milestone 4: Career Insights & Collaborative Benchmarking (v2.0 — Future)
* **Goal:** Enable macro-level market transparency for freshers entering the workforce.
* **Features in Backlog:**
  * Anonymous crowd-sourced compensation trends for entry-level roles across Indian tech hubs (Bengaluru, Hyderabad, NCR, Pune).
  * Placement season timeline predictor based on campus hiring patterns.
