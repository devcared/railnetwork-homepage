"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

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
      <div className="min-h-screen bg-[var(--page-bg)]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Reports
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600">
                  Generieren und verwalten Sie Reports
                </p>
              </div>
              <button
                onClick={() => setShowGenerateReport(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
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
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <svg
                            className="h-5 w-5 text-blue-600"
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
                          <h3 className="text-lg font-bold text-slate-900">
                            {report.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
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
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        Abgeschlossen
                      </span>
                      <a
                        href={report.fileUrl}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    required
                  >
                    <option value="telemetry">Telemetrie</option>
                    <option value="performance">Performance</option>
                    <option value="alerts">Alerts</option>
                    <option value="custom">Benutzerdefiniert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Zeitraum *
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
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

