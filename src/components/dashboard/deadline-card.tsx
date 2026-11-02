import React from "react";
import Link from "next/link";
import { JobApplication } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime, formatDate } from "@/lib/utils";
import { Clock, Calendar, CheckCircle, ArrowRight } from "lucide-react";

interface DeadlineCardProps {
  deadlines: JobApplication[];
  followUps: JobApplication[];
}

export function DeadlineCard({ deadlines, followUps }: DeadlineCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Assessments & Interviews */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Upcoming Deadlines & Interviews</CardTitle>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full">
              {deadlines.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {deadlines.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-xs">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="font-medium text-foreground">No pending assessment or interview deadlines</p>
              <p className="mt-0.5">You're completely up to date!</p>
            </div>
          ) : (
            deadlines.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <Link
                    href={`/applications/${app.id}`}
                    className="font-semibold text-sm hover:underline text-foreground"
                  >
                    {app.company}
                  </Link>
                  <p className="text-xs text-muted-foreground">{app.job_title}</p>
                </div>
                <div className="text-right">
                  {app.assessment_date ? (
                    <span className="inline-block text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded border border-amber-200 dark:border-amber-900">
                      OA: {formatDateTime(app.assessment_date)}
                    </span>
                  ) : (
                    <span className="inline-block text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded border border-purple-200 dark:border-purple-900">
                      Interview: {formatDateTime(app.interview_date)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Follow-up Reminders */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">Scheduled Follow-Ups</CardTitle>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
              {followUps.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {followUps.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-xs">
              <p className="font-medium text-foreground">No upcoming follow-ups scheduled</p>
              <p className="mt-0.5">Set a follow-up date when creating or editing an application.</p>
            </div>
          ) : (
            followUps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <Link
                    href={`/applications/${app.id}`}
                    className="font-semibold text-sm hover:underline text-foreground"
                  >
                    {app.company}
                  </Link>
                  <p className="text-xs text-muted-foreground">{app.job_title}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-900">
                    Follow-up: {formatDate(app.follow_up_date)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
