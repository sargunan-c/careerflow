import { JDAnalysisResult, LearningPriority } from "@/types";

// Standard skills taxonomy across PM, Analytics, Operations and Tech roles
interface SkillDefinition {
  canonical: string;
  category: "product" | "analytics" | "technical" | "operations";
  aliases: string[];
  learningAdvice: string;
}

const SKILL_DATABASE: SkillDefinition[] = [
  // Product Management
  {
    canonical: "Product Management",
    category: "product",
    aliases: ["product management", "product sense", "product lifecycle", "product strategy", "product discovery"],
    learningAdvice: "Review product design frameworks (CIRCLES, Jobs-to-be-Done) and write a mock PRD for an everyday app.",
  },
  {
    canonical: "PRD & User Stories",
    category: "product",
    aliases: ["prd", "product requirements", "user stories", "acceptance criteria", "user story", "functional requirements"],
    learningAdvice: "Practice breaking down a feature into INVEST-compliant user stories with Gherkin acceptance criteria.",
  },
  {
    canonical: "Product Prioritization",
    category: "product",
    aliases: ["rice", "prioritization", "moscow", "kano", "ice scoring", "feature prioritization"],
    learningAdvice: "Apply RICE scoring (Reach, Impact, Confidence, Effort) to backlog items and justify trade-offs.",
  },
  {
    canonical: "Roadmapping",
    category: "product",
    aliases: ["roadmap", "product roadmap", "milestone planning", "release planning", "sprint planning"],
    learningAdvice: "Draft an outcome-oriented quarterly roadmap connecting strategic goals to feature milestones.",
  },
  {
    canonical: "Figma & Wireframing",
    category: "product",
    aliases: ["figma", "wireframe", "wireframing", "mockups", "prototyping", "ux design", "ui/ux", "balsamiq"],
    learningAdvice: "Create low-fidelity wireframes and user flows in Figma demonstrating clear candidate/user journeys.",
  },
  {
    canonical: "Agile / Scrum",
    category: "product",
    aliases: ["agile", "scrum", "sprint", "kanban", "jira", "confluence", "standups"],
    learningAdvice: "Study core Agile ceremonies (grooming, retrospectives) and master JIRA issue tracking workflows.",
  },
  {
    canonical: "Competitor Analysis",
    category: "product",
    aliases: ["competitor analysis", "market research", "competitive landscape", "market analysis", "benchmarking"],
    learningAdvice: "Perform feature-by-feature matrix and SWOT benchmarking of 3 leading products in the same niche.",
  },

  // Analytics & Data
  {
    canonical: "SQL",
    category: "analytics",
    aliases: ["sql", "postgresql", "postgres", "mysql", "duckdb", "sqlite", "bigquery"],
    learningAdvice: "Practice SQL aggregate functions, window functions (RANK, LAG/LEAD), and CTEs on business KPI schemas.",
  },
  {
    canonical: "Product Analytics & KPIs",
    category: "analytics",
    aliases: ["kpi", "kpis", "product analytics", "metrics", "retention", "conversion rate", "churn", "funnel analysis", "amplitude", "mixpanel", "google analytics"],
    learningAdvice: "Define North Star metric and operational L1/L2 metrics for an e-commerce or SaaS funnel.",
  },
  {
    canonical: "A/B Testing & Experimentation",
    category: "analytics",
    aliases: ["a/b test", "a/b testing", "experimentation", "hypothesis testing", "split testing", "p-value", "statistical significance"],
    learningAdvice: "Formulate testable hypotheses (Null vs Alternative) and calculate sample size and statistical confidence.",
  },
  {
    canonical: "Python",
    category: "analytics",
    aliases: ["python", "pandas", "numpy", "matplotlib", "seaborn", "jupyter"],
    learningAdvice: "Write Python scripts with Pandas to clean messy CSV files and compute group-level summary metrics.",
  },
  {
    canonical: "Data Visualization & Dashboards",
    category: "analytics",
    aliases: ["dashboard", "dashboards", "data visualization", "tableau", "power bi", "looker", "streamlit", "recharts"],
    learningAdvice: "Build concise charts highlighting business insights rather than overwhelming raw data tables.",
  },

  // Operations & Problem Solving
  {
    canonical: "Operations & SLA Tracking",
    category: "operations",
    aliases: ["operations", "operational excellence", "sla", "slas", "service level agreement", "turnaround time", "tat", "logistics"],
    learningAdvice: "Model operational bottlenecks, breach rates, and identify vendor/courier performance variance.",
  },
  {
    canonical: "Root Cause Analysis",
    category: "operations",
    aliases: ["root cause", "rca", "5 whys", "fishbone", "ishikawa", "incident management", "problem solving"],
    learningAdvice: "Practice 5-Whys and Ishikawa diagrams on operational failure scenarios (e.g. logistics delivery delays).",
  },
  {
    canonical: "Stakeholder Management",
    category: "operations",
    aliases: ["stakeholder management", "cross-functional", "client management", "presentation", "communication"],
    learningAdvice: "Structure communications using Minto Pyramid (Executive Summary -> Supporting Arguments -> Next Steps).",
  },

  // Technical & Engineering
  {
    canonical: "Next.js & React",
    category: "technical",
    aliases: ["next.js", "nextjs", "react", "react.js", "reactjs", "frontend"],
    learningAdvice: "Build component-driven user interfaces using Next.js App Router, React hooks, and TypeScript.",
  },
  {
    canonical: "TypeScript",
    category: "technical",
    aliases: ["typescript", "ts", "javascript", "js", "es6"],
    learningAdvice: "Enforce strict interfaces, union types, and zod validation schemas to eliminate runtime bugs.",
  },
  {
    canonical: "REST APIs & Backend",
    category: "technical",
    aliases: ["rest api", "rest apis", "restful", "api integration", "backend", "endpoints", "json"],
    learningAdvice: "Study HTTP status codes, idempotent methods, authentication tokens, and API payload contracts.",
  },
  {
    canonical: "Supabase & Cloud Databases",
    category: "technical",
    aliases: ["supabase", "firebase", "relational database", "rls", "row-level security", "cloud database"],
    learningAdvice: "Implement Row-Level Security (RLS) policies and relational joins for multi-tenant SaaS safety.",
  },
  {
    canonical: "Git & Version Control",
    category: "technical",
    aliases: ["git", "github", "version control", "pull request", "pr"],
    learningAdvice: "Master git branch management, atomic commits, conventional commit messages, and PR reviews.",
  },
  {
    canonical: "Testing & QA",
    category: "technical",
    aliases: ["testing", "unit test", "integration test", "vitest", "jest", "qa", "quality assurance", "test plan"],
    learningAdvice: "Author unit tests covering edge cases, empty states, and validation boundaries.",
  },
];

// Helper to sanitize and tokenize text
function cleanText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s#+.\-_/]/g, " ");
}

export function parseJobDescription(jdText: string, candidateSkillsInput: string[]): JDAnalysisResult {
  const normalizedJd = jdText.trim();
  const lowerJd = cleanText(normalizedJd);

  // 1. Title Extraction: Heuristics based on common job titles
  const titlePatterns = [
    /associate product manager/i,
    /junior product manager/i,
    /product associate/i,
    /product manager/i,
    /product operations associate/i,
    /product analyst/i,
    /business analyst/i,
    /operations analyst/i,
    /product specialist/i,
    /implementation analyst/i,
    /software engineer/i,
    /junior software engineer/i,
    /full[- ]stack (?:engineer|developer)/i,
    /frontend (?:engineer|developer)/i,
    /backend (?:engineer|developer)/i,
  ];

  let jobTitle = "Opportunity / Unspecified Role";
  for (const pat of titlePatterns) {
    const match = normalizedJd.match(pat);
    if (match) {
      jobTitle = match[0];
      break;
    }
  }

  // Fallback: If no known title pattern, check first non-empty line
  if (jobTitle === "Opportunity / Unspecified Role" && normalizedJd.length > 0) {
    const lines = normalizedJd.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length > 0 && lines[0].length < 80) {
      jobTitle = lines[0].replace(/^(role|job title|position|hiring for)\s*[:\-]\s*/i, "");
    }
  }

  // 2. Experience Level Extraction
  const expMatch = normalizedJd.match(/(\d+[\s\-to\+]*\d*\s*(?:years?|yrs?)(?:\s*of\s*experience)?)/i);
  let experienceLevel = "Fresher / Entry-Level (0–1 Year)";
  if (expMatch) {
    experienceLevel = expMatch[1].trim();
  } else if (/fresher|entry[- ]level|graduate|campus|trainee|intern/i.test(lowerJd)) {
    experienceLevel = "Fresher / Trainee / Graduate (0–1 Year)";
  }

  // 3. Section Identification (Requirements vs Responsibilities vs Preferred)
  const lines = normalizedJd.split(/\r?\n/).map((l) => l.trim());
  let currentSection: "unknown" | "responsibilities" | "requirements" | "preferred" = "unknown";

  const keyRequirements: string[] = [];
  const keyResponsibilities: string[] = [];
  const rawReqLines: string[] = [];
  const rawPrefLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;

    // Detect Section Headers
    const isRespHeader = /^(?:key )?responsibilities|what you'?ll do|duties|your role|the opportunity/i.test(line);
    const isReqHeader = /^(?:minimum )?requirements|qualifications|what we'?re looking for|who you are|eligibility/i.test(line);
    const isPrefHeader = /preferred|nice to have|bonus|good to have|desired/i.test(line);

    if (isPrefHeader) {
      currentSection = "preferred";
      continue;
    } else if (isReqHeader) {
      currentSection = "requirements";
      continue;
    } else if (isRespHeader) {
      currentSection = "responsibilities";
      continue;
    }

    // Extract bullet points
    const isBullet = /^[\*\-\•\d+\.]\s+/.test(line);
    const cleanedLine = line.replace(/^[\*\-\•\d+\.]\s*/, "").trim();

    if (cleanedLine.length < 10) continue;

    if (currentSection === "responsibilities") {
      if (keyResponsibilities.length < 8) keyResponsibilities.push(cleanedLine);
    } else if (currentSection === "requirements") {
      if (keyRequirements.length < 8) keyRequirements.push(cleanedLine);
      rawReqLines.push(cleanedLine);
    } else if (currentSection === "preferred") {
      rawPrefLines.push(cleanedLine);
    } else if (isBullet && keyResponsibilities.length < 5) {
      keyResponsibilities.push(cleanedLine);
    }
  }

  // Fallback defaults if sections weren't explicitly structured
  if (keyResponsibilities.length === 0 && lines.length > 0) {
    lines.filter((l) => l.length > 25 && l.length < 150).slice(0, 4).forEach((l) => keyResponsibilities.push(l));
  }
  if (keyRequirements.length === 0 && lines.length > 0) {
    lines.filter((l) => l.length > 25 && l.length < 150).slice(4, 8).forEach((l) => keyRequirements.push(l));
  }

  // 4. Skills Extraction (Required vs Preferred)
  const reqText = (rawReqLines.join(" ") + " " + normalizedJd).toLowerCase();
  const prefText = rawPrefLines.join(" ").toLowerCase();

  const detectedSkills = new Set<string>();
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  SKILL_DATABASE.forEach((skill) => {
    // Check if skill alias exists in text
    const inPreferred = skill.aliases.some((alias) => prefText.includes(alias));
    const inOverall = skill.aliases.some((alias) => lowerJd.includes(alias));

    if (inPreferred) {
      preferredSkills.push(skill.canonical);
      detectedSkills.add(skill.canonical);
    } else if (inOverall) {
      requiredSkills.push(skill.canonical);
      detectedSkills.add(skill.canonical);
    }
  });

  // If no skills found, infer essential foundational skills based on detected role
  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    if (/product|pm|associate/i.test(jobTitle)) {
      requiredSkills.push("Product Management", "PRD & User Stories", "SQL", "Product Prioritization");
      preferredSkills.push("Figma & Wireframing", "A/B Testing & Experimentation");
    } else {
      requiredSkills.push("Python", "SQL", "Git & Version Control", "Testing & QA");
      preferredSkills.push("Data Visualization & Dashboards");
    }
  }

  // 5. Candidate Skills Matching
  const normalizedCandidateSkills = candidateSkillsInput
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const allJdSkills = [...requiredSkills, ...preferredSkills];

  allJdSkills.forEach((skillName) => {
    const skillDef = SKILL_DATABASE.find((s) => s.canonical === skillName);
    const aliases = skillDef ? [skillDef.canonical.toLowerCase(), ...skillDef.aliases] : [skillName.toLowerCase()];

    const isMatch = normalizedCandidateSkills.some((candSkill) =>
      aliases.some((alias) => candSkill.includes(alias) || alias.includes(candSkill))
    );

    if (isMatch) {
      matchedSkills.push(skillName);
    } else {
      missingSkills.push(skillName);
    }
  });

  const totalSkills = allJdSkills.length;
  const matchScore = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;

  // 6. Learning Priorities
  const learningPriorities: LearningPriority[] = missingSkills.map((missing) => {
    const def = SKILL_DATABASE.find((s) => s.canonical === missing);
    const isRequired = requiredSkills.includes(missing);
    return {
      skill: missing,
      priority: isRequired ? "High" : "Medium",
      actionableAdvice: def
        ? def.learningAdvice
        : `Review foundational concepts and complete a targeted portfolio exercise demonstrating ${missing}.`,
    };
  });

  return {
    jobTitle,
    experienceLevel,
    keyRequirements: keyRequirements.slice(0, 6),
    keyResponsibilities: keyResponsibilities.slice(0, 6),
    requiredSkills,
    preferredSkills,
    candidateSkills: candidateSkillsInput,
    matchedSkills,
    missingSkills,
    matchScore,
    learningPriorities,
    disclaimer:
      "Automated Heuristic Analysis: This report was generated locally using deterministic pattern extraction. It is intended for candidate interview preparation and skill gap identification. It does not constitute a guaranteed hiring prediction or resume ATS score.",
  };
}
