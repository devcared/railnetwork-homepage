"use client";

import { useState, useEffect } from "react";
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
import type { Project } from "@/lib/models";
import Link from "next/link";
import { Edit } from "lucide-react";

type ProjectDetailClientProps = {
  session: Session;
  projectId: string;
};

export default function ProjectDetailClient({
  session,
  projectId,
}: ProjectDetailClientProps) {
  const { projects, actions } = useDashboard({ session });
  const [project, setProject] = useState<Project | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editProgress, setEditProgress] = useState(0);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setEditName(foundProject.name);
      setEditDescription(foundProject.description || "");
      setEditProgress(foundProject.progress);
    }
  }, [projects, projectId]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      await actions.updateProject(project.id, {
        name: editName,
        description: editDescription || undefined,
        progress: editProgress,
      });
      setShowEditSheet(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (!project) {
    return (
      <SessionProvider session={session}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#e2001a]"></div>
            <p className="mt-4 text-sm text-slate-600">Lade Projekt...</p>
          </div>
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="px-6 py-3 lg:px-8">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <button
                onClick={() => setShowEditSheet(true)}
                className="hidden items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 sm:flex"
              >
                <Edit className="h-3.5 w-3.5" />
                Bearbeiten
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-db-screenhead text-lg font-bold text-slate-900">
                    Beschreibung
                  </h2>
                  <p className="mt-3 text-sm text-slate-700">
                    {project.description || "Keine Beschreibung vorhanden"}
                  </p>
                </div>

                {/* Progress */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="font-db-screenhead text-lg font-bold text-slate-900">
                      Fortschritt
                    </h2>
                    <span className="text-2xl font-bold text-slate-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-4 h-4 w-full rounded-full bg-slate-200">
                    <div
                      className="h-4 rounded-full bg-[#e2001a] transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-db-screenhead text-base font-bold text-slate-900">
                    Status
                  </h3>
                  <div className="mt-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-green-100 text-green-700"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {project.status === "active"
                        ? "Aktiv"
                        : project.status === "completed"
                          ? "Abgeschlossen"
                          : project.status}
                    </span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-db-screenhead text-base font-bold text-slate-900">
                    Informationen
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Erstellt am</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {new Date(project.createdAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Zuletzt aktualisiert</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {new Date(project.updatedAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-db-screenhead text-base font-bold text-slate-900">
                    Aktionen
                  </h3>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={async () => {
                        await actions.updateProject(project.id, {
                          progress: Math.min(100, project.progress + 10),
                        });
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Fortschritt +10%
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Möchten Sie dieses Projekt wirklich löschen?")) {
                          await actions.deleteProject(project.id);
                          window.location.href = "/dashboard/projects";
                        }
                      }}
                      className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Projekt löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Project Sheet */}
        <Sheet
          open={showEditSheet}
          onOpenChange={setShowEditSheet}
          side="right"
          size="md"
        >
          <SheetHeader>
            <SheetTitle>Projekt bearbeiten</SheetTitle>
            <SheetDescription>
              Aktualisieren Sie die Projekt-Informationen
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleUpdateProject}>
            <SheetContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Projektname *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Beschreibung
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Fortschritt: {editProgress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => setEditProgress(parseInt(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
                  />
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                type="button"
                onClick={() => setShowEditSheet(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Speichern
              </button>
            </SheetFooter>
          </form>
        </Sheet>
      </div>
    </SessionProvider>
  );
}

