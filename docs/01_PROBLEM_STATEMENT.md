# 01. Problem Statement & Assumption Audit

> **Document Status:** Working Hypothesis (Unapproved)  
> **Target Segment Under Investigation:** Final-year university students & recent graduates (0–2 years experience)  
> **Rule:** Every claim in this document is treated as an unvalidated hypothesis until corroborated by real interview data in `05_RESEARCH_FINDINGS.md`.

---

## 1. High-Level Hypothesis

Early-career job seekers face an overwhelming volume of simultaneous job applications across disconnected platforms. Without a dedicated, friction-free tracking system, they experience operational stress, context loss during recruiter interactions, and risk missing time-sensitive assessment deadlines.

---

## 2. Granular Assumption Audit

Below is the complete breakdown of every assumption embedded in our current problem framing. Each must be tested against our 12–15 user interviews:

| Category | # | Embedded Assumption | Why It Is Unvalidated | Risk Level if Wrong |
|---|---|---|---|---|
| **Target User** | A1 | Early-career applicants (0–2 yrs) apply in high volumes (30–100+ roles) rather than targeting 3–5 high-fit roles. | They may apply to very few select campus roles, making a tracker redundant. | **High** |
| **Pain Point** | A2 | Missing Online Assessment (OA) / test deadlines (48–72h) is a frequent, painful occurrence. | Applicants might complete OAs immediately upon receipt or use calendar reminders. | **High** |
| **Pain Point** | A3 | Context fragmentation (forgetting job description, company details, salary when contacted) causes real distress. | Most candidates might quickly search their email inbox without issue. | **Medium** |
| **Pain Point** | A4 | Fresh grads actively send follow-up emails and need follow-up reminders. | Most entry-level applications go into automated ATS black holes where follow-ups are futile or ignored. | **High** |
| **Behavior** | A5 | Candidates abandon spreadsheets/Notion because of manual maintenance friction and poor mobile input. | Abandonment might be caused by emotional fatigue/rejection burnout, not spreadsheet UI. | **High** |
| **Behavior** | A6 | Candidates want to track applications on mobile devices on-the-go. | Job applications and resume tailoring might be strictly a desktop-only activity. | **Medium** |
| **Solution Fit** | A7 | A 7-stage pipeline (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`) accurately matches their mental model. | Their actual stages might be binary (Applied vs. Rejected/Ignored) or involve sub-stages (OA1, OA2, Technical, HR). | **Medium** |
| **Solution Fit** | A8 | Candidates will adopt an independent web app instead of staying in their existing tools (Notion, Google Sheets, email). | Switching costs may be high if manual data entry is still required. | **Critical** |

---

## 3. Working Value Proposition (Hypothesis Only)

> **"CareerFlow helps fresh graduates organize their active job hunt into a single, high-clarity dashboard so they never miss an assessment deadline or lose context on an interview, without the bloat, paywalls, or privacy concerns of enterprise trackers."**

*This value proposition will not be locked until validated by user evidence in Phase 4.*

---

## 4. Strict Non-Goals for MVP
Regardless of discovery outcomes, the following remain strictly out of scope:
- Automated web scraping / browser autofill extensions.
- AI resume / cover letter generators.
- AI chatbots / automated writing assistants.
- Social networks / community feeds.
- Complex mailbox API syncing (OAuth Gmail read/write access).
- Paywalls, subscriptions, or credit card processing.
