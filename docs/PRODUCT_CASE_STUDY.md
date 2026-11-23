# Product Case Study — CareerFlow

**Project Title:** CareerFlow: Job Search Management & Product Intelligence SaaS Platform  
**Author:** Sargunan C (2026 B.Tech Electronics & Communication Engineering)  
**Target Roles:** Associate Product Manager, Product Analyst, Operations Analyst  

---

## Executive Summary

Job hunting for final-year college students and early-career applicants in India is characterized by high application volume (50–150+ applications) spread across LinkedIn, Naukri, campus drives, and company portals. However, candidates suffer from missed Online Assessment (OA) deadlines, zero visibility into their recruitment conversion funnel, and blind submissions without knowing whether their skills align with target job requirements.

**CareerFlow** was conceptualized, designed, built, and tested as a full-stack, data-driven SaaS platform. It combines:
1. **Multi-Tenant Relational Pipeline:** Built with Next.js 15, TypeScript, and Supabase PostgreSQL with strict Row-Level Security (RLS).
2. **Real-Time Funnel Analytics:** Automated computation of Interview Conversion Rate, Rejection Rate, and Offer Conversion Rate from actual database records.
3. **Job Description Intelligence Engine:** Deterministic, local NLP parser extracting job titles, experience requirements, required/preferred skills, and candidate skill gaps with actionable interview preparation priorities — operating with zero paid API costs.

---

## 1. Problem Discovery & Hypothesis

### Problem Statement:
"College students and junior applicants lack an integrated system to track application deadlines, measure recruitment conversion efficiency, and systematically identify skill gaps against job descriptions."

### Key Hypotheses:
1. **Hypothesis 1 (Milestone Anxiety):** Candidates miss critical 48-hour online assessment windows because standard spreadsheets do not provide time-anchored alerts.
2. **Hypothesis 2 (Funnel Blindness):** Applicants do not know their interview conversion rates, making it impossible to diagnose whether failures stem from resume screening (low interview rate) or interview rounds (low offer rate).
3. **Hypothesis 3 (Skill Mismatch):** Candidates apply to roles without understanding the exact technical competencies demanded, leading to high rejection rates.

---

## 2. Product Design & Architectural Decisions

### 2.1 Multi-Tenant Data Isolation with Supabase RLS
To ensure candidate privacy and multi-user scaling without maintaining custom auth middleware:
```sql
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
    ON public.applications FOR SELECT
    USING (auth.uid() = user_id);
```
Every tenant's job hunt data remains isolated at the database engine level.

### 2.2 Mathematical Definition of Product KPIs
Rather than presenting static fake numbers, all dashboard cards compute metrics reactively from real data:
* **Interview Conversion Rate:** $\frac{\text{Interviews}}{\text{Total Applications}} \times 100$
* **Rejection Rate:** $\frac{\text{Rejected}}{\text{Total Applications}} \times 100$
* **Offer Conversion Rate:** $\frac{\text{Offers}}{\text{Total Applications}} \times 100$
* **Zero-State Protection:** If `Total Applications = 0`, metrics cleanly return 0.0% without `NaN` or runtime crashes.

### 2.3 Deterministic Local JD Parsing vs. Paid LLM APIs
* **The Dilemma:** Using OpenAI/Claude APIs would make the portfolio project fragile (dependent on private API keys and susceptible to credit exhaustion).
* **The Solution:** Authored a robust local parsing engine (`src/lib/jd-parser.ts`) using regex section extractors and a curated 20+ skill taxonomy covering Product Management, Analytics, Operations, and Full-Stack Engineering.
* **Execution:** Evaluates candidate skills against JD requirements in < 50ms with 100% reliability and zero operating cost.

---

## 3. Product Features & User Experience

### Feature 1: Recruitment Pipeline Table & Quick Stage Progression
* Tracks 7 status stages: `Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
* Inline status selector enables candidates to update their hiring stage in 1 click without opening a full edit modal.
* Responsive card grid for mobile devices and dense data table for desktop viewports.

### Feature 2: Milestone Deadlines & Follow-Up Reminders
* Dedicated datetime fields for Online Assessments (OA) and interview rounds.
* Top-level alerts for upcoming deadlines sorted chronologically to prevent missed evaluation windows.

### Feature 3: Job Description Intelligence & Skill-Match Benchmarking
* Input: Pasted JD text + Candidate's profile skills.
* Output:
  * Extracted job title and experience expectations.
  * Extracted responsibility and requirement bullet lists.
  * Side-by-side skill matching (Matched skills with green badges, Missing skills with warning badges).
  * Overall Skill Match Score (%).
  * Actionable Learning Priorities: ranked advice guiding what specific project or technical concept to study before the interview.

---

## 4. Quality Verification & Testing Metrics

The implementation was validated using Vitest and comprehensive automated test suites:
* **Total Automated Tests:** 20 tests across 4 test suites.
* **Passing Tests:** 20/20 (100% pass rate).
* **Suites Verified:**
  1. `metrics.test.ts` (Conversion rates, volume timeline, channel distribution, empty state edge cases).
  2. `jd-parser.test.ts` (Title extraction, section splitting, skill categorization, gap ranking, empty input handling).
  3. `validation.test.ts` (Zod validation schemas, date format regex, authentication bounds).
  4. `csv.test.ts` (RFC 4180 compliance, header integrity, quote escaping).

---

## 5. Key Learnings & Product Takeaways

1. **Product Thinking over Feature Bloat:** Building a reliable, locally parsing JD analyzer delivered higher credibility than wrapping an unreliable third-party API.
2. **Defensive Edge-Case Engineering:** Empty states are as important as populated states in SaaS applications; handling 0 applications without crashing establishes immediate trust.
3. **Data Integrity & Traceability:** Deriving every metric directly from relational database rows ensures transparent, auditable business reporting.
