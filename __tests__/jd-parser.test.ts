import { describe, it, expect } from "vitest";
import { parseJobDescription } from "../src/lib/jd-parser";

describe("Job Description Intelligence Parser", () => {
  const sampleApmJd = `
    Job Title: Associate Product Manager
    Company: QuickDeliver Logistics
    Location: Bengaluru, India (Hybrid)

    About Us:
    Join our dynamic team optimizing hyper-local logistics workflows across India.

    Key Responsibilities:
    - Define product requirements (PRDs) and user stories with clear acceptance criteria.
    - Prioritize product backlog using the RICE framework in JIRA.
    - Analyze funnel conversion metrics and delivery SLAs using SQL and Excel.
    - Partner with design to create wireframes in Figma.
    - Execute A/B tests to optimize checkout conversion rates.

    Qualifications & Requirements:
    - 0-1 years of experience in product, engineering, or operations analytics.
    - Strong analytical mindset with hands-on SQL experience.
    - Excellent communication and stakeholder management abilities.
    - Solid understanding of Agile/Scrum delivery.

    Preferred Qualifications:
    - Exposure to Python, Streamlit, or Tableau data dashboards.
    - Familiarity with logistics, supply chain, or e-commerce operations.
  `;

  it("extracts job title and experience expectations accurately", () => {
    const candidateSkills = ["SQL", "Product Management", "PRD & User Stories", "Figma & Wireframing"];
    const result = parseJobDescription(sampleApmJd, candidateSkills);

    expect(result.jobTitle.toLowerCase()).toContain("associate product manager");
    expect(result.experienceLevel.toLowerCase()).toContain("0-1");
  });

  it("identifies responsibilities and requirements sections", () => {
    const result = parseJobDescription(sampleApmJd, ["SQL"]);

    expect(result.keyResponsibilities.length).toBeGreaterThan(0);
    expect(result.keyRequirements.length).toBeGreaterThan(0);
  });

  it("extracts required and preferred skills accurately", () => {
    const result = parseJobDescription(sampleApmJd, ["SQL"]);

    expect(result.requiredSkills).toContain("SQL");
    expect(result.requiredSkills).toContain("PRD & User Stories");
    expect(result.requiredSkills).toContain("Product Prioritization");
    expect(result.preferredSkills).toContain("Python");
  });

  it("computes candidate skill matches, gaps, and match percentage", () => {
    const candidateSkills = ["SQL", "Product Prioritization", "Agile / Scrum"];
    const result = parseJobDescription(sampleApmJd, candidateSkills);

    expect(result.matchedSkills).toContain("SQL");
    expect(result.matchedSkills).toContain("Product Prioritization");
    expect(result.missingSkills.length).toBeGreaterThan(0);
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });

  it("generates actionable learning priorities for missing skills", () => {
    const candidateSkills = ["SQL"];
    const result = parseJobDescription(sampleApmJd, candidateSkills);

    expect(result.learningPriorities.length).toBeGreaterThan(0);
    const firstPriority = result.learningPriorities[0];
    expect(firstPriority).toHaveProperty("skill");
    expect(firstPriority).toHaveProperty("priority");
    expect(firstPriority).toHaveProperty("actionableAdvice");
    expect(["High", "Medium", "Low"]).toContain(firstPriority.priority);
  });

  it("gracefully handles empty and unstructured job descriptions", () => {
    const result = parseJobDescription("", []);

    expect(result.jobTitle).toBe("Opportunity / Unspecified Role");
    expect(result.experienceLevel).toContain("Fresher");
    expect(result.matchScore).toBe(0);
    expect(result.disclaimer).toBeTruthy();
  });
});
