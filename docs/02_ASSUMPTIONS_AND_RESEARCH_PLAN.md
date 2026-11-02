# 02. Assumptions & User Research Plan

> **Objective:** Systematically test core hypotheses regarding student and recent graduate job application habits before committing to detailed interaction patterns.

---

## 1. Core Assumptions Framework

### A. Problem-Space Assumptions
1. **Application Volume:** Fresh graduates submit between 20 to 100+ applications during their peak hiring season.
2. **Key Pain Point:** The primary stressor is tracking active stages (assessments, interviews, take-homes) rather than simply storing bookmarks of jobs.
3. **Dropout Rate from Tracking:** Candidates often start a spreadsheet or Notion page, but stop updating it within 2–3 weeks because adding/updating fields on mobile or during quick email triage is too high-friction.
4. **Deadline Criticality:** Missing an online assessment (OA) window or technical take-home test is a common failure mode with irreversible career consequences.

### B. Solution-Space Assumptions
1. **Stage Model:** A 7-stage lifecycle (`Saved` → `Applied` → `Assessment` → `Interview` → `Offer` → `Rejected` → `Withdrawn`) accommodates 95%+ of early-career recruitment journeys.
2. **Reminders & Visibility:** Surfacing explicit "Upcoming Deadlines" and "Pending Follow-ups" directly on the dashboard homepage removes the need for complex calendar sync in the MVP.
3. **Data Ownership:** Candidates want complete data isolation, privacy, and an easy CSV export to preserve ownership of their application history.

---

## 2. Research Methodology & Execution Plan

### Target Participants
- **Segment 1:** Final-year undergraduate/master's students actively participating in campus placements or off-campus recruitment (n = 3–5).
- **Segment 2:** Recent graduates (graduated within past 24 months) who recently completed a job search (n = 3–5).

### Research Format
- 20-minute semi-structured qualitative interviews (via video or in-person).
- Observational walkthrough: Asking the participant to show or describe their existing tracker (spreadsheet, notes app, or memory).

### Key Learning Goals
1. What exact tool(s) do they currently use to track applications?
2. Where does their tracking system break down?
3. How do they track time-sensitive events (assessments, interview calls, post-interview follow-ups)?
4. What are the must-have metadata fields they actually care about versus fields they never fill in?
5. How frequently do they update their job data from mobile versus desktop?

---

## 3. Decision Matrix based on Research Findings

| If research reveals... | Product adjustment... |
|---|---|
| Users only care about 4-5 key fields | Strip down application entry modal to minimize friction; move optional details behind an expandable section. |
| Users don't do follow-ups or don't know when to follow up | Provide suggested follow-up intervals (e.g., standard 7-day rule) as a helpful default. |
| Desktop is 90%+ of their usage during application batches | Ensure high-density keyboard-friendly desktop table while maintaining clean mobile read access. |
| Spreadsheets are abandoned specifically because of manual status changes | Make status updates 1-click actions directly from dashboard/list. |
