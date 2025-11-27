"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useDashboard } from "@/hooks/useDashboard";
import {
  TrainFront,
  Zap,
  Activity,
  Gauge,
  TrendingUp,
  RefreshCw,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type TelemetryLiveClientProps = {
  session: Session;
};

type LiveTrain = {
  id: string;
  number: string;
  route: string;
  speed: number;
  energy: number;
  utilization: number;
  status: "on-time" | "delayed" | "early";
  location: string;
  nextStation: string;
  eta: string;
};

const mockTrains: LiveTrain[] = [
  {
    id: "1",
    number: "ICE 412",
    route: "Hamburg → München",
    speed: 245,
    energy: 87,
    utilization: 92,
    status: "on-time",
    location: "km 234",
    nextStation: "Hannover Hbf",
    eta: "14:32",
  },
  {
    id: "2",
    number: "RE 1234",
    route: "Berlin → Hamburg",
    speed: 120,
    energy: 65,
    utilization: 78,
    status: "delayed",
    location: "km 156",
    nextStation: "Magdeburg Hbf",
    eta: "14:45",
  },
  {
    id: "3",
    number: "RB 5678",
    route: "Köln → Frankfurt",
    speed: 95,
    energy: 45,
    utilization: 56,
    status: "on-time",
    location: "km 89",
    nextStation: "Bonn Hbf",
    eta: "15:12",
  },
];

export default function TelemetryLiveClient({ session }: TelemetryLiveClientProps) {
  const { metrics } = useDashboard({ session });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000); // Update alle 5 Sekunden

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: LiveTrain["status"]) => {
    switch (status) {
      case "on-time":
        return "bg-emerald-100 text-emerald-700";
      case "delayed":
        return "bg-red-100 text-red-700";
      case "early":
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusLabel = (status: LiveTrain["status"]) => {
    switch (status) {
      case "on-time":
        return "Pünktlich";
      case "delayed":
        return "Verspätet";
      case "early":
        return "Früh";
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header mit Live-Indikator */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2001a] shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 lg:text-3xl">
                      Live-Monitoring
                    </h1>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">LIVE</span>
                    </div>
                  </div>
                  <p className="font-db-screensans mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Züge, Energie & Auslastung in Echtzeit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Letztes Update</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {lastUpdate.toLocaleTimeString("de-DE")}
                  </p>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    autoRefresh
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Aktiv" : "Pausiert"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Energie-Übersicht Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md">
                    <Zap className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Gesamt</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">2.4 MW</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Aktuelle Leistung</p>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs. Vorstunde</span>
                </div>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md">
                    <Gauge className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Auslastung</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">87%</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Durchschnitt</p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900/20">
                  <div className="h-full w-[87%] rounded-full bg-amber-500 dark:bg-amber-600"></div>
                </div>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
                    <TrainFront className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Aktiv</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">23</p>
                <p className="mt-1 text-sm text-slate-600">Züge unterwegs</p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-600">Alle Systeme OK</span>
                </div>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-600">Verspätungen</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">2</p>
                <p className="mt-1 text-sm text-slate-600">Aktuelle Meldungen</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-600">-5 min</span>
                  <span className="text-xs text-slate-500">Durchschnitt</span>
                </div>
              </div>
            </div>

            {/* Live-Zug-Übersicht */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-db-screenhead text-xl font-bold text-slate-900">
                  Züge in Echtzeit
                </h2>
                <span className="text-sm font-medium text-slate-500">
                  {mockTrains.length} Züge aktiv
                </span>
              </div>
            </div>

            {/* Zug-Liste mit innovativem Design */}
            <div className="space-y-4">
              {mockTrains.map((train) => (
                <div
                  key={train.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    {/* Linke Seite: Zug-Info */}
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#e2001a] to-[#ff6f61] shadow-md">
                          <TrainFront className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{train.number}</h3>
                          <p className="text-sm font-medium text-slate-600">{train.route}</p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            train.status
                          )}`}
                        >
                          {getStatusLabel(train.status)}
                        </span>
                      </div>

                      {/* Metriken Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-medium text-slate-500">Geschwindigkeit</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">{train.speed} km/h</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-medium text-slate-500">Energie</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">{train.energy}%</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-slate-500">Auslastung</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">{train.utilization}%</p>
                        </div>
                      </div>

                      {/* Standort & Route */}
                      <div className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{train.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">
                            Nächster Halt: {train.nextStation}
                          </span>
                          <span className="text-sm text-slate-500">({train.eta})</span>
                        </div>
                      </div>
                    </div>

                    {/* Rechte Seite: Visualisierung */}
                    <div className="ml-6 flex flex-col items-end gap-4">
                      {/* Energie-Bar */}
                      <div className="w-32 space-y-2">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Energie</span>
                            <span className="font-semibold text-slate-900">{train.energy}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                              style={{ width: `${train.energy}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Auslastung</span>
                            <span className="font-semibold text-slate-900">{train.utilization}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                              style={{ width: `${train.utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

