# 01. Problem Statement

> **Status:** Draft / Pending User Approval (Phase 4)  
> **Target Audience:** Final-year university students & recent graduates (0–2 years experience)

---

## 1. Context & Background
Final-year university students and recent graduates enter a high-volume, fragmented recruitment landscape. A single candidate often submits dozens—sometimes hundreds—of applications across disparate channels (company career pages, LinkedIn, university job boards, referral links). Each company maintains different hiring stages, assessment platforms (HackerRank, HireVue, OA deadlines), and interview timelines.

---

## 2. Core Problem Definition
Currently, fresh graduates struggle with **operational friction, missed deadlines, and anxiety caused by lack of visibility into their job search pipeline**.

Because entry-level hiring requires applying to multiple roles concurrently, candidates face cognitive overload when managing:
1. **Critical Date Slippage:** Missing tight 48–72 hour deadlines for online assessments (OAs) or scheduling calls.
2. **Context Fragmentation:** Forgetting which company/role/salary/job description an invitation or phone screen corresponds to.
3. **Follow-up Blind Spots:** Lacking clear visibility into when to follow up on pending applications or post-interview stages.
4. **Tool Fatigue:** Existing solutions (spreadsheets or complex enterprise project management tools) require excessive manual maintenance, leading to abandoned tracking.

---

## 3. Explicit Distinction: Verified Facts vs. Working Assumptions

| Item | Status | Description |
|---|---|---|
| Candidates apply to many roles simultaneously across multiple platforms | **Working Assumption** | To be validated in user interviews (target: avg applications/week). |
| Online assessment deadlines are frequently missed due to poor reminders | **Working Assumption** | Needs confirmation through student interview data. |
| Existing spreadsheets are abandoned due to setup friction and lack of mobile utility | **Working Assumption** | Common industry hypothesis; requires direct validation. |
| Students prefer a lightweight, purpose-built dashboard over Notion/Excel | **Working Assumption** | Will be tested against competitor feedback. |
| Supabase Auth + RLS provides complete user isolation required for job data privacy | **Verified Technical Fact** | Supabase Row Level Security enforces tenant isolation at the database layer. |

---

## 4. Value Proposition (Draft)
> **For** fresh graduates and final-year students managing active recruitment processes,  
> **CareerFlow** is a streamlined, privacy-first job application tracking dashboard  
> **that** centralises pipeline stages, upcoming assessment/interview deadlines, and follow-up reminders.  
> **Unlike** bloated enterprise project management tools or tedious manual spreadsheets,  
> **CareerFlow** offers an effortless, structured workflow tailored to the specific cadence of entry-level hiring without clutter.

---

## 5. Non-Goals (Out of Scope for MVP)
To maintain velocity, high product quality, and zero bloat, the following are strictly excluded:
- Automated job scraping / autofill extensions.
- AI resume / cover letter generators.
- AI chatbots.
- Social sharing or networking features.
- Inbound email sync / Gmail parsing.
- Monetisation / paid tier gating.
