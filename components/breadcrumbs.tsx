"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items?: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split("/").filter(Boolean);
    const result: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/dashboard" },
    ];

    // Map common segments to readable labels
    const labelMap: Record<string, string> = {
      alerts: "Störungsmeldungen",
      projects: "Projekte",
      telemetry: "Telemetrie",
      inventory: "Lager",
      workshop: "Werkstatt",
      network: "Gleisplan",
      reports: "Berichte",
      settings: "Einstellungen",
      sensors: "Sensoren",
      live: "Live-Monitoring",
      analytics: "Analysen",
      history: "Chronik",
      orders: "Bestellungen",
      suppliers: "Lieferanten",
      fleet: "Flotte",
      maintenance: "Wartung",
      construction: "Bauarbeiten",
      closures: "Sperrungen",
      rules: "Regeln",
      templates: "Vorlagen",
      automation: "Automatisierung",
      profile: "Profil",
      notifications: "Benachrichtigungen",
      api: "API",
      team: "Team",
    };

    segments.forEach((segment, index) => {
      if (segment === "dashboard") return;
      
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Don't add href for last item (current page)
      if (index === segments.length - 1) {
        result.push({ label });
      } else {
        result.push({ label, href });
      }
    });

    return result;
  })();

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {index === 0 ? (
                  <span className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

