"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";
import { Plus } from "lucide-react";

type ReportsClientProps = {
  session: Session;
};

export default function ReportsClient({ session }: ReportsClientProps) {
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [reportType, setReportType] = useState<"telemetry" | "performance" | "alerts" | "custom">("telemetry");
  const [dateRange, setDateRange] = useState("7d");

  const reports = [
    {
      id: "1",
      name: "Telemetrie-Report - Woche 45",
      type: "telemetry",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
      fileUrl: "#",
    },
    {
      id: "2",
      name: "Performance-Report - Oktober",
      type: "performance",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "completed",
      fileUrl: "#",
    },
    {
      id: "3",
      name: "Alert-Report - Q4",
      type: "alerts",
      generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "completed",
      fileUrl: "#",
    },
  ];

  const handleGenerateReport = async () => {
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowGenerateReport(false);
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="px-6 py-3 lg:px-8">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <button
                onClick={() => setShowGenerateReport(true)}
                className="hidden items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 sm:flex"
              >
                <Plus className="h-3.5 w-3.5" />
                Report generieren
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <svg
                            className="h-5 w-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {report.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {report.type === "telemetry"
                              ? "Telemetrie"
                              : report.type === "performance"
                                ? "Performance"
                                : "Alerts"}{" "}
                            • Generiert am{" "}
                            {new Date(report.generatedAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/20 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        Abgeschlossen
                      </span>
                      <a
                        href={report.fileUrl}
                        className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Report Sheet */}
        <Sheet
          open={showGenerateReport}
          onOpenChange={setShowGenerateReport}
          side="right"
          size="md"
        >
          <SheetHeader>
            <SheetTitle>Report generieren</SheetTitle>
            <SheetDescription>
              Erstellen Sie einen neuen Report mit Ihren Einstellungen
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }}>
            <SheetContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Report-Typ *
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as typeof reportType)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    required
                  >
                    <option value="telemetry">Telemetrie</option>
                    <option value="performance">Performance</option>
                    <option value="alerts">Alerts</option>
                    <option value="custom">Benutzerdefiniert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Zeitraum *
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    required
                  >
                    <option value="7d">Letzte 7 Tage</option>
                    <option value="30d">Letzte 30 Tage</option>
                    <option value="90d">Letzte 90 Tage</option>
                    <option value="custom">Benutzerdefiniert</option>
                  </select>
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                type="button"
                onClick={() => setShowGenerateReport(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Generieren
              </button>
            </SheetFooter>
          </form>
        </Sheet>
      </div>
    </SessionProvider>
  );
}

