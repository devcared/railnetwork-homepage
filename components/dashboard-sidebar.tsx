"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  Home,
  ChevronLeft,
  ChevronDown,
  Warehouse,
  Wrench,
  TrainFront,
  Map,
  ClipboardList,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

type DashboardSidebarProps = {
  session: Session;
  onCollapsedChange?: (collapsed: boolean) => void;
};

type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

type DashboardNavSection = {
  title: string;
  subtitle?: string;
  items: DashboardNavItem[];
};

const navSections: DashboardNavSection[] = [
  {
    title: "Leitstand",
    subtitle: "Überblick & Betrieb",
    items: [
      {
        id: "overview",
        label: "Übersicht",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        id: "operations",
        label: "Betriebszentrale",
        href: "/dashboard/telemetry",
        icon: <TrainFront className="h-4 w-4" />,
        subItems: [
          {
            label: "Live-Monitoring",
            href: "/dashboard/telemetry/live",
            description: "Züge, Energie & Auslastung",
          },
          {
            label: "Leistungskennzahlen",
            href: "/dashboard/telemetry/analytics",
            description: "KPIs & Prognosen",
          },
          {
            label: "Sensoren & IoT",
            href: "/dashboard/telemetry/sensors",
            description: "Sensorstatus & Wartung",
          },
          {
            label: "Chronik",
            href: "/dashboard/telemetry/history",
            description: "Historische Messwerte",
          },
        ],
      },
    ],
  },
  {
    title: "Betrieb & Technik",
    subtitle: "Lager, Werkstatt, Gleisplan",
    items: [
      {
        id: "inventory",
        label: "Lager & Material",
        href: "/dashboard/inventory",
        icon: <Warehouse className="h-4 w-4" />,
        subItems: [
          {
            label: "Materialübersicht",
            href: "/dashboard/inventory",
            description: "Bestände & Reserven",
          },
          {
            label: "Bestellungen",
            href: "/dashboard/inventory/orders",
            description: "Offene Aufträge",
          },
          {
            label: "Lieferstatus",
            href: "/dashboard/inventory/suppliers",
            description: "Lieferanten & ETA",
          },
        ],
      },
      {
        id: "workshop",
        label: "Werkstatt & Flotte",
        href: "/dashboard/workshop",
        icon: <Wrench className="h-4 w-4" />,
        subItems: [
          {
            label: "Werkstattplaner",
            href: "/dashboard/workshop",
            description: "Kapazitäten & Schichten",
          },
          {
            label: "Fuhrpark",
            href: "/dashboard/workshop/fleet",
            description: "Fahrzeuge & Status",
          },
          {
            label: "Wartungstermine",
            href: "/dashboard/workshop/maintenance",
            description: "Inspektionen & Fristen",
          },
        ],
      },
      {
        id: "infrastructure",
        label: "Gleisplan & Infrastruktur",
        href: "/dashboard/network",
        icon: <Map className="h-4 w-4" />,
        subItems: [
          {
            label: "Gleisplan",
            href: "/dashboard/network",
            description: "Trassen & Weichen",
          },
          {
            label: "Baustellen",
            href: "/dashboard/network/construction",
            description: "Aktive Maßnahmen",
          },
          {
            label: "Sperrungen",
            href: "/dashboard/network/closures",
            description: "Temporäre Einschränkungen",
          },
        ],
      },
    ],
  },
  {
    title: "Verwaltung",
    subtitle: "Ausbau, Meldungen, Reports",
    items: [
      {
        id: "projects",
        label: "Ausbau & Projekte",
        href: "/dashboard/projects",
        icon: <ClipboardList className="h-4 w-4" />,
        subItems: [
          {
            label: "Alle Projekte",
            href: "/dashboard/projects",
            description: "Status & Fortschritt",
          },
          {
            label: "Projekt anlegen",
            href: "/dashboard/projects/new",
            description: "Neues Vorhaben",
          },
          {
            label: "Archiv",
            href: "/dashboard/projects/archive",
            description: "Abgeschlossene Maßnahmen",
          },
        ],
      },
      {
        id: "alerts",
        label: "Störungsmeldungen",
        href: "/dashboard/alerts",
        icon: <AlertTriangle className="h-4 w-4" />,
        subItems: [
          {
            label: "Aktive Meldungen",
            href: "/dashboard/alerts",
            description: "Offene Störungen",
          },
          {
            label: "Regelwerk",
            href: "/dashboard/alerts/rules",
            description: "Automatisierungen",
          },
          {
            label: "Historie",
            href: "/dashboard/alerts/history",
            description: "Vergangene Fälle",
          },
        ],
      },
      {
        id: "reports",
        label: "Auswertungen & Berichte",
        href: "/dashboard/reports",
        icon: <FileText className="h-4 w-4" />,
        subItems: [
          {
            label: "Vorlagen",
            href: "/dashboard/reports/templates",
            description: "Standardreports",
          },
          {
            label: "Generierte Reports",
            href: "/dashboard/reports",
            description: "Aktuelle Auswertungen",
          },
          {
            label: "Automatisierung",
            href: "/dashboard/reports/automation",
            description: "Zeitpläne & Versand",
          },
        ],
      },
      {
        id: "settings",
        label: "Systemverwaltung",
        href: "/dashboard/settings",
        icon: <Settings className="h-4 w-4" />,
        subItems: [
          {
            label: "Profil & Zugriff",
            href: "/dashboard/settings/profile",
            description: "Konten & Rollen",
          },
          {
            label: "Benachrichtigungen",
            href: "/dashboard/settings/notifications",
            description: "Alert-Kanäle",
          },
          {
            label: "API & Integrationen",
            href: "/dashboard/settings/api",
            description: "Schlüssel & Webhooks",
          },
          {
            label: "Team",
            href: "/dashboard/settings/team",
            description: "Mitglieder verwalten",
          },
        ],
      },
    ],
  },
];

const dashboardNavItems: DashboardNavItem[] = navSections.flatMap(
  (section) => section.items
);

export default function DashboardSidebar({ session, onCollapsedChange }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [manualDropdowns, setManualDropdowns] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = (itemId: string) => {
    setManualDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Auto-open dropdown if current path matches a sub-item
  const isItemActive = (item: DashboardNavItem) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/"));
    }
    return false;
  };

  const isSubItemActive = (subItemHref: string) => {
    return pathname === subItemHref || pathname.startsWith(subItemHref + "/");
  };

  const autoOpenDropdowns = useMemo(() => {
    const next = new Set<string>();
    dashboardNavItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/")
        );
        if (hasActiveSubItem || pathname === item.href || pathname.startsWith(item.href + "/")) {
          next.add(item.id);
        }
      }
    });
    return next;
  }, [pathname]);

  const openDropdowns = useMemo(() => {
    const combined = new Set<string>(manualDropdowns);
    autoOpenDropdowns.forEach((id) => combined.add(id));
    return combined;
  }, [manualDropdowns, autoOpenDropdowns]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Menü öffnen"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-900 font-db-screensans transition-all duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isCollapsed ? "w-20" : "w-72"
        }`}
        style={{ overflow: isCollapsed ? 'visible' : 'auto' }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-900 px-4 py-4">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <Link 
                  href="/" 
                  className="block transition-opacity hover:opacity-80" 
                  aria-label="Zur Startseite"
                >
                  <Image
                    src="/Logo.svg"
                    alt="Railnetwork.app"
                    width={180}
                    height={90}
                    className="h-10 w-auto max-w-[180px]"
                    priority
                  />
                </Link>
              )}
              {isCollapsed && (
                <Link 
                  href="/" 
                  className="flex items-center justify-center transition-opacity hover:opacity-80" 
                  aria-label="Zur Startseite"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2001a]/10">
                    <div className="h-6 w-6 rounded bg-[#e2001a]"></div>
                  </div>
                </Link>
              )}
              <button
                onClick={handleToggleCollapse}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                aria-label={isCollapsed ? "Sidebar erweitern" : "Sidebar minimieren"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 px-2 py-6 lg:px-4 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
            <div className="space-y-8">
              {navSections.map((section) => (
                <div key={section.title}>
                  {!isCollapsed && (
                    <div className="px-4 pb-3">
                      <p className="text-[13px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                        {section.title}
                      </p>
                      {section.subtitle && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-400">{section.subtitle}</p>
                      )}
                    </div>
                  )}
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const hasSubItems = item.subItems && item.subItems.length > 0;
                      const isActive = isItemActive(item);
                      const isOpen = openDropdowns.has(item.id) || (hasSubItems && isActive);
                      const isHovered = hoveredItem === item.id;

                      const baseLinkClasses = `group relative flex flex-1 items-center gap-2 rounded-lg py-0 text-sm font-semibold transition-all ${
                        isCollapsed ? "justify-center px-0" : "px-3"
                      }`;
                      const accentClasses = !isCollapsed
                        ? "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:bg-[#e2001a] before:opacity-0 before:transition-opacity before:duration-150 before:content-['']"
                        : "";
                      const stateClasses = isActive
                        ? `bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${!isCollapsed ? "before:opacity-100" : ""}`
                        : "text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100";

                      return (
                        <li key={item.id}>
                          <div
                            className="relative"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div className="flex items-center">
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`${baseLinkClasses} ${accentClasses} ${stateClasses}`}
                                title={isCollapsed ? item.label : undefined}
                              >
                                <span
                                  className={`flex-shrink-0 rounded-md p-1.5 transition ${
                                    isActive ? "text-[#e2001a]" : "text-slate-400"
                                  }`}
                                >
                                  {item.icon}
                                </span>
                                {!isCollapsed && <span className="flex-1">{item.label}</span>}
                              </Link>
                              {hasSubItems && !isCollapsed && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown(item.id);
                                  }}
                                  className={`ml-1 flex items-center justify-center rounded-md p-1.5 transition ${
                                    isActive
                                      ? "text-slate-900"
                                      : "text-slate-500 hover:text-slate-900"
                                  }`}
                                  aria-expanded={isOpen}
                                  aria-label={`${item.label} ${isOpen ? "schließen" : "öffnen"}`}
                                >
                                  <ChevronRight
                                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && isHovered && (
                              <div
                                className="pointer-events-none absolute left-full top-0 ml-2 z-[100]"
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                              >
                                <div className="relative min-w-[220px] rounded-lg border border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-800 shadow-xl">
                                  <div className="absolute left-0 top-4 -ml-1 h-2 w-2 rotate-45 border-l border-b border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-800" />
                                  <Link
                                    href={item.href}
                                    onClick={() => {
                                      setIsMobileOpen(false);
                                      setHoveredItem(null);
                                    }}
                                    className="pointer-events-auto block rounded-t-lg px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                                  >
                                    {item.label}
                                  </Link>
                                  {hasSubItems && item.subItems && (
                                    <div className="border-t border-slate-100 dark:border-slate-700/60/60">
                                      {item.subItems.map((subItem, index) => {
                                        const isSubActive = isSubItemActive(subItem.href);
                                        return (
                                          <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            onClick={() => {
                                              setIsMobileOpen(false);
                                              setHoveredItem(null);
                                            }}
                                            className={`pointer-events-auto block px-3 py-2 text-sm font-medium transition ${
                                              index === item.subItems!.length - 1 ? "rounded-b-lg" : ""
                                            } ${
                                              isSubActive
                                                ? "bg-[#e2001a]/10 text-[#e2001a]"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span>{subItem.label}</span>
                                              {isSubActive && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#e2001a]" />
                                              )}
                                            </div>
                                            {subItem.description && (
                                              <p className="mt-0.5 text-xs font-normal text-slate-500">
                                                {subItem.description}
                                              </p>
                                            )}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Sub-Items Dropdown */}
                            {hasSubItems && !isCollapsed && (
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="ml-4 border-l-2 border-slate-200/70 dark:border-slate-700/60/60 pl-4 pt-1">
                                      {item.subItems!.map((subItem) => {
                                        const isSubActive = isSubItemActive(subItem.href);
                                        return (
                                          <li key={subItem.href} className="mb-0.5">
                                            <Link
                                              href={subItem.href}
                                              onClick={() => setIsMobileOpen(false)}
                          className={`relative block rounded-md px-3 py-2 text-sm font-medium transition ${
                                                isSubActive
                              ? "bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                                              }`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <span>{subItem.label}</span>
                                              </div>
                                              {subItem.description && (
                                                <p className="mt-0.5 text-xs font-normal text-slate-500">
                                                  {subItem.description}
                                                </p>
                                              )}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </div>
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {isCollapsed && <div className="mx-auto my-5 h-px w-6 bg-slate-200/70" />}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-900">
            {/* Theme Toggle */}
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/60/60">
              <ThemeToggle />
            </div>
            
            {/* User Info */}
            <div className="relative p-3" data-user-menu>
              {!isCollapsed ? (
                <div className="space-y-2">
                  {/* User Card */}
                  <div
                    className="group relative cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-3 transition-all hover:border-slate-300 dark:hover:border-[#2a2a2a] hover:shadow-sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    data-user-menu
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#e2001a] ring-2 ring-white shadow-sm">
                          {session.user?.name ? (
                            <span className="text-sm font-bold text-white">
                              {session.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                        {/* Online Status */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {session.user?.name || "Benutzer"}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {session.user?.email || ""}
                        </p>
                      </div>
                      
                      {/* Dropdown Icon */}
                      <ChevronDown
                        className={`h-2 w-2 text-slate-400 transition-transform ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 rounded-lg border border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-800 p-1">
                          <Link
                            href="/dashboard/settings"
                            onClick={() => {
                              setIsMobileOpen(false);
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                          >
                            <Settings className="h-4 w-4 text-slate-500" />
                            <span>Einstellungen</span>
                          </Link>
                          <Link
                            href="/"
                            onClick={() => {
                              setIsMobileOpen(false);
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                          >
                            <Home className="h-4 w-4 text-slate-500" />
                            <span>Zur Startseite</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Abmelden</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Collapsed User Icon */
                <div 
                  className="relative" 
                  data-user-menu
                >
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="group relative flex w-full items-center justify-center rounded-lg p-2 transition hover:bg-slate-50"
                    title={session.user?.name || "Benutzer"}
                    data-user-menu
                    onMouseEnter={() => setShowUserMenu(true)}
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#e2001a] to-[#e2001a]/80 ring-2 ring-white shadow-sm">
                        {session.user?.name ? (
                          <span className="text-xs font-bold text-white">
                            {session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                  </button>

                  {/* Tooltip for collapsed state */}
                  {showUserMenu && isCollapsed && (
                    <>
                      {/* Bridge area to prevent gap between button and tooltip */}
                      <div 
                        className="absolute left-full bottom-0 h-9 w-2 z-[99]"
                        onMouseEnter={() => setShowUserMenu(true)}
                      />
                      
                      {/* Tooltip */}
                      <div 
                        className="absolute left-full bottom-0 mb-0 ml-2 z-[100]"
                        onMouseEnter={() => setShowUserMenu(true)}
                        onMouseLeave={() => setShowUserMenu(false)}
                      >
                        <div className="relative rounded-lg border border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-800 shadow-xl min-w-[220px]">
                          {/* Arrow - pointing left, positioned at middle right */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 h-2 w-2 rotate-45 border-l border-b border-slate-200 dark:border-slate-700/60/60 bg-white dark:bg-slate-800"></div>
                          
                          {/* User Info Header */}
                          <div className="border-b border-slate-100 dark:border-slate-700/60/60 px-3 py-2.5">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {session.user?.name || "Benutzer"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {session.user?.email || ""}
                            </p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="p-1">
                            <Link
                              href="/dashboard/settings"
                              onClick={() => {
                                setIsMobileOpen(false);
                                setShowUserMenu(false);
                              }}
                              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                              <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                              <span>Einstellungen</span>
                            </Link>
                            <Link
                              href="/"
                              onClick={() => {
                                setIsMobileOpen(false);
                                setShowUserMenu(false);
                              }}
                              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                              <Home className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                              <span>Zur Startseite</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                handleLogout();
                                setShowUserMenu(false);
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <LogOut className="h-4 w-4 flex-shrink-0" />
                              <span>Abmelden</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

