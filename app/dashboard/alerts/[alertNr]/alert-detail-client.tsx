"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
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
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

type AlertDetailClientProps = {
  session: Session;
  alertId: string;
};

export default function AlertDetailClient({
  session,
  alertId,
}: AlertDetailClientProps) {
  const router = useRouter();
  const { alerts, actions } = useDashboard({ session });
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundAlert = alerts.find((a) => a.id === alertId);
    if (foundAlert) {
      setAlert(foundAlert);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [alerts, alertId]);

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

  const handleAcknowledge = async () => {
    if (!alert) return;
    try {
      await actions.updateAlert(alert.id, { status: "acknowledged" });
      router.refresh();
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const handleResolve = async () => {
    if (!alert) return;
    try {
      await actions.updateAlert(alert.id, { status: "resolved" });
      router.refresh();
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  const handleDelete = async () => {
    if (!alert) return;
    if (confirm("Möchten Sie diesen Alert wirklich löschen?")) {
      try {
        await actions.deleteAlert(alert.id);
        router.push("/dashboard/alerts");
      } catch (error) {
        console.error("Failed to delete alert:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <SessionProvider session={session}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e2001a]"></div>
            <p className="mt-4 text-sm text-slate-600">Alert wird geladen...</p>
          </div>
        </div>
      </SessionProvider>
    );
  }

  if (!alert) {
    return (
      <SessionProvider session={session}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-slate-400" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">Alert nicht gefunden</h2>
            <p className="mt-2 text-sm text-slate-600">
              Der angeforderte Alert existiert nicht oder Sie haben keinen Zugriff darauf.
            </p>
            <Link
              href="/dashboard/alerts"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zu Alerts
            </Link>
          </div>
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/alerts"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                    {alert.title}
                  </h1>
                  <p className="font-db-screensans mt-1 text-sm text-slate-600">
                    Alert-Details und Aktionen
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEditSheet(true)}
                  className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
                >
                  <Edit className="h-4 w-4" />
                  Bearbeiten
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Alert Message */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        alert.severity === "critical" || alert.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-900">Nachricht</h2>
                      <p className="mt-1 text-sm text-slate-500">Vollständige Alert-Beschreibung</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{alert.message}</p>
                </div>

                {/* Timeline */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Zeitverlauf</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <Clock className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">Alert erstellt</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(alert.createdAt).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {alert.status === "acknowledged" && (
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                          <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">Alert bestätigt</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Status: Bestätigt
                          </p>
                        </div>
                      </div>
                    )}
                    {alert.resolvedAt && (
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">Alert behoben</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(alert.resolvedAt).toLocaleString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500">Schweregrad</label>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {getSeverityLabel(alert.severity)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Aktueller Status</label>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            alert.status
                          )}`}
                        >
                          {getStatusLabel(alert.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Systeminformationen
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500">System</label>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{alert.system}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">Alert-ID</label>
                      <p className="mt-1 text-sm font-mono text-slate-600">{alert.id}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Aktionen
                  </h3>
                  <div className="space-y-3">
                    {alert.status === "open" && (
                      <button
                        onClick={handleAcknowledge}
                        className="w-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Bestätigen
                        </div>
                      </button>
                    )}
                    {alert.status !== "resolved" && (
                      <button
                        onClick={handleResolve}
                        className="w-full rounded-lg bg-[#e2001a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c10015]"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Als behoben markieren
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Sheet */}
        <Sheet open={showEditSheet} onOpenChange={setShowEditSheet} side="right" size="md">
          <SheetHeader>
            <SheetTitle>Alert bearbeiten</SheetTitle>
            <SheetDescription>Alert-Informationen aktualisieren</SheetDescription>
          </SheetHeader>
          <SheetContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Bearbeitungsformular wird hier angezeigt...
              </p>
            </div>
          </SheetContent>
          <SheetFooter>
            <button
              onClick={() => setShowEditSheet(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]">
              Speichern
            </button>
          </SheetFooter>
        </Sheet>
      </div>
    </SessionProvider>
  );
}

