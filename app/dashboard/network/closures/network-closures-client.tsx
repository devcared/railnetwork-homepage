"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  XCircle,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  TrainFront,
  Search,
  Filter,
  Plus,
} from "lucide-react";

type NetworkClosuresClientProps = {
  session: Session;
};

type Closure = {
  id: string;
  route: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "scheduled" | "active" | "completed";
  impact: "low" | "medium" | "high" | "critical";
  affectedTrains: number;
  alternativeRoute?: string;
};

const mockClosures: Closure[] = [
  {
    id: "1",
    route: "Hamburg - Berlin, km 45-50",
    reason: "Gleiserneuerung",
    startDate: "2024-01-28",
    endDate: "2024-02-15",
    status: "scheduled",
    impact: "high",
    affectedTrains: 12,
    alternativeRoute: "Über Hannover",
  },
  {
    id: "2",
    route: "München Hbf, Gleis 5-7",
    reason: "Brückensanierung",
    startDate: "2024-01-25",
    endDate: "2024-02-20",
    status: "active",
    impact: "critical",
    affectedTrains: 28,
    alternativeRoute: "Gleis 8-10",
  },
  {
    id: "3",
    route: "Frankfurt - Köln, km 120-125",
    reason: "Signalmodernisierung",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    status: "scheduled",
    impact: "medium",
    affectedTrains: 8,
  },
];

const impactColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function NetworkClosuresClient({ session }: NetworkClosuresClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const filteredClosures = mockClosures.filter((closure) => {
    const matchesSearch = closure.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || closure.status === statusFilter;
    const matchesImpact = impactFilter === "all" || closure.impact === impactFilter;
    return matchesSearch && matchesStatus && matchesImpact;
  });

  const activeCount = mockClosures.filter((c) => c.status === "active").length;
  const scheduledCount = mockClosures.filter((c) => c.status === "scheduled").length;
  const totalAffected = mockClosures.reduce((sum, c) => sum + c.affectedTrains, 0);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <div className="px-6 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <Breadcrumbs />
            <div className="flex items-center gap-2">
              <button className="hidden items-center gap-1.5 rounded-md bg-[#e2001a] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#c10015] sm:flex">
                <Plus className="h-3.5 w-3.5" />
                Sperrung
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Aktive Sperrungen</p>
                  <p className="mt-1 text-3xl font-bold text-red-900">{activeCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-blue-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Geplant</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">{scheduledCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Betroffene Züge</p>
                  <p className="mt-1 text-3xl font-bold text-orange-900">{totalAffected}</p>
                </div>
                <TrainFront className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Strecke suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Status</option>
                  <option value="scheduled">Geplant</option>
                  <option value="active">Aktiv</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
                <select
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Auswirkungen</option>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                  <option value="critical">Kritisch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Closures List */}
          <div className="space-y-4">
            {filteredClosures.map((closure) => {
              const isActive = closure.status === "active";
              const daysRemaining = Math.ceil(
                (new Date(closure.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={closure.id}
                  className={`group overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                    isActive
                      ? "border-red-200/60 bg-gradient-to-r from-red-50/50 to-white"
                      : "border-slate-200/60 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[a-z]*-500 shadow-md">
                          <XCircle className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{closure.route}</h3>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${impactColors[closure.impact]}`}
                            >
                              {closure.impact === "low"
                                ? "Niedrig"
                                : closure.impact === "medium"
                                  ? "Mittel"
                                  : closure.impact === "high"
                                    ? "Hoch"
                                    : "Kritisch"}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                closure.status === "active"
                                  ? "bg-red-100 text-red-700"
                                  : closure.status === "scheduled"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {closure.status === "active"
                                ? "Aktiv"
                                : closure.status === "scheduled"
                                  ? "Geplant"
                                  : "Abgeschlossen"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{closure.reason}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Start</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {new Date(closure.startDate).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ende</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {new Date(closure.endDate).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Betroffene Züge</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{closure.affectedTrains}</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {isActive ? "Verbleibend" : "Dauer"}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {isActive ? `${daysRemaining} Tage` : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Alternative Route */}
                      {closure.alternativeRoute && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-blue-700">Alternative Route</p>
                            <p className="text-sm font-semibold text-blue-900">{closure.alternativeRoute}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClosures.length === 0 && (
            <div className="py-16 text-center">
              <XCircle className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Keine Sperrungen gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

