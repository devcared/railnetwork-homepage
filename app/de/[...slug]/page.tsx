import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { dbNavSections } from "@/lib/db-navigation";
import SectionHero from "@/components/section-hero";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function SectionPage({ params }: PageProps) {
  const { slug } = await params;
  const path = `/de/${slug.join("/")}`;

  // Finde die passende Sektion (nur interne Links)
  const section = dbNavSections.find(
    (s) => s.href === path && !s.href.startsWith("http"),
  );

  if (!section) {
    notFound();
  }

  // Sammle alle Links aus allen Columns und standaloneLinks
  const allLinks = [
    ...(section.columns?.flatMap((column) => column.links) ?? []),
    ...(section.standaloneLinks ?? []),
  ];

  // Fallback-Bilder für die Links
  const getImageUrl = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074", // Station/Clock
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d8c?q=80&w=2070", // Train/Logistics
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070", // Security/Train
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070", // Office/Building
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070", // Train Station
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070", // Modern Building
    ];
    return images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <SectionHero
        title={section.label}
        subtitle={section.intro ?? "Aktuelle Nachrichten, Daten und Fakten"}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-slate-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-slate-900">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900">{section.label}</li>
          </ol>
        </nav>

        {/* 3-Spalten-Layout mit Bildern */}
        <div className="grid gap-8 md:grid-cols-3">
          {allLinks.map((link, index) => {
            const LinkComponent = link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(index)}
                    alt={link.label}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {link.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {link.description ??
                    "Hier finden Sie alle Informationen zu diesem Thema."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#e2001a] transition group-hover:text-[#b10b1b]">
                  Weiterlesen
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            ) : (
              <Link href={link.href} className="group">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(index)}
                    alt={link.label}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {link.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {link.description ??
                    "Hier finden Sie alle Informationen zu diesem Thema."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#e2001a] transition group-hover:text-[#b10b1b]">
                  Weiterlesen
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );

            return <div key={link.label}>{LinkComponent}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

