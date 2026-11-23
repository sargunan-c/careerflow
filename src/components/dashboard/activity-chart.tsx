"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityOverTimeItem } from "@/types";
import { TrendingUp } from "lucide-react";

interface ActivityChartProps {
  data: ActivityOverTimeItem[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Loading trend...
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Application Volume Over Time
            </CardTitle>
            <span className="text-xs text-muted-foreground">Historical Trend</span>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
          <p className="font-medium text-sm">No timeline activity logged yet</p>
          <p className="text-xs mt-1">Applications logged will automatically group into monthly volume trends.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Application Volume Over Time
          </CardTitle>
          <span className="text-xs text-muted-foreground">{total} total applications</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="period"
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
                    const item = payload[0].payload as ActivityOverTimeItem;
                    return (
                      <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs">
                        <span className="font-semibold text-foreground">{item.period}</span>
                        <div className="text-muted-foreground mt-0.5">
                          {item.count} {item.count === 1 ? "application" : "applications"} submitted
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
