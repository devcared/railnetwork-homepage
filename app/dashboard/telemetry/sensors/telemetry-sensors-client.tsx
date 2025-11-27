"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import {
  Cpu,
  Wifi,
  Radio,
  Thermometer,
  Gauge,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  Search,
  Filter,
} from "lucide-react";

type TelemetrySensorsClientProps = {
  session: Session;
};

type Sensor = {
  id: string;
  name: string;
  type: "temperature" | "pressure" | "vibration" | "signal" | "energy";
  location: string;
  value: number;
  unit: string;
  status: "online" | "offline" | "warning" | "error";
  lastUpdate: string;
  battery?: number;
  signal?: number;
};

const mockSensors: Sensor[] = [
  {
    id: "1",
    name: "Temperatursensor Gleis 5",
    type: "temperature",
    location: "Hamburg Hbf, Gleis 5",
    value: 18.5,
    unit: "°C",
    status: "online",
    lastUpdate: "Vor 2 Minuten",
    battery: 87,
    signal: 95,
  },
  {
    id: "2",
    name: "Drucksensor Weiche 123",
    type: "pressure",
    location: "Hamburg Hbf, Weiche 123",
    value: 4.2,
    unit: "bar",
    status: "warning",
    lastUpdate: "Vor 5 Minuten",
    battery: 45,
    signal: 78,
  },
  {
    id: "3",
    name: "Vibrationssensor Strecke A-B",
    type: "vibration",
    location: "Strecke Hamburg-Berlin, km 45",
    value: 0.8,
    unit: "g",
    status: "online",
    lastUpdate: "Vor 1 Minute",
    battery: 92,
    signal: 88,
  },
  {
    id: "4",
    name: "Energiesensor Trafo 7",
    type: "energy",
    location: "Hamburg Hbf, Trafo-Station 7",
    value: 2450,
    unit: "kW",
    status: "online",
    lastUpdate: "Gerade eben",
    battery: 100,
    signal: 99,
  },
  {
    id: "5",
    name: "Signalsensor Block 12",
    type: "signal",
    location: "Hamburg Hbf, Block 12",
    value: -65,
    unit: "dBm",
    status: "error",
    lastUpdate: "Vor 15 Minuten",
    battery: 12,
    signal: 0,
  },
];

const sensorIcons = {
  temperature: Thermometer,
  pressure: Gauge,
  vibration: Radio,
  signal: Wifi,
  energy: Cpu,
};

const sensorColors = {
  temperature: "from-red-500 to-orange-500",
  pressure: "from-blue-500 to-cyan-500",
  vibration: "from-purple-500 to-pink-500",
  signal: "from-emerald-500 to-teal-500",
  energy: "from-amber-500 to-yellow-500",
};

export default function TelemetrySensorsClient({ session }: TelemetrySensorsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredSensors = mockSensors.filter((sensor) => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sensor.status === statusFilter;
    const matchesType = typeFilter === "all" || sensor.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Sensor["status"]) => {
    switch (status) {
      case "online":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: Sensor["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const onlineCount = mockSensors.filter((s) => s.status === "online").length;
  const warningCount = mockSensors.filter((s) => s.status === "warning").length;
  const errorCount = mockSensors.filter((s) => s.status === "error").length;

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-6 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                    Sensoren & IoT
                  </h1>
                  <p className="font-db-screensans mt-1 text-sm text-slate-600">
                    Sensorstatus & Wartung im Überblick
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
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
            {/* Status-Übersicht */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Online</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-900">{onlineCount}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Warnung</p>
                    <p className="mt-1 text-3xl font-bold text-amber-900">{warningCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Fehler</p>
                    <p className="mt-1 text-3xl font-bold text-red-900">{errorCount}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
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
                    placeholder="Sensor suchen..."
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
                    <option value="online">Online</option>
                    <option value="warning">Warnung</option>
                    <option value="error">Fehler</option>
                    <option value="offline">Offline</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                  >
                    <option value="all">Alle Typen</option>
                    <option value="temperature">Temperatur</option>
                    <option value="pressure">Druck</option>
                    <option value="vibration">Vibration</option>
                    <option value="signal">Signal</option>
                    <option value="energy">Energie</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sensor-Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSensors.map((sensor) => {
                const IconComponent = sensorIcons[sensor.type];
                const colorClass = sensorColors[sensor.type];

                return (
                  <div
                    key={sensor.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} shadow-md`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                          sensor.status
                        )}`}
                      >
                        {getStatusIcon(sensor.status)}
                        {sensor.status === "online"
                          ? "Online"
                          : sensor.status === "warning"
                            ? "Warnung"
                            : sensor.status === "error"
                              ? "Fehler"
                              : "Offline"}
                      </span>
                    </div>

                    {/* Sensor-Info */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{sensor.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>{sensor.location}</span>
                      </div>
                    </div>

                    {/* Wert */}
                    <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-slate-500">Aktueller Wert</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {sensor.value} {sensor.unit}
                        </span>
                      </div>
                    </div>

                    {/* Status-Info */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                      {sensor.battery !== undefined && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Batterie</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${
                                  sensor.battery > 50
                                    ? "bg-emerald-500"
                                    : sensor.battery > 20
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${sensor.battery}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-slate-700">{sensor.battery}%</span>
                          </div>
                        </div>
                      )}
                      {sensor.signal !== undefined && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Signal</span>
                          <span className="font-semibold text-slate-700">{sensor.signal}%</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Letztes Update</span>
                        <span className="font-medium text-slate-700">{sensor.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSensors.length === 0 && (
              <div className="py-16 text-center">
                <Cpu className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-4 text-sm font-medium text-slate-500">Keine Sensoren gefunden</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

