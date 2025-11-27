"use client";

import { useState } from "react";
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
import type { Project } from "@/lib/models";
import Link from "next/link";

type ProjectsClientProps = {
  session: Session;
};

export default function ProjectsClient({ session }: ProjectsClientProps) {
  const { projects, actions } = useDashboard({ session });
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "archived">("all");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

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

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Projekte
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600">
                  Verwalten Sie alle Ihre Projekte
                </p>
              </div>
              <button
                onClick={() => setShowCreateProject(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Neues Projekt
              </button>
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
                { id: "active", label: "Aktiv" },
                { id: "completed", label: "Abgeschlossen" },
                { id: "archived", label: "Archiviert" },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as typeof filter)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    filter === filterOption.id
                      ? "border-[#e2001a] bg-[#e2001a] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {filterOption.label} (
                  {filterOption.id === "all"
                    ? projects.length
                    : projects.filter((p) => p.status === filterOption.id).length}
                  )
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Keine Projekte gefunden
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Erstellen Sie Ihr erstes Projekt
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowProjectDetails(true);
                    }}
                    className="group rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`ml-4 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Fortschritt</span>
                        <span className="font-bold text-slate-900">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-[#e2001a] transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Erstellt:{" "}
                        {new Date(project.createdAt).toLocaleDateString("de-DE")}
                      </span>
                      <svg
                        className="h-4 w-4 opacity-0 transition group-hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <SheetDescription>Projekt-Details und Informationen</SheetDescription>
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
                      {new Date(selectedProject.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Zuletzt aktualisiert
                    </label>
                    <p className="mt-2 text-sm text-slate-700">
                      {new Date(selectedProject.updatedAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
              <button
                onClick={async () => {
                  if (selectedProject) {
                    await actions.updateProject(selectedProject.id, {
                      progress: Math.min(100, selectedProject.progress + 10),
                    });
                  }
                }}
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Fortschritt +10%
              </button>
            </SheetFooter>
          </Sheet>
        )}
      </div>
    </SessionProvider>
  );
}

