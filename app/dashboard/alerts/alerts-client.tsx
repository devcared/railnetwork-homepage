"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import { useDashboard } from "@/hooks/useDashboard";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";
import type { Alert } from "@/lib/models";
import {
  AlertTriangle,
  Settings,
  History,
  Plus,
  Search,
  Filter,
} from "lucide-react";

type AlertsClientProps = {
  session: Session;
};

const viewConfigs = {
  default: {
    title: "Aktive Meldungen",
    description: "Offene Störungen",
    icon: AlertTriangle,
  },
  rules: {
    title: "Regelwerk",
    description: "Automatisierungen",
    icon: Settings,
  },
  history: {
    title: "Historie",
    description: "Vergangene Fälle",
    icon: History,
  },
};

export default function AlertsClient({ session }: AlertsClientProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "default";
  const config = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  const { alerts, actions } = useDashboard({ session });
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "acknowledged" | "resolved">("all");

  // Filter alerts based on view
  let displayAlerts = alerts;
  if (view === "history") {
    displayAlerts = alerts.filter((a) => a.status === "resolved");
  } else if (view === "rules") {
    // For rules view, we'd show alert rules instead of alerts
    displayAlerts = [];
  } else {
    // Default view: show active alerts
    displayAlerts = alerts.filter((a) => a.status !== "resolved");
  }

  const filteredAlerts =
    filter === "all"
      ? displayAlerts
      : displayAlerts.filter((a) => a.status === filter);

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getSeverityLabel = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "Kritisch";
      case "high":
        return "Hoch";
      case "medium":
        return "Mittel";
      default:
        return "Niedrig";
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700";
      case "acknowledged":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusLabel = (status: Alert["status"]) => {
    switch (status) {
      case "open":
        return "Offen";
      case "acknowledged":
        return "Bestätigt";
      default:
        return "Behoben";
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="px-6 py-3 lg:px-8">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Filters */}
            <div className="mb-6 flex gap-2">
              {[
                { id: "all", label: "Alle" },
                { id: "open", label: "Offen" },
                { id: "acknowledged", label: "Bestätigt" },
                { id: "resolved", label: "Behoben" },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as typeof filter)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    filter === filterOption.id
                      ? "border-[#e2001a] bg-[#e2001a] text-white"
                      : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {filterOption.label} (
                  {filterOption.id === "all"
                    ? alerts.length
                    : alerts.filter((a) => a.status === filterOption.id).length}
                  )
                </button>
              ))}
            </div>

            {/* Rules View */}
            {view === "rules" && (
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
                <Settings className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Alert-Regelwerk
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Hier können Sie automatische Alert-Regeln verwalten
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]">
                  <Plus className="h-4 w-4" />
                  Neue Regel
                </button>
              </div>
            )}

            {/* Alerts List */}
            {view !== "rules" && (
              <>
                {filteredAlerts.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
                    <AlertTriangle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                    <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Keine Alerts gefunden
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/dashboard/alerts/${alert.id}`}
                    className="group block w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                  alert.severity === "critical" || alert.severity === "high"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  {alert.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                  {alert.message}
                                </p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="font-medium">{alert.system}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(alert.createdAt).toLocaleDateString("de-DE", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {getSeverityLabel(alert.severity)}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                                alert.status
                              )}`}
                            >
                              {getStatusLabel(alert.status)}
                            </span>
                      </div>
                    </div>
                  </Link>
                ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Alert Details Sheet */}
        {selectedAlert && (
          <Sheet
            open={showAlertDetails}
            onOpenChange={setShowAlertDetails}
            side="right"
            size="lg"
          >
            <SheetHeader>
              <SheetTitle>{selectedAlert.title}</SheetTitle>
              <SheetDescription>Alert-Details und Aktionen</SheetDescription>
            </SheetHeader>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Nachricht
                  </label>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{selectedAlert.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      System
                    </label>
                    <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {selectedAlert.system}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Schweregrad
                    </label>
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSeverityColor(
                          selectedAlert.severity
                        )}`}
                      >
                        {getSeverityLabel(selectedAlert.severity)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                        selectedAlert.status
                      )}`}
                    >
                      {getStatusLabel(selectedAlert.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Erstellt am
                    </label>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {new Date(selectedAlert.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {selectedAlert.resolvedAt && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Behoben am
                      </label>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {new Date(selectedAlert.resolvedAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                onClick={() => setShowAlertDetails(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Schließen
              </button>
              {selectedAlert.status === "open" && (
                <button
                  onClick={async () => {
                    if (selectedAlert) {
                      await actions.updateAlert(selectedAlert.id, {
                        status: "acknowledged",
                      });
                      setShowAlertDetails(false);
                    }
                  }}
                  className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
                >
                  Bestätigen
                </button>
              )}
              {selectedAlert.status !== "resolved" && (
                <button
                  onClick={async () => {
                    if (selectedAlert) {
                      await actions.updateAlert(selectedAlert.id, {
                        status: "resolved",
                      });
                      setShowAlertDetails(false);
                    }
                  }}
                  className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Als behoben markieren
                </button>
              )}
            </SheetFooter>
          </Sheet>
        )}
      </div>
    </SessionProvider>
  );
}

