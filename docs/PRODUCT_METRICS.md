# Product Metrics Framework & KPI Definitions — CareerFlow

**Document Version:** 1.1  
**Target Roles:** Product Analyst, Business Analyst, Associate Product Manager  
**Application:** CareerFlow SaaS  

---

## 1. Metric Hierarchy: North Star & Supporting Pillars

To evaluate whether CareerFlow successfully improves candidate recruitment outcomes and application velocity, we structure metrics into a 3-tier hierarchy:

```
                            [North Star Metric]
                Weekly Active Pipeline Progression (WAPP)
                                    |
      +-----------------------------+-----------------------------+
      |                             |                             |
[Acquisition & Activity]   [Funnel Conversion Health]    [Platform Engagement]
- Weekly Applications Added - Interview Conversion Rate   - JD Intelligence Analyses
- Source Diversity Index    - Rejection Rate              - Deadline Completion Rate
- Active Candidate Count    - Offer Conversion Rate       - CSV Exports Generated
```

---

## 2. Core Business & Recruitment KPIs

### 2.1 Interview Conversion Rate (Funnel Efficiency)
* **Definition:** The proportion of total job applications that successfully advance to at least one interview stage.
* **Mathematical Formula:**
  $$\text{Interview Conversion Rate (\%)} = \left(\frac{\text{Applications with Status } = \text{'Interview'}}{\text{Total Applications Logged}}\right) \times 100$$
* **Business Significance:** Evaluates resume screening effectiveness and targeting precision. For entry-level tech roles in India, typical baseline off-campus conversion is 5–15%; referral-driven campaigns often reach 25–40%.
* **Product Action:** If a user's interview conversion is below 5%, the platform suggests running Job Description Intelligence to realign resume keywords with JD requirements.

---

### 2.2 Rejection Rate (Screening Fallout)
* **Definition:** The percentage of submitted applications that end in rejection.
* **Mathematical Formula:**
  $$\text{Rejection Rate (\%)} = \left(\frac{\text{Applications with Status } = \text{'Rejected'}}{\text{Total Applications Logged}}\right) \times 100$$
* **Business Significance:** Identifies high-friction applicant pools or resume misalignment. Tracking this metric prevents candidate discouragement by making screening outcomes visible and quantifiable.

---

### 2.3 Offer Conversion Rate (Ultimate Pipeline Success)
* **Definition:** The percentage of submitted applications that culminate in a written job or internship offer.
* **Mathematical Formula:**
  $$\text{Offer Conversion Rate (\%)} = \left(\frac{\text{Applications with Status } = \text{'Offer'}}{\text{Total Applications Logged}}\right) \times 100$$
* **Business Significance:** Measures end-to-end recruitment success from initial outreach to hiring manager decision.

---

### 2.4 Application Channel Distribution (Source Attribution)
* **Definition:** Breakdown of applications grouped by acquisition channel:
  $$\text{Channel Share (\%)} = \left(\frac{\text{Count of Applications from Channel } X}{\text{Total Applications}}\right) \times 100$$
* **Channels Tracked:** `LinkedIn`, `Referral`, `Company Career Site`, `Indeed`, `Campus Placement`, `Naukri / Job Portal`, `Cold Email / Outreach`, `Other`.
* **Strategic Value:** Enables candidates to identify which channels provide the highest interview yield, avoiding wasted hours on low-converting job aggregators.

---

### 2.5 Active Pipeline Volume
* **Definition:** Number of applications currently in play (excluding final terminal states `Rejected` and `Withdrawn`).
* **Formula:**
  $$\text{Active Applications} = \text{Total Applications} - (\text{Rejected} + \text{Withdrawn})$$
* **Significance:** Informs candidates whether they have enough concurrent opportunities in flight to maintain hiring momentum.

---

## 3. Product Analytics Implementation Matrix

| Metric Name | Database Source | Calculation Trigger | Visualization Component |
|---|---|---|---|
| Total Applications | `applications.count()` | On page load / soft refresh | Primary Stat Card |
| Active Pipeline | Filter `status NOT IN ('Rejected', 'Withdrawn')` | Client-side reactive memo | Stat Card (Blue) |
| Interview Rate | `status = 'Interview' / total` | Real-time calculation | Stat Card (Purple) |
| Rejection Rate | `status = 'Rejected' / total` | Real-time calculation | Stat Card (Amber) |
| Offers Secured | `status = 'Offer'` | Real-time calculation | Stat Card (Emerald) |
| Stage Distribution | Group by `status` | Computed via `calculateMetrics` | BarChart (Recharts) |
| Timeline Volume | Group by `SUBSTRING(application_date, 1, 7)` | Chronological aggregation | BarChart (Recharts) |
| Channel Share | Group by `source` | Sorted frequency table | Horizontal Progress Bars |
| Deadlines Count | Assessment or interview date $\ge$ today | Filter + date sort | Card with badge pill |
