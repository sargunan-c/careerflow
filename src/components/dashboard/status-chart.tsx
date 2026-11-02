"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplicationStatus } from "@/types";

interface StatusChartProps {
  data: { status: ApplicationStatus; count: number; percentage: number }[];
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Saved: "#94a3b8", // Slate
  Applied: "#3b82f6", // Blue
  Assessment: "#f59e0b", // Amber
  Interview: "#8b5cf6", // Purple
  Offer: "#10b981", // Emerald
  Rejected: "#f43f5e", // Rose
  Withdrawn: "#71717a", // Zinc
};

export function StatusChart({ data }: StatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Stage Funnel</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Loading visualization...
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Stage Funnel</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
          <p className="font-medium text-sm">No applications recorded yet</p>
          <p className="text-xs mt-1">Add your first job application to see recruitment stage distribution.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Application Stage Pipeline</CardTitle>
          <span className="text-xs text-muted-foreground">{total} total logged</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="status"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as {
                      status: ApplicationStatus;
                      count: number;
                      percentage: number;
                    };
                    return (
                      <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs">
                        <span className="font-semibold text-foreground">{item.status}</span>
                        <div className="text-muted-foreground mt-0.5">
                          {item.count} applications ({item.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

