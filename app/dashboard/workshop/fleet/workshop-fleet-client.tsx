"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import {
  Truck,
  TrainFront,
  MapPin,
  Gauge,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Filter,
  Plus,
} from "lucide-react";

type WorkshopFleetClientProps = {
  session: Session;
};

type Vehicle = {
  id: string;
  number: string;
  type: "ICE" | "RE" | "RB" | "IC";
  status: "in-service" | "maintenance" | "repair" | "reserve";
  location: string;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  utilization: number;
  health: "excellent" | "good" | "fair" | "poor";
};

const mockFleet: Vehicle[] = [
  {
    id: "1",
    number: "ICE 412",
    type: "ICE",
    status: "in-service",
    location: "Hamburg Hbf",
    mileage: 245000,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    utilization: 92,
    health: "excellent",
  },
  {
    id: "2",
    number: "RE 1234",
    type: "RE",
    status: "maintenance",
    location: "Werkstatt A",
    mileage: 189000,
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-01-28",
    utilization: 78,
    health: "good",
  },
  {
    id: "3",
    number: "RB 5678",
    type: "RB",
    status: "repair",
    location: "Werkstatt B",
    mileage: 156000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    utilization: 65,
    health: "fair",
  },
];

const typeColors = {
  ICE: "from-[#e2001a] to-[#ff6f61]",
  RE: "from-blue-500 to-cyan-500",
  RB: "from-emerald-500 to-teal-500",
  IC: "from-purple-500 to-pink-500",
};

const healthColors = {
  excellent: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-amber-100 text-amber-700",
  poor: "bg-red-100 text-red-700",
};

export default function WorkshopFleetClient({ session }: WorkshopFleetClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredFleet = mockFleet.filter((vehicle) => {
    const matchesSearch = vehicle.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const inServiceCount = mockFleet.filter((v) => v.status === "in-service").length;
  const maintenanceCount = mockFleet.filter((v) => v.status === "maintenance").length;
  const averageHealth = mockFleet.reduce((sum, v) => {
    const healthValue = v.health === "excellent" ? 4 : v.health === "good" ? 3 : v.health === "fair" ? 2 : 1;
    return sum + healthValue;
  }, 0) / mockFleet.length;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Fuhrpark
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Fahrzeuge & Status im Überblick
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex">
                <Plus className="h-4 w-4" />
                Fahrzeug
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
            <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Im Einsatz</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-900">{inServiceCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">In Wartung</p>
                  <p className="mt-1 text-3xl font-bold text-amber-900">{maintenanceCount}</p>
                </div>
                <Wrench className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-blue-200/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Ø Zustand</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">
                    {averageHealth.toFixed(1)}/4
                  </p>
                </div>
                <Gauge className="h-8 w-8 text-blue-600" />
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
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Status</option>
                  <option value="in-service">Im Einsatz</option>
                  <option value="maintenance">Wartung</option>
                  <option value="repair">Reparatur</option>
                  <option value="reserve">Reserve</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Typen</option>
                  <option value="ICE">ICE</option>
                  <option value="RE">RE</option>
                  <option value="RB">RB</option>
                  <option value="IC">IC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fleet Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFleet.map((vehicle) => {
              const typeColor = typeColors[vehicle.type];

              return (
                <div
                  key={vehicle.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md">
                      <TrainFront className="h-7 w-7 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        vehicle.status === "in-service"
                          ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : vehicle.status === "maintenance"
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                            : vehicle.status === "repair"
                              ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {vehicle.status === "in-service"
                        ? "Im Einsatz"
                        : vehicle.status === "maintenance"
                          ? "Wartung"
                          : vehicle.status === "repair"
                            ? "Reparatur"
                            : "Reserve"}
                    </span>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{vehicle.number}</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{vehicle.type}</p>
                  </div>

                  {/* Health Status */}
                  <div className="mb-4 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Zustand</span>
                      <span className={`font-semibold ${healthColors[vehicle.health]}`}>
                        {vehicle.health === "excellent"
                          ? "Ausgezeichnet"
                          : vehicle.health === "good"
                            ? "Gut"
                            : vehicle.health === "fair"
                              ? "Befriedigend"
                              : "Schlecht"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full ${
                          vehicle.health === "excellent"
                            ? "bg-emerald-500"
                            : vehicle.health === "good"
                              ? "bg-blue-500"
                              : vehicle.health === "fair"
                                ? "bg-amber-500"
                                : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            vehicle.health === "excellent"
                              ? 100
                              : vehicle.health === "good"
                                ? 75
                                : vehicle.health === "fair"
                                  ? 50
                                  : 25
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Kilometerstand</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {vehicle.mileage.toLocaleString("de-DE")} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Auslastung</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{vehicle.utilization}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>
                        Nächste Wartung: {new Date(vehicle.nextMaintenance).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFleet.length === 0 && (
            <div className="py-16 text-center">
              <Truck className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Keine Fahrzeuge gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

