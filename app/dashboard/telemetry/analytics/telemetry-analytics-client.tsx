"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type TelemetryAnalyticsClientProps = {
  session: Session;
};

type KPI = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  target: string;
  icon: any;
  color: string;
};

const kpis: KPI[] = [
  {
    id: "1",
    label: "Pünktlichkeit",
    value: "94.2%",
    change: 2.3,
    trend: "up",
    target: "95%",
    icon: Target,
    color: "emerald",
  },
  {
    id: "2",
    label: "Energieeffizienz",
    value: "87.5%",
    change: -1.2,
    trend: "down",
    target: "90%",
    icon: Award,
    color: "amber",
  },
  {
    id: "3",
    label: "Durchschnittsgeschwindigkeit",
    value: "142 km/h",
    change: 5.8,
    trend: "up",
    target: "145 km/h",
    icon: TrendingUp,
    color: "blue",
  },
  {
    id: "4",
    label: "Auslastung",
    value: "78.3%",
    change: 3.1,
    trend: "up",
    target: "80%",
    icon: BarChart3,
    color: "purple",
  },
];

const forecasts = [
  {
    period: "Nächste 24h",
    prediction: "Pünktlichkeit: 95.1%",
    confidence: 92,
    trend: "up",
  },
  {
    period: "Nächste Woche",
    prediction: "Energieverbrauch: -3.2%",
    confidence: 88,
    trend: "down",
  },
  {
    period: "Nächster Monat",
    prediction: "Auslastung: +5.4%",
    confidence: 85,
    trend: "up",
  },
];

export default function TelemetryAnalyticsClient({ session }: TelemetryAnalyticsClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week");

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-700",
      amber: "from-amber-500 to-amber-600 bg-amber-50 text-amber-700",
      blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-700",
      purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="px-6 py-3 lg:px-8">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-0.5">
                  {(["day", "week", "month"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        selectedPeriod === period
                          ? "bg-[#e2001a] text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {period === "day" ? "Tag" : period === "week" ? "Woche" : "Monat"}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* KPI Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => {
                const IconComponent = kpi.icon;
                const colorClasses = getColorClasses(kpi.color);
                const [bgFrom, bgTo, cardBg, textColor] = colorClasses.split(" ");

                return (
                  <div
                    key={kpi.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md`}>
                        <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        kpi.trend === "up" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}>
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(kpi.change)}%
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">{kpi.value}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Ziel: {kpi.target}</span>
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${bgFrom} ${bgTo}`}
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prognosen & Trends */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Prognosen */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-db-screenhead text-lg font-bold text-slate-900">
                    Prognosen
                  </h2>
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                  {forecasts.map((forecast, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/50 to-white p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{forecast.period}</span>
                        <span className="text-xs font-medium text-slate-500">
                          {forecast.confidence}% Konfidenz
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{forecast.prediction}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {forecast.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-xs font-medium text-slate-500">
                          {forecast.trend === "up" ? "Steigender Trend" : "Sinkender Trend"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance-Vergleich */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-db-screenhead text-lg font-bold text-slate-900">
                    Performance-Vergleich
                  </h2>
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Pünktlichkeit", current: 94.2, previous: 91.9, target: 95 },
                    { label: "Energieeffizienz", current: 87.5, previous: 88.7, target: 90 },
                    { label: "Auslastung", current: 78.3, previous: 75.2, target: 80 },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{metric.label}</span>
                        <span className="font-bold text-slate-900">{metric.current}%</span>
                      </div>
                      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#e2001a] to-[#ff6f61] transition-all"
                          style={{ width: `${(metric.current / metric.target) * 100}%` }}
                        ></div>
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-slate-300 opacity-50"
                          style={{ width: `${(metric.previous / metric.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                        <span>Vorher: {metric.previous}%</span>
                        <span>Ziel: {metric.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

