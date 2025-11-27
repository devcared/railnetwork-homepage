"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useDashboard } from "@/hooks/useDashboard";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";
import {
  RefreshCw,
  BarChart3,
  CheckCircle2,
  TrainFront,
  TrendingUp,
  Cpu,
  Activity,
  Clock,
} from "lucide-react";

type TelemetryClientProps = {
  session: Session;
};

const viewConfigs: Record<string, { title: string; description: string; icon: any }> = {
  default: {
    title: "Betriebszentrale",
    description: "Echtzeit-Monitoring aller Systeme",
    icon: TrainFront,
  },
  live: {
    title: "Live-Monitoring",
    description: "Züge, Energie & Auslastung",
    icon: Activity,
  },
  analytics: {
    title: "Leistungskennzahlen",
    description: "KPIs & Prognosen",
    icon: TrendingUp,
  },
  sensors: {
    title: "Sensoren & IoT",
    description: "Sensorstatus & Wartung",
    icon: Cpu,
  },
  history: {
    title: "Chronik",
    description: "Historische Messwerte",
    icon: Clock,
  },
};

export default function TelemetryClient({ session }: TelemetryClientProps) {
  const pathname = usePathname();
  const view = pathname.split("/").pop() || "default";
  const config = viewConfigs[view] || viewConfigs.default;

  const { metrics } = useDashboard({ session });
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const telemetryData = [
    {
      id: "cpu",
      label: "CPU-Auslastung",
      value: metrics?.cpu || 0,
      unit: "%",
      status: metrics && metrics.cpu > 80 ? "critical" : metrics && metrics.cpu > 60 ? "warning" : "normal",
      system: "Hamburg Hbf",
      lastUpdate: new Date(),
    },
    {
      id: "memory",
      label: "Speicher",
      value: metrics?.memory || 0,
      unit: "%",
      status: metrics && metrics.memory > 85 ? "critical" : metrics && metrics.memory > 70 ? "warning" : "normal",
      system: "Hamburg Hbf",
      lastUpdate: new Date(),
    },
    {
      id: "network",
      label: "Netzwerk",
      value: metrics?.network || 0,
      unit: "%",
      status: metrics && metrics.network > 90 ? "critical" : metrics && metrics.network > 75 ? "warning" : "normal",
      system: "Hamburg Hbf",
      lastUpdate: new Date(),
    },
    {
      id: "storage",
      label: "Storage",
      value: metrics?.storage || 0,
      unit: "%",
      status: metrics && metrics.storage > 90 ? "critical" : metrics && metrics.storage > 80 ? "warning" : "normal",
      system: "Hamburg Hbf",
      lastUpdate: new Date(),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 lg:text-3xl">
                  {config.title}
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {config.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <RefreshCw className="h-4 w-4" />
                  Aktualisieren
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {telemetryData.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {metric.value}
                        <span className="ml-1 text-lg text-slate-500 dark:text-slate-400">{metric.unit}</span>
                      </p>
                      <div className="mt-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                            metric.status
                          )}`}
                        >
                          {metric.status === "critical"
                            ? "Kritisch"
                            : metric.status === "warning"
                              ? "Warnung"
                              : "Normal"}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      <svg
                        className="h-6 w-6 text-slate-600 dark:text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        metric.status === "critical"
                          ? "bg-red-500"
                          : metric.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                  System-Status
                </h2>
                <div className="mt-4 space-y-3">
                  {["Hamburg Hbf", "München Hbf", "Berlin Hbf", "Frankfurt Hbf"].map(
                    (system) => (
                      <div
                        key={system}
                        className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700/60 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{system}</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                  Letzte Updates
                </h2>
                <div className="mt-4 space-y-3">
                  {[
                    { time: "Vor 2 Minuten", system: "Hamburg Hbf", metric: "CPU" },
                    { time: "Vor 5 Minuten", system: "München Hbf", metric: "Speicher" },
                    { time: "Vor 8 Minuten", system: "Berlin Hbf", metric: "Netzwerk" },
                    { time: "Vor 12 Minuten", system: "Frankfurt Hbf", metric: "Storage" },
                  ].map((update, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700/60 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {update.metric} - {update.system}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{update.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Detail Sheet */}
        {selectedMetric && (
          <Sheet
            open={!!selectedMetric}
            onOpenChange={(open) => !open && setSelectedMetric(null)}
            side="right"
            size="lg"
          >
            <SheetHeader>
              <SheetTitle>
                {telemetryData.find((m) => m.id === selectedMetric)?.label}
              </SheetTitle>
              <SheetDescription>
                Detaillierte Informationen und Verlauf
              </SheetDescription>
            </SheetHeader>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Aktueller Wert</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {telemetryData.find((m) => m.id === selectedMetric)?.value}
                      {telemetryData.find((m) => m.id === selectedMetric)?.unit}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-4 rounded-full bg-[#e2001a] transition-all"
                      style={{
                        width: `${
                          telemetryData.find((m) => m.id === selectedMetric)?.value || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-700/60 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">System</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {telemetryData.find((m) => m.id === selectedMetric)?.system}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-700/60 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                        telemetryData.find((m) => m.id === selectedMetric)?.status || "normal"
                      )}`}
                    >
                      {telemetryData.find((m) => m.id === selectedMetric)?.status === "critical"
                        ? "Kritisch"
                        : telemetryData.find((m) => m.id === selectedMetric)?.status === "warning"
                          ? "Warnung"
                          : "Normal"}
                    </span>
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </SessionProvider>
  );
}

