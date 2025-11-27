"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import {
  Warehouse,
  Package,
  ShoppingCart,
  Truck,
  Plus,
  Search,
  Filter,
  Download,
  ChevronRight,
} from "lucide-react";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

type InventoryClientProps = {
  session: Session;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  supplier?: string;
  lastRestocked?: string;
};

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Schwellen (Eiche)",
    category: "Gleisbau",
    quantity: 1250,
    unit: "Stück",
    minStock: 500,
    location: "Lager A, Regal 12",
    supplier: "Holzwerke Nord",
    lastRestocked: "2024-01-15",
  },
  {
    id: "2",
    name: "Schotter (Granit)",
    category: "Gleisbau",
    quantity: 8500,
    unit: "t",
    minStock: 3000,
    location: "Außenlager",
    supplier: "Steinbruch Süd",
    lastRestocked: "2024-01-10",
  },
  {
    id: "3",
    name: "Weichenantrieb",
    category: "Signaltechnik",
    quantity: 45,
    unit: "Stück",
    minStock: 20,
    location: "Lager B, Regal 5",
    supplier: "Signal AG",
    lastRestocked: "2024-01-20",
  },
];

const viewConfigs = {
  default: {
    title: "Materialübersicht",
    description: "Bestände & Reserven",
    icon: Package,
  },
  orders: {
    title: "Bestellungen",
    description: "Offene Aufträge",
    icon: ShoppingCart,
  },
  suppliers: {
    title: "Lieferstatus",
    description: "Lieferanten & ETA",
    icon: Truck,
  },
};

export default function InventoryClient({ session }: InventoryClientProps) {
  const pathname = usePathname();
  const view = pathname.split("/").pop() || "default";
  const config = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const filteredItems = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockInventory.map((item) => item.category)));

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
                onClick={() => setShowCreateOrder(true)}
                className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
              >
                <Plus className="h-4 w-4" />
                Bestellung
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
                  placeholder="Material suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                >
                  <option value="all">Alle Kategorien</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Inventory Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const isLowStock = item.quantity < item.minStock;
              const stockPercentage = Math.min((item.quantity / item.minStock) * 100, 100);

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">{item.category}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Package className="h-5 w-5 text-slate-600" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-600">Bestand</span>
                        <span className={`font-bold ${isLowStock ? "text-red-600" : "text-slate-900"}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLowStock ? "bg-red-500" : stockPercentage > 80 ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Mindestbestand: {item.minStock} {item.unit}
                      </p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Standort</span>
                        <span className="font-medium text-slate-700">{item.location}</span>
                      </div>
                      {item.supplier && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Lieferant</span>
                          <span className="font-medium text-slate-700">{item.supplier}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center">
              <Warehouse className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Keine Materialien gefunden</p>
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

