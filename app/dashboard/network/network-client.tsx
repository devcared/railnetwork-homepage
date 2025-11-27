"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import {
  Map,
  MapPin,
  Construction,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  XCircle,
} from "lucide-react";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

type NetworkClientProps = {
  session: Session;
};

type InfrastructureItem = {
  id: string;
  name: string;
  type: "track" | "construction" | "closure";
  status: "active" | "planned" | "closed";
  location: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

const mockInfrastructure: InfrastructureItem[] = [
  {
    id: "1",
    name: "Gleisabschnitt A-B",
    type: "track",
    status: "active",
    location: "Strecke Hamburg-Berlin, km 45-52",
    description: "Hauptstrecke, 2 Gleise",
  },
  {
    id: "2",
    name: "Weiche 123",
    type: "track",
    status: "active",
    location: "Bahnhof Hamburg Hbf",
    description: "Einfahrweiche Gleis 5",
  },
  {
    id: "3",
    name: "Gleiserneuerung",
    type: "construction",
    status: "planned",
    location: "Strecke München-Nürnberg, km 120-125",
    description: "Vollständige Gleiserneuerung",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
  },
  {
    id: "4",
    name: "Temporäre Sperrung",
    type: "closure",
    status: "closed",
    location: "Strecke Köln-Frankfurt, km 80-82",
    description: "Notfallreparatur",
    startDate: "2024-01-25",
    endDate: "2024-01-28",
  },
];

const viewConfigs = {
  default: {
    title: "Gleisplan",
    description: "Trassen & Weichen",
    icon: MapPin,
  },
  construction: {
    title: "Baustellen",
    description: "Aktive Maßnahmen",
    icon: Construction,
  },
  closures: {
    title: "Sperrungen",
    description: "Temporäre Einschränkungen",
    icon: XCircle,
  },
};

export default function NetworkClient({ session }: NetworkClientProps) {
  const pathname = usePathname();
  const view = pathname.split("/").pop() || "default";
  const config = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateItem, setShowCreateItem] = useState(false);

  const filteredItems = mockInfrastructure.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: InfrastructureItem["type"]) => {
    switch (type) {
      case "track":
        return "bg-blue-100 text-blue-700";
      case "construction":
        return "bg-amber-100 text-amber-700";
      case "closure":
        return "bg-red-100 text-red-700";
    }
  };

  const getStatusColor = (status: InfrastructureItem["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "planned":
        return "bg-slate-100 text-slate-700";
      case "closed":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                {config.title}
              </h1>
              <p className="font-db-screensans mt-1 text-sm text-slate-600">
                {config.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateItem(true)}
                className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
              >
                <Plus className="h-4 w-4" />
                Eintrag
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
                  placeholder="Infrastruktur suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Typen</option>
                  <option value="track">Gleis/Weiche</option>
                  <option value="construction">Baustelle</option>
                  <option value="closure">Sperrung</option>
                </select>
              </div>
            </div>
          </div>

          {/* Infrastructure Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type === "track"
                          ? "Gleis"
                          : item.type === "construction"
                            ? "Baustelle"
                            : "Sperrung"}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === "active"
                          ? "Aktiv"
                          : item.status === "planned"
                            ? "Geplant"
                            : "Gesperrt"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="text-slate-600">{item.location}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-500">{item.description}</p>
                  )}
                  {(item.startDate || item.endDate) && (
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <Calendar className="h-4 w-4" />
                      {item.startDate && (
                        <span>
                          {new Date(item.startDate).toLocaleDateString("de-DE")}
                          {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("de-DE")}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center">
              <Map className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Keine Einträge gefunden</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Item Sheet */}
      <Sheet open={showCreateItem} onOpenChange={setShowCreateItem} side="right" size="md">
        <SheetHeader>
          <SheetTitle>Neuer Eintrag</SheetTitle>
          <SheetDescription>Infrastruktur-Eintrag anlegen</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Eintragsformular wird hier angezeigt...</p>
          </div>
        </SheetContent>
        <SheetFooter>
          <button
            onClick={() => setShowCreateItem(false)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

