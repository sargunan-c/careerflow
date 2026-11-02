import React from "react";
import { AlertTriangle, Key, Database, ExternalLink } from "lucide-react";

export function SupabaseConfigBanner() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-5 text-amber-900 shadow-xs dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base text-amber-900 dark:text-amber-100">
              Supabase Backend Setup Required
            </h4>
            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Action Needed
            </span>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            CareerFlow connects to your personal Supabase PostgreSQL database to ensure strict
            Row-Level Security (RLS) and zero data leakage. To activate live data storage and
            authentication:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-3 border border-amber-200 dark:border-amber-800">
              <span className="font-semibold block mb-1 flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> 1. Create Project
              </span>
              Create a free project at{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium hover:text-amber-950"
              >
                supabase.com
              </a>
            </div>
            <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-3 border border-amber-200 dark:border-amber-800">
              <span className="font-semibold block mb-1 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> 2. Run Migration
              </span>
              Paste & run <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">supabase/schema.sql</code> in SQL Editor
            </div>
            <div className="rounded-lg bg-white/70 dark:bg-slate-900/50 p-3 border border-amber-200 dark:border-amber-800">
              <span className="font-semibold block mb-1 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" /> 3. Set .env.local
              </span>
              Add <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> & Anon Key
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

