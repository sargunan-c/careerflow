# CareerFlow — Graduate Job Search & Product Intelligence Platform

> A data-driven, privacy-first job search management and career intelligence SaaS platform built for final-year students and early-career job seekers (0–1 years experience) targeting roles in Product Management, Analytics, Operations, and Software Engineering.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20RLS-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Vitest-20%2F20%20Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Summary & Problem Solved

College students and entry-level applicants apply to 50–150+ opportunities across fragmented platforms (LinkedIn, Naukri, Internshala, campus placement cells, and company portals). This unstructured volume leads to three major failures:
1. **Missed Evaluation Windows:** 48–72 hour Online Assessment (OA) links and scheduled recruiter calls get buried in inbox clutter.
2. **Funnel Blindness:** Candidates cannot pinpoint why they are not landing jobs because they do not track where drop-offs happen (e.g. low interview conversion vs. interview-to-offer fallout).
3. **Skill Mismatch:** Resumes are submitted without knowing how the candidate's skills map to specific job requirements or what technical topics to study before an interview.

**CareerFlow** addresses these challenges through a unified cockpit providing multi-tenant application tracking, automated conversion funnel analytics, date-anchored milestone countdowns, and a local, deterministic Job Description Intelligence engine that extracts skills and benchmarks candidate alignment without recurring paid AI API costs.

---

## 🚀 Key Features

### 1. Job Description Intelligence Engine (`/job-intelligence`)
* **Local Deterministic Parsing:** Instant analysis of pasted job postings using pattern extraction and a domain taxonomy of 20+ product and tech competencies (zero external API fee, 100% offline uptime).
* **Automated Extraction:** Extracts job title, experience level (0-1 years / fresher), key responsibilities, and qualifications.
* **Skill Match & Gap Analysis:** Compares candidate skills side-by-side with required and preferred JD skills, yielding a percentage alignment score.
* **Ranked Learning Priorities:** Surfaces missing skills categorized by urgency (High/Medium) with actionable study and portfolio project advice.
* **Heuristic Safety:** Prominently labels output as preparation analysis, not a predictive hiring guarantee.

### 2. Product Analytics & Funnel Dashboard (`/`)
* **Core Conversion KPIs:** Real-time mathematical calculation of:
  $$\text{Interview Conversion Rate} = \left(\frac{\text{Interviews}}{\text{Total Applications}}\right) \times 100$$
  $$\text{Rejection Rate} = \left(\frac{\text{Rejected}}{\text{Total Applications}}\right) \times 100$$
  $$\text{Offer Conversion Rate} = \left(\frac{\text{Offers}}{\text{Total Applications}}\right) \times 100$$
* **Application Stage Funnel:** Visualizes pipeline distribution across all 7 stages using Recharts.
* **Timeline Volume:** Chronologically groups applications by calendar month to visualize job search momentum.
* **Channel Distribution:** Tracks application yield across LinkedIn, Referrals, Company Portals, and Campus Placement.
* **Zero-State Resilience:** Graceful empty states with onboarding guidance; zero hardcoded fake metrics.

### 3. Recruitment Pipeline Management (`/applications`)
* **7-Stage Lifecycle:** `Saved` $\rightarrow$ `Applied` $\rightarrow$ `Assessment` $\rightarrow$ `Interview` $\rightarrow$ `Offer` $\rightarrow$ `Rejected` $\rightarrow$ `Withdrawn`.
* **1-Click Stage Updates:** Inline status changer in table rows for rapid workflow updates.
* **Search & Filters:** Real-time multi-attribute search (company, title, source, notes), status filter chips, and multi-column sorting.
* **Milestone Alerts:** Prominently highlights upcoming Online Assessment (OA) deadlines and interview times.
* **Data Portability:** 1-click RFC 4180-compliant CSV export containing all 13 fields including recruitment source and notes.

### 4. Per-Tenant Security & Isolation
* Built on Supabase PostgreSQL with strict Row-Level Security (RLS):
  ```sql
  CREATE POLICY "Users can view own applications"
      ON public.applications FOR SELECT
      USING (auth.uid() = user_id);
  ```

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router, React 19) | Server/client component isolation, fast routing, modern rendering |
| **Language** | TypeScript 5.7 (Strict Mode) | Full type-safety across forms, API clients, and analytical utilities |
| **Styling & UI** | Tailwind CSS 3.4, Lucide React | Accessible, lightweight, clean design system without heavyweight component libraries |
| **Database & Auth** | Supabase (PostgreSQL 15, GoTrue, RLS) | Multi-tenant isolation at engine level, robust relational indexing |
| **Validation** | Zod 3.24, React Hook Form 7.54 | Strict client-side and server-side schema validation |
| **Charts** | Recharts 2.15 | Responsive SVG bar charts for funnel and volume analytics |
| **Testing** | Vitest 2.1.8 | In-memory unit and integration testing execution in < 7 seconds |

---

## 📂 Repository Structure

```text
careerflow/
├── docs/
│   ├── PRODUCT_REQUIREMENTS.md    # Product Requirements Document (PRD) with functional & non-functional specs
│   ├── USER_STORIES.md            # Gherkin-syntax user stories with acceptance criteria
│   ├── PRODUCT_ROADMAP.md         # Multi-quarter product roadmap and strategic milestones
│   ├── PRIORITIZATION.md          # RICE scoring framework and architectural trade-off evaluations
│   ├── PRODUCT_METRICS.md         # KPI definitions, mathematical formulas, and North Star framework
│   ├── TEST_PLAN.md               # Quality assurance plan, scenario matrix, and manual QA report
│   ├── COMPETITOR_ANALYSIS.md     # Feature benchmarking vs. Huntr, Teal, and Google Sheets
│   └── PRODUCT_CASE_STUDY.md      # Comprehensive product case study for portfolio evaluation
├── src/
│   ├── app/
│   │   ├── (auth)/                # Login and register pages
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx           # Product analytics overview dashboard
│   │   │   ├── layout.tsx         # Dashboard layout shell with global Add modal
│   │   │   ├── applications/      # Applications pipeline table, search, filters & details view
│   │   │   └── job-intelligence/  # Job Description Intelligence & skill matching interface
│   │   ├── globals.css            # Tailwind theme tokens
│   │   └── layout.tsx             # Root HTML layout
│   ├── components/
│   │   ├── applications/          # Table, Card, Form, and Delete dialogs
│   │   ├── dashboard/             # StatCard, StatusChart, ActivityChart, SourceChart, DeadlineCard
│   │   ├── layout/                # Sidebar and Header components
│   │   └── ui/                    # Reusable button, input, badge, modal
│   ├── lib/
│   │   ├── jd-parser.ts           # Local deterministic JD parsing & skill gap analysis engine
│   │   ├── supabase/              # Client, server, and status utilities
│   │   ├── validations/           # Zod schemas for applications and auth
│   │   └── utils.ts               # Analytics calculation engine, date formatters, CSV export
│   └── types/                     # TypeScript interfaces and application enums
├── supabase/
│   └── schema.sql                 # Production PostgreSQL schema, indices & RLS policies
├── __tests__/                     # Vitest automated test suites (20/20 passing)
├── package.json
└── tsconfig.json
```

---

## ⚡ Setup & Local Run Instructions

### 1. Prerequisites
* Node.js 18+ or 20+
* pnpm or npm

### 2. Installation
```bash
git clone https://github.com/sargunan-c/careerflow.git
cd careerflow
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If Supabase keys are omitted, the application runs in disconnected mode with an informational configuration banner without crashing).*

### 4. Database Setup (Supabase)
1. In your Supabase project, navigate to the **SQL Editor**.
2. Run the SQL script located at [`supabase/schema.sql`](file:///C:/Users/csarg/.gemini/antigravity/scratch/careerflow/supabase/schema.sql).
3. This creates the `applications` table, enums, triggers, and Row-Level Security policies.

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Results

Run the automated test suite:
```bash
npm test
```

### Verified Test Summary:
* `__tests__/jd-parser.test.ts`: 6/6 tests passing (Title extraction, section splitting, skill categorization, candidate matching, gap ranking, empty input handling)
* `__tests__/metrics.test.ts`: 5/5 tests passing (Interview conversion rate, rejection rate, offer rate, monthly activity timeline, channel breakdown, zero-state safety)
* `__tests__/validation.test.ts`: 6/6 tests passing (Company/title validation, date regex, URL formatting, auth bounds)
* `__tests__/csv.test.ts`: 3/3 tests passing (13 headers, quote/comma escaping, null safety)
* **Total:** **20 passed (100% pass rate)**.

---

## ⚠️ Known Limitations & Boundaries

1. **Local Parsing Scope:** The JD parser uses deterministic regex pattern extraction and a curated taxonomy of 20+ competencies. While fast, predictable, and zero-cost, it does not interpret highly unconventional job posting layouts or novel niche tech abbreviations outside its dictionary.
2. **No Web Scraping:** To prevent bot blocks, anti-scraping CAPTCHAs, and terms-of-service violations with job boards, users paste job descriptions directly into the tool.
3. **No Automated Email Scraping:** Applications and milestone dates are entered by the user rather than reading personal inbox credentials, protecting user privacy.
