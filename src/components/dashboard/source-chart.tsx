"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SourceBreakdownItem } from "@/types";
import { Share2 } from "lucide-react";

interface SourceChartProps {
  data: SourceBreakdownItem[];
}

export function SourceChart({ data }: SourceChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" /> Application Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
          <p className="font-medium text-sm">No source data recorded yet</p>
          <p className="text-xs mt-1">Specify recruitment sources (LinkedIn, Referral, etc.) when tracking applications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" /> Application Channels
          </CardTitle>
          <span className="text-xs text-muted-foreground">{data.length} channels</span>
        </div>
      </CardHeader>
      <CardContent className="pt-1 space-y-3">
        {data.map((item) => (
          <div key={item.source} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{item.source}</span>
              <span className="text-muted-foreground">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
