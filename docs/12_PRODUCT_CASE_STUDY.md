# 12. Product Management Case Study: CareerFlow

> **Project:** CareerFlow  
> **Role:** Lead Product Manager & Full-Stack Engineer  
> **Product Category:** Early-Career Recruitment Productivity / Candidate Execution Cockpit  
> **Target Audience:** Final-year university students & recent graduates (0–2 years experience)  
> **Status:** Working Production MVP Built & Tested

---

## 1. Executive Summary

CareerFlow is a purpose-built job application management platform engineered for final-year students and recent graduates navigating high-volume recruitment cycles. 

Unlike horizontal project tools (Notion, spreadsheets) that suffer from high manual maintenance friction and lack deadline visibility, or commercial job trackers (Teal, Huntr) that gate critical features behind expensive paywalls and promote invasive scraping extensions, CareerFlow provides an **execution-focused, privacy-first pipeline cockpit**.

---

## 2. Problem Space & Explicit Assumption Audit

### The Operational Challenge
In modern early-career recruitment, candidates submit dozens of applications across campus placement drives, company career portals, job boards, and referral links. Each organization maintains disparate recruitment timelines, online assessment platforms (HackerRank, Codility, HireVue), and interview scheduling cadences.

### Strict Separation: Technical Facts vs. Unvalidated Hypotheses
*In alignment with disciplined product management practices, no user feedback or metrics are fabricated.*

| Item | Category | Evidence / Status |
|---|---|---|
| Multi-tenant data isolation can be guaranteed at the database engine layer via Supabase RLS | **Verified Technical Fact** | Tested and verified: users cannot query or mutate records belonging to other tenants. |
| Strict schema validation prevents malformed URLs and invalid status transitions | **Verified Technical Fact** | Automated Vitest test suite passes 12/12 test cases. |
| Early-career applicants submit 30+ applications and abandon spreadsheets within 2–3 weeks | **Working Hypothesis (Unvalidated)** | Identified for empirical testing during user interviews (target: 12–15 candidates). |
| 48–72h assessment deadlines are frequently missed without prominent dashboard alerting | **Working Hypothesis (Unvalidated)** | To be validated in qualitative discovery. |
| Fresh graduates actively execute post-application follow-up check-ins | **Working Hypothesis (Unvalidated)** | To be validated in qualitative discovery. |

---

## 3. Competitive Landscape & Strategic Differentiation

```text
               Specialized / Over-featured
                         ▲
                         │     [Teal] (Heavy, $29/mo paywall, AI-bloat)
                         │
                         │     [Huntr] (Kanban card fatigue at 30+ items)
                         │
  High Friction ─────────┼──────────────────────── Low Friction
  (Hard to maintain)     │                         (Effortless)
                         │      ★ [CareerFlow]
    [Spreadsheets]       │      (High-density, fast table, zero paywalls,
    (No alerts,          │       privacy-first, dedicated deadline awareness)
     manual setup)       │
                         │     [Simplify] (Autofill-centric, extension-locked)
                         ▼
               General / Utility-first
```

### Strategic White Space
1. **Zero Paywalls & No Ads:** Fresh graduates have zero or low income; gating analytics or card limits behind $29/month subscriptions is hostile to the target segment.
2. **First-Class Deadlines:** Online assessments and interviews are elevated into dedicated countdown widgets rather than buried inside card descriptions.
3. **High-Density Table View:** Avoids the horizontal scrolling fatigue of wide Kanban boards when tracking 40+ active applications.
4. **Data Ownership:** One-click CSV export guarantees candidates can take their data anywhere at any time.

---

## 4. Feature Prioritisation (MoSCoW & RICE)

To deliver a working MVP without scope creep, strict scope boundaries were defined:

### Core MVP Deliverables (P0)
- **Multi-Tenant Auth:** Secure sign-up/login/logout with Supabase SSR cookies.
- **Application CRUD:** Track Company, Job Title, Status, Dates, Notes, URL, and Salary.
- **7-Stage Lifecycle:** `Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
- **Search, Filters & Sorting:** Instant client-side search and status filter chips.
- **Dashboard Metrics:** Active pipeline count and Recharts stage distribution visualization.
- **Deadline Radar:** Prominently displays upcoming OAs and interview dates.
- **Data Export:** RFC-4180 compliant CSV export.

### Explicit Scope Exclusions (Non-Goals)
- **No Automated Web Scraping:** Prevents brittle DOM scrapers that break on ATS updates.
- **No AI Resume Generation:** Avoids distracting feature bloat.
- **No Social Feeds / Community Features:** Keeps the interface focused strictly on individual execution.

---

## 5. Technical Architecture & Quality Assurance

- **Frontend & Full-Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS, shadcn/ui.
- **Backend & Database:** Supabase PostgreSQL with custom ENUM constraints and Row Level Security (RLS).
- **Validation Engine:** Zod schemas applied on form inputs.
- **Automated Testing:** 12 automated unit/integration tests running under Vitest covering Zod validation, metric formulas, and CSV escaping.
- **Zero Mocking Policy:** The application integrates directly with Supabase. When credentials are not supplied, it displays a setup banner rather than serving fake data.

---

## 6. Next Steps: User Research & Live Feedback
1. **Recruitment:** Conduct 12–15 semi-structured 15-minute interviews with university seniors and recent graduates using `docs/03_INTERVIEW_QUESTIONNAIRE.md`.
2. **Evidence Logging:** Populate `docs/05_RESEARCH_FINDINGS.md` with raw participant observations and direct quotes.
3. **Iterative Refinement:** Update the product roadmap based on whether hypotheses A1–A8 are validated or invalidated.
