# Test Plan & Quality Assurance Report — CareerFlow

**Document Version:** 1.1  
**Testing Framework:** Vitest 2.1.9, TypeScript 5.7.2  
**Status:** All 20 Automated Tests Passing  

---

## 1. Test Strategy & Objectives

CareerFlow uses an automated, multi-tiered test suite ensuring functional correctness, data validation integrity, mathematical precision of analytics KPIs, and heuristic robustness of local NLP parsing.

### Guiding Principles:
* **Zero Flakiness:** Tests run deterministically in-memory without external network or Supabase cloud dependencies.
* **Zero Hardcoded Fakes:** Calculations are verified against real schema records with rigorous edge case verification (empty states, division-by-zero, special characters).
* **Comprehensive Coverage:** Covers Zod input validation schemas, CSV generator compliance, dashboard metric calculations, and JD parsing algorithms.

---

## 2. Test Execution Summary

```
 RUN  v2.1.9 C:/Users/csarg/.gemini/antigravity/scratch/careerflow

 ✓ __tests__/jd-parser.test.ts (6 tests)
 ✓ __tests__/csv.test.ts (3 tests)
 ✓ __tests__/validation.test.ts (6 tests)
 ✓ __tests__/metrics.test.ts (5 tests)

 Test Files  4 passed (4)
      Tests  20 passed (20)
   Duration  6.44s
```

---

## 3. Test Suites & Scenario Matrix

### Suite 1: Dashboard Metrics & KPI Calculations (`__tests__/metrics.test.ts`)
* **Test Case 1.1:** Calculates total, active, interview, and offer counts accurately across sample applications.
  * *Result:* Passed. Verified active applications correctly exclude `Rejected` and `Withdrawn`.
* **Test Case 1.2:** Calculates conversion rates accurately (Interview Rate %, Rejection Rate %, Offer Rate %).
  * *Result:* Passed. Verified rates format cleanly as single-decimal percentages.
* **Test Case 1.3:** Calculates status distribution accurately with percentages.
  * *Result:* Passed. Verified all 7 application status categories map accurately to percentages summing to 100%.
* **Test Case 1.4:** Calculates activity over time and source distribution.
  * *Result:* Passed. Verified chronological grouping by calendar month (Sep 2026, Oct 2026) and source channel attribution.
* **Test Case 1.5:** Handles zero applications gracefully without division by zero.
  * *Result:* Passed. Verified 0 total returns 0% rates and empty arrays without throwing errors or returning `NaN`.

---

### Suite 2: Job Description Intelligence Parser (`__tests__/jd-parser.test.ts`)
* **Test Case 2.1:** Extracts job title and experience expectations accurately from job postings.
  * *Result:* Passed. Verified extraction of "Associate Product Manager" and "0-1 years" experience.
* **Test Case 2.2:** Identifies responsibilities and requirements sections.
  * *Result:* Passed. Verified bullet points under key headers are cleanly separated.
* **Test Case 2.3:** Extracts required and preferred skills accurately.
  * *Result:* Passed. Verified canonical skills (SQL, PRD, Product Prioritization, Python) map to correct buckets.
* **Test Case 2.4:** Computes candidate skill matches, gaps, and match percentage.
  * *Result:* Passed. Verified intersection of candidate skills with JD skills yields exact match score.
* **Test Case 2.5:** Generates actionable learning priorities for missing skills.
  * *Result:* Passed. Verified missing skills produce ranked advice (High/Medium priority) with practical preparation steps.
* **Test Case 2.6:** Gracefully handles empty and unstructured job descriptions.
  * *Result:* Passed. Verified empty input returns fallback defaults and heuristic disclaimer safely.

---

### Suite 3: Form Input Validation (`__tests__/validation.test.ts`)
* **Test Case 3.1:** Validates required fields (Company name and Job title).
  * *Result:* Passed. Fails gracefully with user-friendly messages when fields are blank.
* **Test Case 3.2:** Enforces YYYY-MM-DD date regex for application date.
  * *Result:* Passed. Rejects invalid strings like "23/11/2026" or "tomorrow".
* **Test Case 3.3:** Validates URL structure for optional Job URL field while allowing empty strings.
  * *Result:* Passed.
* **Test Case 3.4:** Validates authentication input schemas (Email regex and minimum password length $\ge 6$).
  * *Result:* Passed.

---

### Suite 4: CSV Export Utility (`__tests__/csv.test.ts`)
* **Test Case 4.1:** Includes correct 13 CSV column headers including `Source`.
  * *Result:* Passed. Header format: `"Company,Job Title,Status,Application Date,Location,Employment Type,Salary Range,Source,Assessment Date,Interview Date,Follow-up Date,Job URL,Notes"`.
* **Test Case 4.2:** Escapes quotes and handles special characters in fields according to RFC 4180.
  * *Result:* Passed. Escapes internal double quotes as `""` and handles multi-line notes.
* **Test Case 4.3:** Handles null or undefined fields cleanly without throwing.
  * *Result:* Passed. Renders empty strings for null optional fields.

---

## 4. Manual QA & Exploratory Testing Matrix

| Feature Area | Verification Scenario | Expected Outcome | Verified |
|---|---|---|---|
| Supabase Auth Unconfigured State | Load app without `.env.local` Supabase keys | Informational banner displays setup instructions; no unhandled crash | Yes |
| Application Creation | Fill form with all 13 fields and submit | Application saved, modal closes, refresh event fires | Yes |
| Inline Status Change | Change status dropdown in table row | Optimistic update reflected in UI; badge color updates | Yes |
| Search & Filter | Filter by status "Interview" and search "Swiggy" | Correct filtered subset displayed | Yes |
| Mobile Responsiveness | View dashboard on 375px mobile viewport | Mobile menu drawer toggles; table collapses into cards | Yes |
| JD Parser Sample Button | Click "Load Sample APM Posting" | Automatically populates sample APM JD and runs analysis | Yes |
