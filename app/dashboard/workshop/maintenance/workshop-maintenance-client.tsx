"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import {
  Calendar,
  Clock,
  Wrench,
  AlertCircle,
  CheckCircle2,
  TrainFront,
  Filter,
  Search,
  Plus,
} from "lucide-react";

type WorkshopMaintenanceClientProps = {
  session: Session;
};

type MaintenanceTask = {
  id: string;
  vehicle: string;
  type: "inspection" | "repair" | "overhaul" | "service";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  status: "scheduled" | "in-progress" | "completed" | "overdue";
  assignedTo: string;
  estimatedDuration: number;
  description: string;
};

const mockTasks: MaintenanceTask[] = [
  {
    id: "1",
    vehicle: "ICE 412",
    type: "inspection",
    priority: "high",
    dueDate: "2024-02-15",
    status: "scheduled",
    assignedTo: "Werkstatt A",
    estimatedDuration: 8,
    description: "Jährliche Hauptuntersuchung",
  },
  {
    id: "2",
    vehicle: "RE 1234",
    type: "repair",
    priority: "urgent",
    dueDate: "2024-01-25",
    status: "in-progress",
    assignedTo: "Werkstatt B",
    estimatedDuration: 12,
    description: "Bremsenreparatur",
  },
  {
    id: "3",
    vehicle: "RB 5678",
    type: "service",
    priority: "medium",
    dueDate: "2024-01-20",
    status: "overdue",
    assignedTo: "Werkstatt C",
    estimatedDuration: 4,
    description: "Routine-Wartung",
  },
];

const typeColors = {
  inspection: "bg-blue-100 text-blue-700",
  repair: "bg-red-100 text-red-700",
  overhaul: "bg-purple-100 text-purple-700",
  service: "bg-emerald-100 text-emerald-700",
};

export default function WorkshopMaintenanceClient({ session }: WorkshopMaintenanceClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const overdueCount = mockTasks.filter((t) => t.status === "overdue").length;
  const scheduledCount = mockTasks.filter((t) => t.status === "scheduled").length;
  const inProgressCount = mockTasks.filter((t) => t.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="px-6 py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Wartungstermine
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600">
                  Inspektionen & Fristen verwalten
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden items-center gap-2 rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015] sm:flex">
                <Plus className="h-4 w-4" />
                Termin
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
            <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Überfällig</p>
                  <p className="mt-1 text-3xl font-bold text-red-900">{overdueCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Geplant</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">{scheduledCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">In Bearbeitung</p>
                  <p className="mt-1 text-3xl font-bold text-purple-900">{inProgressCount}</p>
                </div>
                <Wrench className="h-8 w-8 text-purple-600" />
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
                  placeholder="Fahrzeug suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Status</option>
                  <option value="scheduled">Geplant</option>
                  <option value="in-progress">In Bearbeitung</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="overdue">Überfällig</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Typen</option>
                  <option value="inspection">Inspektion</option>
                  <option value="repair">Reparatur</option>
                  <option value="overhaul">Überholung</option>
                  <option value="service">Service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const isOverdue = task.status === "overdue" || (task.status === "scheduled" && new Date(task.dueDate) < new Date());
              
              return (
                <div
                  key={task.id}
                  className={`group overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                    isOverdue
                      ? "border-red-200/60 bg-gradient-to-r from-red-50/50 to-white"
                      : "border-slate-200/60 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
                          <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">{task.vehicle}</h3>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${typeColors[task.type]}`}>
                              {task.type === "inspection"
                                ? "Inspektion"
                                : task.type === "repair"
                                  ? "Reparatur"
                                  : task.type === "overhaul"
                                    ? "Überholung"
                                    : "Service"}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                task.priority === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "high"
                                    ? "bg-orange-100 text-orange-700"
                                    : task.priority === "medium"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {task.priority === "urgent"
                                ? "Dringend"
                                : task.priority === "high"
                                  ? "Hoch"
                                  : task.priority === "medium"
                                    ? "Mittel"
                                    : "Niedrig"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-600">{task.description}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500">Fälligkeitsdatum</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {new Date(task.dueDate).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500">Zugewiesen</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">{task.assignedTo}</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500">Dauer</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">{task.estimatedDuration}h</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                          <p className="text-xs font-medium text-slate-500">Status</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {task.status === "scheduled"
                              ? "Geplant"
                              : task.status === "in-progress"
                                ? "In Bearbeitung"
                                : task.status === "completed"
                                  ? "Abgeschlossen"
                                  : "Überfällig"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-16 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Keine Aufgaben gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

