"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import {
  Truck,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

type InventorySuppliersClientProps = {
  session: Session;
};

type Supplier = {
  id: string;
  name: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  activeOrders: number;
  totalDeliveries: number;
  averageDeliveryTime: number;
  status: "active" | "inactive" | "preferred";
  lastDelivery?: string;
  nextDelivery?: string;
};

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Holzwerke Nord",
    category: "Gleisbau",
    location: "Hamburg, Deutschland",
    phone: "+49 40 123456",
    email: "info@holzwerke-nord.de",
    rating: 4.8,
    activeOrders: 2,
    totalDeliveries: 145,
    averageDeliveryTime: 5,
    status: "preferred",
    lastDelivery: "2024-01-20",
    nextDelivery: "2024-01-28",
  },
  {
    id: "2",
    name: "Signal AG",
    category: "Signaltechnik",
    location: "Berlin, Deutschland",
    phone: "+49 30 789012",
    email: "kontakt@signal-ag.de",
    rating: 4.6,
    activeOrders: 1,
    totalDeliveries: 89,
    averageDeliveryTime: 7,
    status: "active",
    lastDelivery: "2024-01-15",
    nextDelivery: "2024-02-05",
  },
  {
    id: "3",
    name: "Steinbruch Süd",
    category: "Gleisbau",
    location: "München, Deutschland",
    phone: "+49 89 345678",
    email: "info@steinbruch-sued.de",
    rating: 4.2,
    activeOrders: 1,
    totalDeliveries: 67,
    averageDeliveryTime: 10,
    status: "active",
    lastDelivery: "2024-01-10",
    nextDelivery: "2024-02-10",
  },
];

export default function InventorySuppliersClient({ session }: InventorySuppliersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Supplier["status"]) => {
    switch (status) {
      case "preferred":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Lieferstatus
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600">
                  Lieferanten & ETA im Überblick
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lieferant suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
              >
                <option value="all">Alle Kategorien</option>
                <option value="Gleisbau">Gleisbau</option>
                <option value="Signaltechnik">Signaltechnik</option>
              </select>
            </div>
          </div>

          {/* Suppliers Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{supplier.name}</h3>
                      {supplier.status === "preferred" && (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600">{supplier.category}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                      supplier.status
                    )}`}
                  >
                    {supplier.status === "preferred"
                      ? "Bevorzugt"
                      : supplier.status === "active"
                        ? "Aktiv"
                        : "Inaktiv"}
                  </span>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(supplier.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{supplier.rating}</span>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{supplier.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-xs font-medium text-slate-500">Aktive Bestellungen</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{supplier.activeOrders}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-xs font-medium text-slate-500">Lieferungen</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{supplier.totalDeliveries}</p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 space-y-2 rounded-lg border border-slate-100 bg-blue-50/50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Ø Lieferzeit</span>
                    <span className="font-semibold text-slate-900">{supplier.averageDeliveryTime} Tage</span>
                  </div>
                  {supplier.nextDelivery && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Nächste Lieferung</span>
                      <span className="font-semibold text-blue-700">
                        {new Date(supplier.nextDelivery).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="py-16 text-center">
              <Truck className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Keine Lieferanten gefunden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

