# User Stories & Acceptance Criteria — CareerFlow

**Document Version:** 1.1  
**Project:** CareerFlow SaaS  
**Standard:** INVEST Principles (Independent, Negotiable, Valuable, Estimable, Small, Testable) with Gherkin Acceptance Criteria.

---

## Epic 1: Pipeline & Application Management

### US-1.1: Record a New Job Application
* **As a** final-year student applying to multiple roles,  
* **I want to** quickly record a new job application with company, title, date, source, and salary,  
* **So that** I don't lose track of where and when I applied.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Successfully creating a job application
  Given I am logged in to CareerFlow
  When I open the "Add Application" modal
  And I enter "Razorpay" as Company, "Associate Product Manager" as Job Title, and "2026-11-23" as Application Date
  And I select "LinkedIn" as the Application Source
  And I click "Save Application"
  Then the application should appear in my applications list
  And the dashboard total counter should increment by 1
```

```gherkin
Scenario: Submitting with missing required fields
  Given I am on the Add Application modal
  When I leave the Company field blank and click "Save Application"
  Then I should see a validation error "Company name is required"
  And the form should not be submitted to the database
```

---

### US-1.2: Update Application Recruitment Stage
* **As an** applicant progressing through hiring rounds,  
* **I want to** update the status of an application (e.g. from Applied to Interview or Offer),  
* **So that** my active pipeline reflects my current interview commitments.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Progressing application from Applied to Interview
  Given an existing application with status "Applied"
  When I select "Interview" from the status dropdown or quick stage selector
  Then the status badge should immediately change to "Interview" with purple styling
  And the database record should be updated
  And the dashboard Interview Rate metric should recalculate
```

---

### US-1.3: Track Assessment and Interview Deadlines
* **As a** busy candidate with multiple deadlines,  
* **I want to** log assessment deadlines and interview times,  
* **So that** I receive prominent alerts on my dashboard and never miss an OA window.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Setting an Online Assessment (OA) deadline
  Given I am editing an application for "Swiggy"
  When I enter "2026-11-28T18:00" in the Assessment Deadline field and save
  Then on the Overview Dashboard, Swiggy should appear under "Upcoming Deadlines" with formatted date and time
  And the deadline counter should reflect 1 active deadline
```

---

## Epic 2: Product Analytics & Funnel Intelligence

### US-2.1: View Conversion Rates & Funnel Metrics
* **As a** data-driven job seeker,  
* **I want to** see my interview conversion rate, rejection rate, and status breakdown,  
* **So that** I can objectively evaluate my resume screening success and improve my strategy.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Viewing real-time funnel calculations
  Given I have logged 10 applications: 2 Interviews, 1 Offer, 3 Rejected, 4 Applied
  When I navigate to the Overview Dashboard
  Then Total Applications should display "10"
  And Interview Rate should display "20%" (2/10)
  And Rejection Rate should display "30%" (3/10)
  And Offers Secured should display "1" (10% total conversion)
  And the Application Stage Pipeline bar chart should show bars for each active stage
```

```gherkin
Scenario: Handling empty database state
  Given I have zero applications in my account
  When I load the Overview Dashboard
  Then all stat cards should display "0" or "0%"
  And the charts should display clean zero-state guidance without NaN or division-by-zero crashes
```

---

### US-2.2: Application Source & Timeline Analytics
* **As a** job hunter testing multiple channels,  
* **I want to** see which application sources (LinkedIn, Referrals, Campus) I use most and my volume over time,  
* **So that** I can focus my energy on the channels yielding the best results.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Viewing channel distribution
  Given applications logged with sources "LinkedIn" and "Referral"
  When I inspect the Application Channels card
  Then I should see percentage bars representing the volume from each channel
  And the timeline chart should group applications by calendar month
```

---

## Epic 3: Job Description Intelligence

### US-3.1: Analyze Job Description & Extract Requirements
* **As an** APM or analyst candidate preparing for an opportunity,  
* **I want to** paste a complete job description and receive an automated breakdown,  
* **So that** I quickly understand the role's responsibilities, required skills, and experience expectations.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Parsing an Associate Product Manager JD
  Given I am on the "/job-intelligence" page
  When I paste a job posting containing "Role: Associate Product Manager", responsibilities, and "Requirements: SQL, PRD, RICE"
  And I click "Analyze Job Description"
  Then the detected role should display "Associate Product Manager"
  And the responsibilities and requirements should be extracted as clean bullet items
  And "SQL", "PRD & User Stories", and "Product Prioritization" should appear as Required Skills
```

---

### US-3.2: Skill-Match Comparison & Learning Priorities
* **As a** candidate wanting to address resume gaps,  
* **I want to** compare my current skills against the extracted JD skills,  
* **So that** I receive a match percentage and ranked learning recommendations for missing areas.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Identifying skill gaps and learning advice
  Given the JD requires "SQL", "PRD & User Stories", and "Figma & Wireframing"
  And my entered skills are "SQL, PRD & User Stories"
  When I view the analysis report
  Then Matched Skills should list "SQL" and "PRD & User Stories"
  And Skill Gaps should list "Figma & Wireframing"
  And the Match Score should display "67%" (2/3)
  And the Learning Priorities section should suggest actionable Figma practice exercises
  And a clear heuristic disclaimer must be visible stating this is not an automated hiring guarantee
```

---

## Epic 4: Data Portability & Governance

### US-4.1: Export Applications to CSV
* **As a** candidate managing my personal records,  
* **I want to** export all my applications into a CSV spreadsheet,  
* **So that** I have an offline backup with all dates, notes, and sources preserved.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Exporting filtered application data
  Given I have applications logged in the system
  When I click "Export CSV" on the Applications page
  Then a file named "careerflow_applications.csv" should download
  And the first row should contain 13 columns including "Source"
  And multi-line notes and commas within text should be escaped properly in quotes
```
