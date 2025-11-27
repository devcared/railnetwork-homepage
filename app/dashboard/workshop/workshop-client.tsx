"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  Wrench,
  Calendar,
  Truck,
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

type WorkshopClientProps = {
  session: Session;
};

type MaintenanceTask = {
  id: string;
  vehicle: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "overdue";
  dueDate: string;
  assignedTo?: string;
  description?: string;
};

const mockTasks: MaintenanceTask[] = [
  {
    id: "1",
    vehicle: "ICE 412",
    type: "Hauptuntersuchung",
    status: "scheduled",
    dueDate: "2024-02-15",
    assignedTo: "Werkstatt A",
    description: "Jährliche Hauptuntersuchung",
  },
  {
    id: "2",
    vehicle: "RE 1234",
    type: "Wartung",
    status: "in-progress",
    dueDate: "2024-01-25",
    assignedTo: "Werkstatt B",
    description: "Routine-Wartung",
  },
  {
    id: "3",
    vehicle: "RB 5678",
    type: "Reparatur",
    status: "overdue",
    dueDate: "2024-01-20",
    assignedTo: "Werkstatt C",
    description: "Bremsenreparatur",
  },
];

const viewConfigs = {
  default: {
    title: "Werkstattplaner",
    description: "Kapazitäten & Schichten",
    icon: Calendar,
  },
  fleet: {
    title: "Fuhrpark",
    description: "Fahrzeuge & Status",
    icon: Truck,
  },
  maintenance: {
    title: "Wartungstermine",
    description: "Inspektionen & Fristen",
    icon: Settings,
  },
};

export default function WorkshopClient({ session }: WorkshopClientProps) {
  const pathname = usePathname();
  const view = pathname.split("/").pop() || "default";
  const config = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateTask, setShowCreateTask] = useState(false);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <div className="px-6 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <Breadcrumbs />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateTask(true)}
                className="hidden items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 sm:flex"
              >
                <Plus className="h-3.5 w-3.5" />
                Aufgabe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Fahrzeug suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Status</option>
                  <option value="scheduled">Geplant</option>
                  <option value="in-progress">In Bearbeitung</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="overdue">Überfällig</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{task.vehicle}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status === "scheduled"
                          ? "Geplant"
                          : task.status === "in-progress"
                            ? "In Bearbeitung"
                            : task.status === "completed"
                              ? "Abgeschlossen"
                              : "Überfällig"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{task.type}</p>
                    {task.description && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Fällig: {new Date(task.dueDate).toLocaleDateString("de-DE")}</span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-1.5">
                          <Wrench className="h-4 w-4" />
                          <span>{task.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-16 text-center">
              <Wrench className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Keine Aufgaben gefunden</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Sheet */}
      <Sheet open={showCreateTask} onOpenChange={setShowCreateTask} side="right" size="md">
        <SheetHeader>
          <SheetTitle>Neue Aufgabe</SheetTitle>
          <SheetDescription>Wartungsaufgabe anlegen</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Aufgabenformular wird hier angezeigt...</p>
          </div>
        </SheetContent>
        <SheetFooter>
          <button
            onClick={() => setShowCreateTask(false)}
            className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Abbrechen
          </button>
          <button className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]">
            Anlegen
          </button>
        </SheetFooter>
      </Sheet>
    </div>
  );
}

