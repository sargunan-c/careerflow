# 08. Feature Prioritisation: MoSCoW & RICE Framework

> **Evaluation Focus:** Speed to value, UX clarity, zero friction, and strict scope boundary for early-career applicants.

---

## 1. MoSCoW Prioritisation Matrix

| Category | Feature | Rationale | Status in MVP |
|---|---|---|---|
| **Must Have** | Multi-tenant Auth (Sign Up / Sign In / Sign Out) | Required to secure candidate records and isolate application data. | **Delivered** |
| **Must Have** | Job Application CRUD (Company, Title, Status, Dates, Notes, URL, Salary) | Core utility: capturing and updating active applications. | **Delivered** |
| **Must Have** | 7-Stage Pipeline Lifecycle (`Saved` → `Offer`) | Reflects candidate hiring journey; enables quick status changes. | **Delivered** |
| **Must Have** | Assessment & Interview Deadline Tracking | Directly prevents critical evaluation window misses. | **Delivered** |
| **Must Have** | Pipeline Metrics & Stage Distribution Chart | Provides immediate visibility into conversion funnel. | **Delivered** |
| **Must Have** | Real-time Search, Filters, and Sorting | Essential for instant recall during unexpected recruiter phone calls. | **Delivered** |
| **Must Have** | Supabase Row-Level Security (RLS) Isolation | Non-negotiable security requirement preventing cross-user data leaks. | **Delivered** |
| **Must Have** | CSV Export | Guarantees user data ownership and offline backup. | **Delivered** |
| **Must Have** | Responsive Mobile Layout | Enables quick status checks and updates on-the-go. | **Delivered** |
| **Should Have** | One-Click Direct Status Changing in Table Rows | Eliminates modal friction when advancing stages. | **Delivered** |
| **Should Have** | Scheduled Follow-Up Date Alerting | Reminds candidates when to send gentle check-ins. | **Delivered** |
| **Could Have (v2)** | Browser bookmarklet for quick-saving job URLs | Convenient for desktop browsing; deferred to post-MVP. | Backlog |
| **Could Have (v2)** | Application History / Timeline audit log | Detailed audit log of every date a status changed. | Backlog |
| **Won't Have (Excluded)** | Automated Web Scraping / Autofill | Fragile, breaks on ATS updates, privacy risk. | Excluded |
| **Won't Have (Excluded)** | AI Resume / Cover Letter Generator | Bloat that detracts from execution clarity. | Excluded |
| **Won't Have (Excluded)** | AI Chatbot Assistant | Unnecessary overhead for a focused tracker. | Excluded |
| **Won't Have (Excluded)** | Paid subscription / Paywalls | Complete barrier to students with zero income. | Excluded |

---

## 2. RICE Scoring (Reach, Impact, Confidence, Effort)

Formula: $\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$

| Feature | Reach (1–10) | Impact (0.5–3) | Confidence (50–100%) | Effort (Person-days) | RICE Score | Decision |
|---|---|---|---|---|---|---|
| **Fast Application Entry & CRUD** | 10 | 3.0 (Massive) | 100% | 2 | **150** | **P0 (MVP Core)** |
| **Assessment / Interview Deadlines** | 9 | 2.5 (High) | 90% | 1.5 | **135** | **P0 (MVP Core)** |
| **Instant Search & Status Filtering** | 10 | 2.0 (High) | 100% | 1 | **200** | **P0 (MVP Core)** |
| **Funnel Chart & Summary Metrics** | 8 | 2.0 (High) | 90% | 1 | **144** | **P0 (MVP Core)** |
| **Data Export (CSV)** | 7 | 1.5 (Medium) | 100% | 0.5 | **210** | **P0 (MVP Core)** |
| **Follow-up Reminders** | 6 | 1.5 (Medium) | 70% | 1 | **63** | **P1 (MVP Added)** |
| *AI Resume Tailoring* | 6 | 1.0 (Low) | 40% | 10 | **2.4** | **Cut (Out of Scope)** |
| *Automated Scraper* | 8 | 1.5 (Medium) | 30% | 12 | **3.0** | **Cut (Out of Scope)** |

