# Feature Prioritization (RICE Framework) — CareerFlow

**Document Version:** 1.1  
**Methodology:** RICE Prioritization (Reach, Impact, Confidence, Effort)  
**Target Roles:** Associate Product Manager, Product Analyst, Operations Analyst  

---

## 1. Prioritization Framework Overview

To balance user value, technical feasibility, and development velocity without falling into the "feature factory" trap, candidates and product teams use the **RICE Scoring Framework**:

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

### Scoring Criteria:
* **Reach (1–100):** Estimated percentage of active users who will interact with the feature during their weekly job hunt workflow.
* **Impact (0.25–3.0):** Measurable increase in user success or retention:
  * `3.0` = Massive impact (fundamentally changes user workflow or interview outcomes)
  * `2.0` = High impact
  * `1.0` = Medium impact
  * `0.5` = Low impact
  * `0.25` = Minimal impact
* **Confidence (0%–100%):** Degree of certainty in user value and technical feasibility (based on engineering prototypes and user feedback assumptions).
* **Effort (Person-Weeks / Sprints, 1–5):** Development complexity, architectural risk, and testing overhead.

---

## 2. Feature Backlog Evaluation Matrix

| Feature Description | Category | Reach (%) | Impact | Confidence | Effort (Sprints) | RICE Score | Decision / Status |
|---|---|---|---|---|---|---|---|
| **Job Description Intelligence & Skill Gap Extraction** | Intelligence | 90 | 3.0 | 90% | 1.5 | **162.0** | **P0 — Implemented (v1.1)** |
| **Interview & Rejection Conversion Rate KPIs** | Analytics | 95 | 2.0 | 95% | 1.0 | **180.5** | **P0 — Implemented (v1.1)** |
| **Application Source & Activity Timeline Breakdown** | Analytics | 85 | 1.5 | 90% | 1.0 | **114.7** | **P0 — Implemented (v1.1)** |
| **Online Assessment (OA) & Interview Milestone Dates** | Core Workflow | 80 | 2.5 | 95% | 1.0 | **190.0** | **P0 — Implemented (v1.0)** |
| **CSV Data Export Engine** | Data Utility | 60 | 1.0 | 100% | 0.5 | **120.0** | **P0 — Implemented (v1.0)** |
| **Chrome Extension for 1-Click Job Clipping** | Automation | 75 | 2.0 | 70% | 3.0 | **35.0** | **P1 — Backlog (v1.2)** |
| **Google Calendar / iCal Sync for Interviews** | Scheduling | 50 | 1.5 | 80% | 2.0 | **30.0** | **P1 — Backlog (v1.2)** |
| **Automated Email Scraping via Gmail API** | Integration | 40 | 2.0 | 50% | 4.0 | **10.0** | **P2 — Deprioritized (High security risk & API friction)** |
| **Paid AI Resume Writer / Cover Letter Generator** | Content Gen | 30 | 1.0 | 40% | 3.5 | **3.4** | **P3 — Rejected (High token cost, low differentiation)** |

---

## 3. Product Trade-Offs & Strategic Rationale

### Decision A: Local Regex/Taxonomy Parser vs. Paid Cloud LLM (OpenAI / Claude API)
* **Options Considered:**
  1. Call external LLM API (e.g. OpenAI GPT-4o-mini) on every pasted JD.
  2. Implement an in-memory deterministic parser using curated regex patterns and a domain-specific skills taxonomy.
* **Trade-Off Analysis:**
  * While an LLM API handles arbitrary unstructured text with high linguistic flexibility, it introduces recurring API costs, latency (1–3s), dependency on external API keys, rate limits, and failure modes when an API key expires.
  * The local deterministic parser executes in < 50ms, operates 100% offline without credentials, has zero operating cost, and reliably extracts canonical skills and experience levels.
* **Conclusion:** Adopted Option 2 (Local Parser) as the core engine. Documented the trade-off transparently in product docs.

### Decision B: Native CSV Export vs. Complex Cloud Integrations (Notion/Airtable API)
* **Options Considered:**
  1. Build direct OAuth integrations to sync with Notion and Google Sheets.
  2. Implement RFC-compliant client-side CSV download.
* **Trade-Off Analysis:**
  * Third-party sync requires maintaining OAuth tokens, managing API quotas, and handling schema drift across third-party platforms.
  * CSV export gives candidates universal, immediate access to their data that imports natively into Excel, Google Sheets, or Notion in seconds.
* **Conclusion:** Built standard CSV export first (high RICE score). OAuth sync remains in future backlog.
