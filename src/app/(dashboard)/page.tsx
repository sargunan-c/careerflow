"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { JobApplication, DashboardMetrics } from "@/types";
import { calculateMetrics } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { SourceChart } from "@/components/dashboard/source-chart";
import { DeadlineCard } from "@/components/dashboard/deadline-card";
import { SupabaseConfigBanner } from "@/components/ui/supabase-config-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  TrendingUp,
  Award,
  Video,
  ArrowRight,
  Loader2,
  ExternalLink,
  Target,
  Percent,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("applications")
        .select("*")
        .order("application_date", { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }

      setApplications((data as JobApplication[]) || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard applications.");
    } finally {
      setLoading(false);
    }
  }, [configured, supabase]);

  useEffect(() => {
    fetchApplications();

    const handleRefresh = () => {
      fetchApplications();
    };

    window.addEventListener("careerflow:refresh", handleRefresh);
    return () => {
      window.removeEventListener("careerflow:refresh", handleRefresh);
    };
  }, [fetchApplications]);

  const metrics: DashboardMetrics = calculateMetrics(applications);

  return (
    <div className="space-y-6">
      {/* Banner if backend is not yet connected */}
      {!configured && <SupabaseConfigBanner />}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          <p className="text-sm">Retrieving your pipeline data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchApplications}>
            Retry
          </Button>
        </div>
      )}

      {!loading && (
        <>
          {/* Top Row: Core Conversion Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Applications"
              value={metrics.total}
              description="Lifetime applications logged"
              icon={Briefcase}
              variant="default"
            />
            <StatCard
              title="Active Pipeline"
              value={metrics.active}
              description="In review or interview stages"
              icon={TrendingUp}
              variant="primary"
            />
            <StatCard
              title="Interview Rate"
              value={`${metrics.interviewConversionRate}%`}
              description={`${metrics.interviews} interviews reached`}
              icon={Video}
              variant="purple"
            />
            <StatCard
              title="Rejection Rate"
              value={`${metrics.rejectionRate}%`}
              description="Closed without an offer"
              icon={XCircle}
              variant="amber"
            />
            <StatCard
              title="Offers Secured"
              value={metrics.offers}
              description={`${metrics.offerConversionRate}% total conversion`}
              icon={Award}
              variant="emerald"
            />
          </div>

          {/* Quick Action / Feature Promotion Card */}
          <div className="rounded-xl border bg-gradient-to-r from-blue-50/50 via-card to-purple-50/30 dark:from-blue-950/20 dark:via-card dark:to-purple-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  Job Description Intelligence Tool
                </h3>
                <p className="text-xs text-muted-foreground">
                  Paste any job description to instantly extract required skills, experience expectations, and compare your profile match.
                </p>
              </div>
            </div>
            <Link href="/job-intelligence" className="shrink-0">
              <Button size="sm" className="gap-1.5 text-xs">
                Launch JD Analyzer <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Middle Row: Funnel Chart & Application Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusChart data={metrics.statusDistribution} />
            <ActivityChart data={metrics.activityOverTime} />
          </div>

          {/* Source Breakdown & Upcoming Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SourceChart data={metrics.sourceBreakdown} />
            </div>
            <div className="lg:col-span-2">
              <DeadlineCard
                deadlines={metrics.upcomingDeadlines}
                followUps={metrics.pendingFollowUps}
              />
            </div>
          </div>

          {/* Recent Applications Preview */}
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-foreground text-base">Recent Pipeline Activity</h3>
                <p className="text-xs text-muted-foreground">Latest job applications in your database</p>
              </div>
              <Link href="/applications">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All Applications <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">No applications logged yet</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Click the <strong>Add Application</strong> button in the top right to start tracking your recruitment process.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-3 hover:bg-muted/30 transition-colors px-2 rounded-lg"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/applications/${app.id}`}
                          className="font-medium text-sm text-foreground hover:underline"
                        >
                          {app.company}
                        </Link>
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {app.source && (
                          <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded border">
                            {app.source}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{app.job_title}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        Applied {formatDate(app.application_date)}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
