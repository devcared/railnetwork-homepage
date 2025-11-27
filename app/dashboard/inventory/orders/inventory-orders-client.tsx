"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

type InventoryOrdersClientProps = {
  session: Session;
};

type Order = {
  id: string;
  orderNumber: string;
  supplier: string;
  items: Array<{ name: string; quantity: number; unit: string }>;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  priority: "low" | "medium" | "high" | "urgent";
};

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    supplier: "Holzwerke Nord",
    items: [
      { name: "Schwellen (Eiche)", quantity: 500, unit: "Stück" },
      { name: "Schwellen (Beton)", quantity: 200, unit: "Stück" },
    ],
    status: "shipped",
    orderDate: "2024-01-20",
    expectedDelivery: "2024-01-28",
    totalAmount: 125000,
    priority: "high",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    supplier: "Signal AG",
    items: [{ name: "Weichenantrieb", quantity: 25, unit: "Stück" }],
    status: "confirmed",
    orderDate: "2024-01-25",
    expectedDelivery: "2024-02-05",
    totalAmount: 45000,
    priority: "medium",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    supplier: "Steinbruch Süd",
    items: [{ name: "Schotter (Granit)", quantity: 5000, unit: "t" }],
    status: "pending",
    orderDate: "2024-01-27",
    expectedDelivery: "2024-02-10",
    totalAmount: 85000,
    priority: "urgent",
  },
];

const statusConfig = {
  pending: { label: "Ausstehend", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Bestätigt", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  shipped: { label: "Versendet", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Geliefert", color: "bg-emerald-100 text-emerald-700", icon: Package },
  cancelled: { label: "Storniert", color: "bg-red-100 text-red-700", icon: XCircle },
};

const priorityConfig = {
  low: { label: "Niedrig", color: "bg-slate-100 text-slate-700" },
  medium: { label: "Mittel", color: "bg-blue-100 text-blue-700" },
  high: { label: "Hoch", color: "bg-amber-100 text-amber-700" },
  urgent: { label: "Dringend", color: "bg-red-100 text-red-700" },
};

export default function InventoryOrdersClient({ session }: InventoryOrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockOrders.filter((o) => o.status === "pending").length;
  const shippedCount = mockOrders.filter((o) => o.status === "shipped").length;
  const totalValue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="px-6 py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-db-screenhead text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  Bestellungen
                </h1>
                <p className="font-db-screensans mt-1 text-sm text-slate-600">
                  Offene Aufträge und Lieferstatus
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateOrder(true)}
                className="hidden items-center gap-2 rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015] sm:flex"
              >
                <Plus className="h-4 w-4" />
                Neue Bestellung
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Ausstehend</p>
                  <p className="mt-1 text-3xl font-bold text-amber-900">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Versendet</p>
                  <p className="mt-1 text-3xl font-bold text-purple-900">{shippedCount}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Gesamtwert</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-900">
                    {(totalValue / 1000).toFixed(0)}k €
                  </p>
                </div>
                <Package className="h-8 w-8 text-emerald-600" />
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
                  placeholder="Bestellung suchen..."
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
                  <option value="pending">Ausstehend</option>
                  <option value="confirmed">Bestätigt</option>
                  <option value="shipped">Versendet</option>
                  <option value="delivered">Geliefert</option>
                  <option value="cancelled">Storniert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const priorityInfo = priorityConfig[order.priority];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                          <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">{order.orderNumber}</h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityInfo.color}`}
                            >
                              {priorityInfo.label}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-600">{order.supplier}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Artikel
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{item.name}</span>
                              <span className="font-semibold text-slate-900">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>Bestellt: {new Date(order.orderDate).toLocaleDateString("de-DE")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Truck className="h-4 w-4" />
                          <span>Erwartet: {new Date(order.expectedDelivery).toLocaleDateString("de-DE")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Amount */}
                    <div className="ml-6 text-right">
                      <p className="text-xs font-medium text-slate-500">Gesamtbetrag</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {order.totalAmount.toLocaleString("de-DE")} €
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-16 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Keine Bestellungen gefunden</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Order Sheet */}
      <Sheet open={showCreateOrder} onOpenChange={setShowCreateOrder} side="right" size="md">
        <SheetHeader>
          <SheetTitle>Neue Bestellung</SheetTitle>
          <SheetDescription>Materialbestellung anlegen</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Bestellformular wird hier angezeigt...</p>
          </div>
        </SheetContent>
        <SheetFooter>
          <button
            onClick={() => setShowCreateOrder(false)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Abbrechen
          </button>
          <button className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]">
            Bestellen
          </button>
        </SheetFooter>
      </Sheet>
    </div>
  );
}

