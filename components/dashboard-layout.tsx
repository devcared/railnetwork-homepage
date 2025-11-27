"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard-sidebar";

type DashboardLayoutProps = {
  session: Session;
  children: React.ReactNode;
};

export default function DashboardLayout({
  session,
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
        <div className="flex min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      <DashboardSidebar session={session} onCollapsedChange={setIsCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

