import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Settings,
  Warehouse,
  Wrench,
  TrainFront,
  Map,
  ClipboardList,
} from "lucide-react";

export type DashboardNavItem = {
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

export type DashboardNavSection = {
  title: string;
  subtitle?: string;
  items: DashboardNavItem[];
};

export const navSections: DashboardNavSection[] = [
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

export const dashboardNavItems: DashboardNavItem[] = navSections.flatMap(
  (section) => section.items
);

