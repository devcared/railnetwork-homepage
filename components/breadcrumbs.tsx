"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrentLink,
} from "@chakra-ui/react";
import { Home } from "lucide-react";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items?: BreadcrumbItemType[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItemType[] = items || (() => {
    const segments = pathname.split("/").filter(Boolean);
    const result: BreadcrumbItemType[] = [
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
    <BreadcrumbRoot>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {item.href ? (
              <BreadcrumbLink asChild>
                <Link href={item.href}>
                  {index === 0 ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Home size={14} />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbCurrentLink>
                {item.label}
              </BreadcrumbCurrentLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

