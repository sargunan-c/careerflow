"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, LayoutDashboard, Briefcase, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/status";

interface HeaderProps {
  onOpenAddModal?: () => void;
}

export function Header({ onOpenAddModal }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  const handleSignOut = async () => {
    if (configured) {
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  const getPageTitle = () => {
    if (pathname === "/") return "Overview Dashboard";
    if (pathname.startsWith("/job-intelligence")) return "Job Description Intelligence";
    if (pathname.startsWith("/applications/")) return "Application Details";
    if (pathname.startsWith("/applications")) return "Job Applications Pipeline";
    return "CareerFlow";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {onOpenAddModal && (
          <Button onClick={onOpenAddModal} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md p-6 md:hidden animate-in fade-in space-y-6">
          <nav className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-base font-medium hover:bg-muted"
            >
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/applications"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-base font-medium hover:bg-muted"
            >
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Applications Pipeline</span>
            </Link>
            <Link
              href="/job-intelligence"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-base font-medium hover:bg-muted"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span>JD Intelligence</span>
            </Link>
          </nav>

          <div className="border-t pt-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                handleSignOut();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
