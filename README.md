# CareerFlow — Graduate Job Application & Pipeline Tracker

> A clean, focused, privacy-first job application management platform engineered for final-year university students and recent graduates (0–2 years experience).

---

## 📌 Product Overview
CareerFlow solves the operational chaos of entry-level job hunting. Rather than relying on clumsy spreadsheets or bloated enterprise career platforms with aggressive paywalls and invasive extensions, CareerFlow provides an execution cockpit designed specifically for high-volume graduate recruitment:
- **Zero Distractions:** No AI resume generators, no social feeds, and no paywalls.
- **First-Class Deadlines:** Proactively elevates 48–72h Online Assessment (OA) windows and interview dates.
- **Per-User Security:** Built on Supabase PostgreSQL with strict Row Level Security (RLS) ensuring 100% data isolation.
- **Data Portability:** 1-click RFC-4180 compliant CSV export so candidates always own their data.

---

## 🚀 Key Features

1. **Executive Dashboard:**
   - Summary metric cards: Total Applications, Active Pipeline, Active Interviews, and Offers Received.
   - Interactive Application Stage Funnel chart (Recharts) visualizing pipeline distribution.
   - "Upcoming Deadlines & Interviews" and "Scheduled Follow-Ups" countdown cards.
2. **Applications Pipeline:**
   - High-density desktop table and responsive touch-friendly mobile cards.
   - 7 recruitment lifecycle stages: `Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
   - 1-click inline status switching directly from table rows.
3. **Search, Filtering & Sorting:**
   - Real-time client-side search across Company, Role, Location, and Notes.
   - Status filter chips with live record counts.
   - Multi-column sorting (Application Date, Company Name, Status, Assessment Date, Interview Date).
4. **Application Details View (`/applications/[id]`):**
   - In-depth modal and page view with full compensation, location, job URL, and rich notes.
   - Direct status modification buttons and deletion with confirmation safeguards.
5. **Multi-Tenant Authentication:**
   - Email/password sign-up, sign-in, and sign-out via Supabase Auth and `@supabase/ssr` cookies.
6. **Graceful Degradation:**
   - Clear, honest setup banner when backend credentials are not yet configured; no synthetic fake data pretending to be live records.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** Strict TypeScript 5
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) design system
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + GoTrue + Row-Level Security)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Visualizations:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest](https://vitest.dev/) (12/12 automated unit & integration tests passing)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📂 Repository Structure

```text
careerflow/
├── docs/
│   ├── 01_PROBLEM_STATEMENT.md          # Problem framing & explicit assumption audit
│   ├── 02_ASSUMPTIONS_AND_RESEARCH_PLAN.md # Practical beginner research playbook
│   ├── 03_INTERVIEW_QUESTIONNAIRE.md    # 15-minute qualitative interview script
│   ├── 03b_INTERVIEW_NOTES_TEMPLATE.md  # Standardized participant notes template
│   ├── 04_COMPETITOR_ANALYSIS.md        # Teal vs. Huntr vs. Simplify vs. Sheets
│   ├── 05_RESEARCH_FINDINGS.md          # Unpopulated evidence log (no fake data)
│   ├── 06_PRD.md                        # Complete Product Requirements Document
│   ├── 07_USER_STORIES_AND_AC.md        # Gherkin-syntax User Stories & Acceptance Criteria
│   ├── 08_FEATURE_PRIORITISATION.md     # MoSCoW & RICE scoring framework
│   ├── 09_TECHNICAL_ARCHITECTURE.md     # Full-stack architectural specification & mermaid diagram
│   ├── 11_TESTING_REPORT.md             # Automated test report & QA checklist
│   └── 12_PRODUCT_CASE_STUDY.md         # Comprehensive product case study for portfolio
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx           # Sign-in page
│   │   │   └── register/page.tsx        # Sign-up page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx               # Dashboard layout with global Add modal
│   │   │   ├── page.tsx                 # Overview dashboard with metrics & charts
│   │   │   └── applications/
│   │   │       ├── page.tsx             # Applications pipeline with search & filters
│   │   │       └── [id]/page.tsx        # Individual application details view
│   │   ├── globals.css                  # Modern SaaS design tokens & base styles
│   │   └── layout.tsx                   # Root HTML shell
│   ├── components/
│   │   ├── applications/                # Table, Card, Form, and Delete dialogs
│   │   ├── dashboard/                   # StatCard, StatusChart, DeadlineCard
│   │   ├── layout/                      # Sidebar and Header components
│   │   └── ui/                          # Accessible button, badge, input, modal, status-badge
│   ├── lib/
│   │   ├── supabase/                    # Browser, server, and middleware clients
│   │   ├── validations/                 # Zod validation schemas
│   │   └── utils.ts                     # Metrics engine, CSV exporter, date formatters
│   └── types/                           # TypeScript models & application statuses
├── supabase/
│   └── schema.sql                       # Production PostgreSQL schema, indices & RLS policies
├── __tests__/                           # Automated Vitest test suites
├── .env.example                         # Environment variable template
├── package.json
└── tsconfig.json
```

---

## ⚡ Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd careerflow
pnpm install
```

### 2. Configure Supabase Backend
1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Copy the entire contents of [`supabase/schema.sql`](file:///C:/Users/csarg/.gemini/antigravity/scratch/careerflow/supabase/schema.sql) into the editor and click **Run**.
   - This creates table `public.applications`, sets up the `application_status` enum, enables RLS, creates user isolation policies, and configures partial deadline indices.

### 3. Set Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

CareerFlow includes comprehensive automated tests covering Zod schemas, metric aggregation, and CSV generation:

```bash
pnpm test
```

Test Results:
- `__tests__/validation.test.ts`: 6/6 tests passing
- `__tests__/metrics.test.ts`: 3/3 tests passing
- `__tests__/csv.test.ts`: 3/3 tests passing
- **Total:** 12 passed in < 2 seconds.

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub (see instructions below).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `careerflow` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL, e.g. `https://careerflow.vercel.app`)
5. Click **Deploy**. Vercel will build and deploy the production bundle in under 1 minute.

---

## 🔗 How to Connect GitHub & Push

If you haven't linked a GitHub remote yet, run the following commands:

```bash
# 1. Create an empty repository named 'careerflow' on github.com
# 2. Add the remote (replace USERNAME with your GitHub handle):
git remote add origin https://github.com/USERNAME/careerflow.git

# 3. Rename branch to main (if desired) and push:
git branch -M main
git push -u origin main
```
