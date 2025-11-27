"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import {
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TelemetryHistoryClientProps = {
  session: Session;
};

type HistoryEntry = {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  change: number;
  system: string;
  status: "normal" | "warning" | "critical";
};

const mockHistory: HistoryEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-27 14:30",
    metric: "CPU-Auslastung",
    value: 78,
    unit: "%",
    change: 5.2,
    system: "Hamburg Hbf",
    status: "normal",
  },
  {
    id: "2",
    timestamp: "2024-01-27 14:25",
    metric: "Speicher",
    value: 82,
    unit: "%",
    change: -2.1,
    system: "München Hbf",
    status: "warning",
  },
  {
    id: "3",
    timestamp: "2024-01-27 14:20",
    metric: "Netzwerk",
    value: 45,
    unit: "%",
    change: 12.3,
    system: "Berlin Hbf",
    status: "normal",
  },
  {
    id: "4",
    timestamp: "2024-01-27 14:15",
    metric: "Storage",
    value: 67,
    unit: "%",
    change: 1.5,
    system: "Frankfurt Hbf",
    status: "normal",
  },
  {
    id: "5",
    timestamp: "2024-01-27 14:10",
    metric: "CPU-Auslastung",
    value: 95,
    unit: "%",
    change: 15.8,
    system: "Hamburg Hbf",
    status: "critical",
  },
];

export default function TelemetryHistoryClient({ session }: TelemetryHistoryClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>("2024-01-27");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredHistory = mockHistory.filter((entry) => {
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: HistoryEntry["status"]) => {
    switch (status) {
      case "normal":
        return "bg-emerald-100 text-emerald-700";
      case "warning":
        return "bg-amber-100 text-amber-700";
      case "critical":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                    Chronik
                  </h1>
                  <p className="font-db-screensans mt-1 text-sm text-slate-600">
                    Historische Messwerte und Verläufe
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Filter & Date Picker */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm font-medium text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                  >
                    <option value="all">Alle Status</option>
                    <option value="normal">Normal</option>
                    <option value="warning">Warnung</option>
                    <option value="critical">Kritisch</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Timeline-Ansicht */}
            <div className="space-y-4">
              {filteredHistory.map((entry, index) => (
                <div
                  key={entry.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    {/* Timeline-Line */}
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute left-8 top-16 h-full w-0.5 bg-slate-200"></div>
                    )}
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white shadow-md ${
                      entry.status === "normal"
                        ? "bg-emerald-500"
                        : entry.status === "warning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}>
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-base font-bold text-slate-900">{entry.metric}</h3>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                                entry.status
                              )}`}
                            >
                              {entry.status === "normal"
                                ? "Normal"
                                : entry.status === "warning"
                                  ? "Warnung"
                                  : "Kritisch"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{entry.system}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            {entry.value} {entry.unit}
                          </p>
                          <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                            entry.change >= 0 ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {entry.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(entry.change)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHistory.length === 0 && (
              <div className="py-16 text-center">
                <Clock className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-4 text-sm font-medium text-slate-500">Keine Einträge gefunden</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

