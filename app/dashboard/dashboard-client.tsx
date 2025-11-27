"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useDashboard } from "@/hooks/useDashboard";
import { useAppVersion } from "@/hooks/useAppVersion";
import Notifications from "@/components/notifications";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";
import type { Project, Notification as DashboardNotification } from "@/lib/models";
import Link from "next/link";
import {
  Plus,
  BarChart3,
  CheckCircle2,
  Info,
  FolderKanban,
  AlertTriangle,
  Activity,
  ChevronRight,
  TrendingUp,
  Bell,
  BellRing,
  Zap,
  FileText,
  Cpu,
  HardDrive,
  Network,
  CheckCircle,
  XCircle,
} from "lucide-react";

type DashboardClientProps = {
  session: Session;
};

export default function DashboardClient({ session }: DashboardClientProps) {
  const {
    loading,
    stats,
    metrics,
    activities,
    projects,
    alerts,
    notifications,
    unreadCount,
    refresh,
    actions,
  } = useDashboard({ session });

  const { currentVersion, serverVersion } = useAppVersion();

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [pendingNotificationAction, setPendingNotificationAction] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await actions.createProject({
        name: newProjectName,
        description: newProjectDescription || undefined,
        status: "active",
      });
      setNewProjectName("");
      setNewProjectDescription("");
      setShowCreateProject(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Gerade eben";
    if (minutes < 60) return `Vor ${minutes} Minute${minutes > 1 ? "n" : ""}`;
    if (hours < 24) return `Vor ${hours} Stunde${hours > 1 ? "n" : ""}`;
    return `Vor ${days} Tag${days > 1 ? "en" : ""}`;
  };

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "success":
        return <BarChart3 className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const notificationToneMap: Record<
    DashboardNotification["type"],
    {
      label: string;
      accent: string;
      ring: string;
      icon: React.ReactNode;
    }
  > = {
    success: {
      label: "Erfolg",
      accent: "text-emerald-600",
      ring: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    warning: {
      label: "Warnung",
      accent: "text-amber-600",
      ring: "bg-amber-50 text-amber-600 ring-amber-100",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    error: {
      label: "Fehler",
      accent: "text-red-600",
      ring: "bg-red-50 text-red-600 ring-red-100",
      icon: <XCircle className="h-4 w-4" />,
    },
    info: {
      label: "Info",
      accent: "text-blue-600",
      ring: "bg-blue-50 text-blue-600 ring-blue-100",
      icon: <Info className="h-4 w-4" />,
    },
  };

  const handleNotificationAction = async (
    notificationId: string,
    action: "read" | "delete"
  ) => {
    if (!notificationId) return;
    setPendingNotificationAction(`${action}-${notificationId}`);
    try {
      if (action === "read") {
        await fetch(`/api/dashboard/notifications/${notificationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
      } else {
        await fetch(`/api/dashboard/notifications/${notificationId}`, {
          method: "DELETE",
        });
      }
      await refresh.notifications();
    } catch (error) {
      console.error("Failed to update notification:", error);
    } finally {
      setPendingNotificationAction(null);
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      await fetch("/api/dashboard/notifications/read-all", { method: "POST" });
      await refresh.notifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const displayedNotifications = notifications.slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#e2001a]"></div>
          <p className="mt-4 text-sm text-slate-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                      Übersicht
                    </h1>
                    <p className="font-db-screensans mt-1 text-sm text-slate-600">
                      Willkommen zurück
                    </p>
                  </div>
                  {/* Version Badge */}
                  {(currentVersion || serverVersion) && (
                    <div className="ml-4 flex items-center gap-2 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium text-slate-600">Version</span>
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {(serverVersion?.buildId || currentVersion || "—").substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Notifications
                  initialNotifications={notifications.map((n) => ({
                    ...n,
                    createdAt: typeof n.createdAt === "string" ? n.createdAt : n.createdAt.toISOString(),
                  }))}
                  initialUnreadCount={unreadCount}  
                />
              <button
                onClick={() => setShowCreateProject(true)}
                className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
              >
                <Plus className="h-4 w-4" />
                Neues Projekt
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Create Project Sheet */}
        <Sheet
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
          side="right"
          size="md"
        >
          <SheetHeader>
            <SheetTitle>Neues Projekt erstellen</SheetTitle>
            <SheetDescription>
              Erstellen Sie ein neues Projekt für Ihr Dashboard
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreateProject}>
            <SheetContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Projektname *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    placeholder="z.B. Hamburg Hbf Modernisierung"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Beschreibung
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    placeholder="Optionale Beschreibung..."
                    rows={4}
                  />
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                type="button"
                onClick={() => {
                  setShowCreateProject(false);
                  setNewProjectName("");
                  setNewProjectDescription("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Erstellen
              </button>
            </SheetFooter>
          </form>
        </Sheet>

        {/* Project Details Sheet */}
        {selectedProject && (
          <Sheet
            open={showProjectDetails}
            onOpenChange={setShowProjectDetails}
            side="right"
            size="lg"
          >
            <SheetHeader>
              <SheetTitle>{selectedProject.name}</SheetTitle>
              <SheetDescription>
                Projekt-Details und Informationen
              </SheetDescription>
            </SheetHeader>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Beschreibung
                  </label>
                  <p className="mt-2 text-sm text-slate-700">
                    {selectedProject.description || "Keine Beschreibung vorhanden"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Fortschritt
                  </label>
                  <div className="mt-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        {selectedProject.progress}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-[#e2001a] transition-all"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedProject.status === "active"
                          ? "bg-green-100 text-green-700"
                          : selectedProject.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedProject.status === "active"
                        ? "Aktiv"
                        : selectedProject.status === "completed"
                          ? "Abgeschlossen"
                          : selectedProject.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Erstellt am
                    </label>
                    <p className="mt-2 text-sm text-slate-700">
                      {new Date(selectedProject.createdAt).toLocaleDateString(
                        "de-DE",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Zuletzt aktualisiert
                    </label>
                    <p className="mt-2 text-sm text-slate-700">
                      {new Date(selectedProject.updatedAt).toLocaleDateString(
                        "de-DE",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                onClick={() => setShowProjectDetails(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Schließen
              </button>
              <Link
                href={`/dashboard/projects/${selectedProject.id}`}
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Vollständige Ansicht
              </Link>
            </SheetFooter>
          </Sheet>
        )}

        {/* Dashboard Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6 lg:space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:border-[#e2001a]/30 hover:shadow-lg hover:shadow-[#e2001a]/5">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e2001a]/0 to-[#e2001a]/0 transition-all duration-300 group-hover:from-[#e2001a]/5 group-hover:to-transparent"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Aktive Projekte
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                      {stats?.activeProjects || 0}
                    </p>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50">
                        <TrendingUp className="h-3 w-3" />
                        +{projects.filter((p) => p.status === "active").length}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e2001a]/15 to-[#e2001a]/5 ring-1 ring-[#e2001a]/10 transition-transform duration-300 group-hover:scale-110">
                    <FolderKanban className="h-7 w-7 text-[#e2001a]" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-transparent"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Komponenten
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                      {stats?.totalComponents
                        ? (stats.totalComponents / 1000000).toFixed(1) + "M"
                        : "0"}
                    </p>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/50">
                        {stats?.uptime || 0}%
                      </span>
                      <span className="text-xs font-medium text-slate-500">Uptime</span>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100/80 to-blue-50/50 ring-1 ring-blue-200/30 transition-transform duration-300 group-hover:scale-110">
                    <Cpu className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:border-amber-300/50 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 transition-all duration-300 group-hover:from-amber-500/5 group-hover:to-transparent"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Alerts heute
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                      {stats?.alertsToday || 0}
                    </p>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50">
                        <TrendingUp className="h-3 w-3" />
                        {alerts.filter((a) => a.status === "resolved").length}
                      </span>
                      <span className="text-xs font-medium text-slate-500">behoben</span>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-50/50 ring-1 ring-amber-200/30 transition-transform duration-300 group-hover:scale-110">
                    <AlertTriangle className="h-7 w-7 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:border-emerald-300/50 hover:shadow-lg hover:shadow-emerald-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 transition-all duration-300 group-hover:from-emerald-500/5 group-hover:to-transparent"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      System-Status
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-emerald-600">
                      {stats?.systemStatus === "online" ? "Online" : "Offline"}
                    </p>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
                        <span className="text-xs font-medium text-slate-500">
                          Alle Systeme operativ
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100/80 to-emerald-50/50 ring-1 ring-emerald-200/30 transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-8 space-y-6">
                {/* Recent Activity */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-db-screenhead text-xl font-bold text-slate-900">
                          Letzte Aktivitäten
                        </h2>
                        <p className="mt-1.5 text-xs font-medium text-slate-500">
                          Echtzeit-Updates aus allen Systemen
                        </p>
                      </div>
                      <Link
                        href="/dashboard/activities"
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#e2001a] transition hover:bg-[#e2001a]/5"
                      >
                        Alle anzeigen
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100/60">
                    {activities.length === 0 ? (
                      <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Activity className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          Keine Aktivitäten vorhanden
                        </p>
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="group flex items-start gap-4 px-6 py-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-white"
                        >
                          <div
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-all duration-200 group-hover:scale-110 ${
                              activity.status === "success"
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-200/50"
                                : activity.status === "info"
                                  ? "bg-blue-50 text-blue-600 ring-blue-200/50"
                                  : "bg-amber-50 text-amber-600 ring-amber-200/50"
                            }`}
                          >
                            {getActivityIcon(activity.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                              {activity.action}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">{activity.system}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-medium">
                                {formatTime(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100">
                            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-5">
                    <div>
                      <h2 className="font-db-screenhead text-xl font-bold text-slate-900">
                        Performance-Übersicht
                      </h2>
                      <p className="mt-1.5 text-xs font-medium text-slate-500">
                        Systemleistung der letzten 24 Stunden
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="group">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">
                              CPU-Auslastung
                            </span>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-900">
                            {metrics?.cpu || 0}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#e2001a] to-[#e2001a]/80 transition-all duration-500"
                            style={{ width: `${metrics?.cpu || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="group">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">
                              Speicher
                            </span>
                          </div>
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700">
                            {metrics?.memory || 0}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                            style={{ width: `${metrics?.memory || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="group">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Network className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">
                              Netzwerk
                            </span>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-700">
                            {metrics?.network || 0}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500"
                            style={{ width: `${metrics?.network || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="group">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">
                              Storage
                            </span>
                          </div>
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700">
                            {metrics?.storage || 0}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                            style={{ width: `${metrics?.storage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="lg:col-span-4 space-y-6">
                {/* Quick Actions */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-5">
                    <h3 className="font-db-screenhead text-lg font-bold text-slate-900">
                      Schnellzugriff
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setShowCreateProject(true)}
                        className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-[#e2001a]/40 hover:bg-gradient-to-r hover:from-[#e2001a]/5 hover:to-transparent hover:text-[#e2001a] hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e2001a]/15 to-[#e2001a]/5 ring-1 ring-[#e2001a]/10 transition-transform duration-200 group-hover:scale-110">
                            <Plus className="h-4 w-4 text-[#e2001a]" />
                          </div>
                          <span>Neues Projekt</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#e2001a]" />
                      </button>
                      <Link
                        href="/dashboard/telemetry"
                        className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-blue-300/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100/80 to-blue-50/50 ring-1 ring-blue-200/30 transition-transform duration-200 group-hover:scale-110">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span>Telemetrie anzeigen</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/dashboard/reports"
                        className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-300/50 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100/80 to-emerald-50/50 ring-1 ring-emerald-200/30 transition-transform duration-200 group-hover:scale-110">
                            <FileText className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span>Reports generieren</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* System Status Widget */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-emerald-50/30 via-white to-slate-50/30 p-6 shadow-sm ring-1 ring-emerald-100/50">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100/80 to-emerald-50/50 ring-1 ring-emerald-200/30">
                      <Zap className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        System bereit
                      </p>
                      <p className="text-xs font-medium text-slate-500">Alle Services online</p>
                    </div>
                  </div>
                  <div className="space-y-3.5 border-t border-slate-200/60 pt-5">
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5 ring-1 ring-slate-200/50">
                      <span className="text-xs font-semibold text-slate-600">API-Status</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-emerald-200"></span>
                        <span className="text-xs font-bold text-emerald-600">Online</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5 ring-1 ring-slate-200/50">
                      <span className="text-xs font-semibold text-slate-600">Datenbank</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-emerald-200"></span>
                        <span className="text-xs font-bold text-emerald-600">Verbunden</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5 ring-1 ring-slate-200/50">
                      <span className="text-xs font-semibold text-slate-600">Cache</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-emerald-200"></span>
                        <span className="text-xs font-bold text-emerald-600">Aktiv</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Projects */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-5">
                    <h3 className="font-db-screenhead text-lg font-bold text-slate-900">
                      Aktuelle Projekte
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {projects.length === 0 ? (
                        <div className="py-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <FolderKanban className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="mt-4 text-sm font-medium text-slate-500">
                            Noch keine Projekte
                          </p>
                        </div>
                      ) : (
                        projects.slice(0, 3).map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project);
                              setShowProjectDetails(true);
                            }}
                            className="group block w-full rounded-xl border border-slate-200/60 bg-white p-4 text-left transition-all duration-200 hover:border-[#e2001a]/40 hover:bg-gradient-to-r hover:from-[#e2001a]/5 hover:to-transparent hover:shadow-sm"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-900">
                                {project.name}
                              </p>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200/50">
                                {project.progress}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#e2001a] to-[#e2001a]/80 transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </SessionProvider>
  );
}

