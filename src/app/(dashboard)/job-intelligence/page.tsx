"use client";

import React, { useState } from "react";
import { parseJobDescription } from "@/lib/jd-parser";
import { JDAnalysisResult } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Target,
  ArrowRight,
  BookOpen,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";

const SAMPLE_APM_JD = `Role: Associate Product Manager (Fresher / 0-1 Year Experience)
Company: NextGen Commerce India
Location: Bengaluru (Hybrid)

About the Role:
We are looking for an ambitious Associate Product Manager to join our Growth and Checkout teams. You will work cross-functionally with engineering, design, and business teams to launch user-centric features.

Key Responsibilities:
- Gather customer requirements and translate them into clear PRDs and user stories.
- Define feature prioritization using the RICE framework and manage the sprint backlog in JIRA.
- Analyze daily and weekly funnel metrics, retention cohorts, and cart abandonment using SQL.
- Collaborate with UX designers on wireframes and user journeys in Figma.
- Design and execute A/B testing experiments to optimize user conversion.
- Present performance reviews and feature post-mortems to key stakeholders.

Requirements:
- B.Tech / BE or equivalent degree (2025/2026 batch graduates welcome).
- Strong analytical and problem-solving skills; working knowledge of SQL and Excel.
- Solid understanding of product management fundamentals, user empathy, and Agile/Scrum.
- High attention to detail and clear written communication for PRDs and acceptance criteria.

Preferred Qualifications:
- Familiarity with Python, data visualization tools (Tableau, Streamlit), or competitor analysis.
- Prior exposure to e-commerce, logistics operations, or SaaS workflows.`;

const DEFAULT_CANDIDATE_SKILLS = "SQL, Python, Product Management, PRD & User Stories, Product Prioritization, Agile / Scrum, Figma & Wireframing, Git & Version Control";

export default function JobIntelligencePage() {
  const [jdText, setJdText] = useState("");
  const [candidateSkillsInput, setCandidateSkillsInput] = useState(DEFAULT_CANDIDATE_SKILLS);
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    try {
      const skills = candidateSkillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const result = parseJobDescription(jdText, skills);
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setJdText(SAMPLE_APM_JD);
    const skills = candidateSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const result = parseJobDescription(SAMPLE_APM_JD, skills);
    setAnalysisResult(result);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Job Description Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Automated extraction, skill-match benchmarking, and personalized interview preparation priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Paste Job Description</CardTitle>
              <CardDescription className="text-xs">
                Supports pasted text from LinkedIn, Naukri, or company careers pages.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadSample}
              className="text-xs"
            >
              Load Sample APM Posting
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            rows={7}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste complete job description text here (including responsibilities, requirements, and qualifications)..."
            className="w-full rounded-md border border-input bg-background p-3 text-xs sm:text-sm font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Your Current Skills (comma-separated):
            </label>
            <Input
              value={candidateSkillsInput}
              onChange={(e) => setCandidateSkillsInput(e.target.value)}
              placeholder="e.g. SQL, Product Management, PRD, User Stories, Python, Figma, Agile"
              className="text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={!jdText.trim() || isAnalyzing}
              className="gap-2 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Job Description
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Disclaimer Banner */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
            <p className="leading-relaxed">{analysisResult.disclaimer}</p>
          </div>

          {/* Top Score & Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Match Score Card */}
            <Card className="md:col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Skill Match Alignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground">
                    {analysisResult.matchScore}%
                  </span>
                  <span className="text-xs text-muted-foreground">match against required skills</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      analysisResult.matchScore >= 70
                        ? "bg-emerald-500"
                        : analysisResult.matchScore >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${analysisResult.matchScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {analysisResult.matchedSkills.length} of{" "}
                  {analysisResult.matchedSkills.length + analysisResult.missingSkills.length} identified skills matched.
                </p>
              </CardContent>
            </Card>

            {/* Extracted Role & Experience Card */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Extracted Role Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Detected Job Title
                    </span>
                    <p className="font-semibold text-sm text-foreground capitalize">
                      {analysisResult.jobTitle}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Experience Expectation
                    </span>
                    <p className="font-semibold text-sm text-foreground">
                      {analysisResult.experienceLevel}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Ready to track this opportunity in your pipeline?
                  </span>
                  <Link href="/applications">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      Add to Pipeline <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Responsibilities & Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Responsibilities */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {analysisResult.keyResponsibilities.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No specific responsibility bullets identified.</p>
                ) : (
                  <ul className="space-y-2 text-xs text-foreground">
                    {analysisResult.keyResponsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Key Requirements & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {analysisResult.keyRequirements.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No explicit qualification bullets extracted.</p>
                ) : (
                  <ul className="space-y-2 text-xs text-foreground">
                    {analysisResult.keyRequirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Skills Breakdown: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Matched Skills ({analysisResult.matchedSkills.length})
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">Demonstrated in your profile</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {analysisResult.matchedSkills.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    None of your current profile skills overlap with extracted JD keywords.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" /> Skill Gaps ({analysisResult.missingSkills.length})
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">Opportunities to address</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {analysisResult.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Excellent match! You cover all skills extracted from this job posting.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actionable Learning Priorities */}
          {analysisResult.learningPriorities.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Suggested Interview Preparation Priorities
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">Ranked by requirement severity</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 divide-y divide-border">
                {analysisResult.learningPriorities.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{item.skill}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            item.priority === "High"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.actionableAdvice}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
