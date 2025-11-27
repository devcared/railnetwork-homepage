"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  Construction,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

type NetworkConstructionClientProps = {
  session: Session;
};

type ConstructionSite = {
  id: string;
  name: string;
  location: string;
  type: "track" | "bridge" | "station" | "signal";
  status: "planned" | "active" | "paused" | "completed";
  startDate: string;
  endDate: string;
  progress: number;
  workers: number;
  budget: number;
  spent: number;
  priority: "low" | "medium" | "high" | "critical";
};

const mockSites: ConstructionSite[] = [
  {
    id: "1",
    name: "Gleiserneuerung Strecke A-B",
    location: "Hamburg - Berlin, km 45-50",
    type: "track",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    progress: 65,
    workers: 24,
    budget: 2500000,
    spent: 1625000,
    priority: "high",
  },
  {
    id: "2",
    name: "Brückensanierung Weiche 123",
    location: "Hamburg Hbf",
    type: "bridge",
    status: "active",
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    progress: 45,
    workers: 12,
    budget: 850000,
    spent: 382500,
    priority: "critical",
  },
  {
    id: "3",
    name: "Signalmodernisierung Block 12",
    location: "München Hbf",
    type: "signal",
    status: "planned",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    progress: 0,
    workers: 0,
    budget: 450000,
    spent: 0,
    priority: "medium",
  },
];

const typeColors = {
  track: "from-blue-500 to-cyan-500",
  bridge: "from-amber-500 to-orange-500",
  station: "from-purple-500 to-pink-500",
  signal: "from-emerald-500 to-teal-500",
};

export default function NetworkConstructionClient({ session }: NetworkConstructionClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSites = mockSites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockSites.filter((s) => s.status === "active").length;
  const totalBudget = mockSites.reduce((sum, s) => sum + s.budget, 0);
  const totalSpent = mockSites.reduce((sum, s) => sum + s.spent, 0);
  const averageProgress = mockSites.filter((s) => s.status === "active").reduce((sum, s) => sum + s.progress, 0) / activeCount || 0;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <div className="px-6 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <Breadcrumbs />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-blue-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Aktive Baustellen</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">{activeCount}</p>
                </div>
                <Construction className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Ø Fortschritt</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-900">{averageProgress.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-purple-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Budget</p>
                  <p className="mt-1 text-2xl font-bold text-purple-900">
                    {(totalSpent / 1000000).toFixed(1)}M / {(totalBudget / 1000000).toFixed(1)}M €
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
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
                  placeholder="Baustelle suchen..."
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
                  <option value="planned">Geplant</option>
                  <option value="active">Aktiv</option>
                  <option value="paused">Pausiert</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sites List */}
          <div className="space-y-4">
            {filteredSites.map((site) => {
              const typeColor = typeColors[site.type];
              const budgetPercentage = (site.spent / site.budget) * 100;

              return (
                <div
                  key={site.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md">
                          <Construction className="h-7 w-7 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{site.name}</h3>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                site.status === "active"
                                  ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                  : site.status === "planned"
                                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                    : site.status === "paused"
                                      ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {site.status === "active"
                                ? "Aktiv"
                                : site.status === "planned"
                                  ? "Geplant"
                                  : site.status === "paused"
                                    ? "Pausiert"
                                    : "Abgeschlossen"}
                            </span>
                            {site.priority === "critical" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/20 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                Kritisch
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span>{site.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Fortschritt</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{site.progress}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-[#e2001a] transition-all"
                            style={{ width: `${site.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mitarbeiter</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{site.workers}</p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Start</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {new Date(site.startDate).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ziel</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {new Date(site.endDate).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Budget</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {budgetPercentage.toFixed(0)}% genutzt
                          </p>
                        </div>
                      </div>

                      {/* Budget Bar */}
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Ausgaben</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {site.spent.toLocaleString("de-DE")} € / {site.budget.toLocaleString("de-DE")} €
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className={`h-full rounded-full ${
                              budgetPercentage > 90
                                ? "bg-red-500"
                                : budgetPercentage > 75
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSites.length === 0 && (
            <div className="py-16 text-center">
              <Construction className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Keine Baustellen gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

