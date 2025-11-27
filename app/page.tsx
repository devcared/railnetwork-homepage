"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const focusNews = [
  {
    title: "Neues Test für den Dresdner Hauptbahnhof",
    description:
      "Feierlich eingeweiht: Historische Halle wieder uneingeschränkt erlebbar • RailNetwork saniert deutschlandweit weitere Hallendächer",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070",
    href: "/de/konzern",
  },
  {
    title: "Magdeburg ist Bahnhof des Jahres",
    description:
      "RailNetwork hatte den Bahnhof umfassend saniert • Jury von Sauberkeit und Anschlussmobilität überzeugt",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070",
    href: "/de/konzern",
  },
  {
    title: "Deutschland-Premiere für den neuen ICE L",
    description:
      "Erster Hochgeschwindigkeitszug in Deutschland mit stufenlosem Einstieg • Einfach einsteigen in den neuen ICE L",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d8c?q=80&w=2070",
    href: "/de/konzern",
  },
  {
    title: "Neuer Fahrplan ab Dezember: Halbstundentakt im Fernverkehr",
    description:
      "Neue ICE Sprinter • Deutlich mehr Europaverbindungen • Einfachere Buchungen für internationale Fahrten",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074",
    href: "/de/konzern",
  },
];

const newsItems = [
  {
    date: "25.11.2025, 12:15 Uhr",
    location: "Berlin",
    title: "10 Jahre 3D-Druck bei RailNetwork",
    description:
      "Immer mehr Ersatzteile und Spezialwerkzeuge per Mausklick verfügbar • Bereits über 200.000 Bauteile aus dem 3D-Drucker im Einsatz",
    href: "/de/presse",
  },
  {
    date: "24.11.2025, 14:30 Uhr",
    location: "München",
    title: "Digitalisierungsoffensive gestartet",
    description:
      "RailNetwork startet neue Initiative für intelligente Netze • KI-gestützte Lösungen für die Zukunft",
    href: "/de/presse",
  },
  {
    date: "23.11.2025, 09:15 Uhr",
    location: "Hamburg",
    title: "KI-gestützte Wartung reduziert Ausfallzeiten",
    description:
      "Neue Technologie reduziert Ausfallzeiten um 40% • Präventive Wartung durch Machine Learning",
    href: "/de/presse",
  },
];

const themenwelten = [
  {
    title: "Podcast",
    description: "Staffel 1, 2 und 3 'Unterwegs mit ...', der Interview-Podcast auf Schienen",
    href: "/de/konzern",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070",
  },
  {
    title: "RailNetwork Shop",
    description: "Geschenkideen rund ums Thema Reisen und Bahn",
    href: "#",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070",
  },
];

const weitereThemen = [
  {
    title: "Corporate Responsibility",
    description: "Wir tragen Verantwortung und stehen für unsere Werte ein",
    href: "/de/nachhaltigkeit",
  },
  {
    title: "Der kleine ICE",
    description: "Die Welt der Bahn für Kinder",
    href: "/de/konzern",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-Play für den Slider
  useEffect(() => {
    // Starte Auto-Play
    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % focusNews.length);
    }, 5000); // Wechsel alle 5 Sekunden

    // Cleanup beim Unmount
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, []);

  // Pausiere Auto-Play bei manueller Interaktion und starte Timer neu
  const handleManualSlideChange = (newSlide: number) => {
    setCurrentSlide(newSlide);
    // Stoppe aktuellen Timer
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    // Starte Timer neu
    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % focusNews.length);
    }, 5000);
  };

  return (
    <>
      {/* Hero Section - DB Style */}
      <section className="bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Content */}
            <div>
              <h1 className="font-db-screenhead text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
                Intelligente Schienennetze{" "}
                <span className="text-[#e2001a]">neu gedacht</span>
              </h1>
              <p className="font-db-screensans mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Die zentrale Plattform für Telemetrie, Automatisierung und
                datengestütztes Engineering im Schienenverkehr. Modern, sicher,
                zuverlässig.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/de/konzern"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e2001a] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Mehr erfahren
                  <svg
                    className="h-5 w-5"
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
                </Link>
                <Link
                  href="/de/presse"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Aktuelles
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">525K+</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Aktive Nutzer weltweit
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">99.8%</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Uptime-Garantie
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">2.1M</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Komponenten im Portal
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">40+</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Rail & Mobility Partner
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96 overflow-hidden rounded-lg lg:h-[500px]">
        <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
                alt="RailNetwork"
                fill
                className="object-cover"
          priority
        />
            </div>
          </div>
        </div>
      </section>

      {/* Im Fokus - Slider */}
      <section className="bg-white dark:bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-db-screenhead mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Im Fokus</h2>
          <p className="font-db-screensans mb-8 text-sm text-slate-600 dark:text-slate-400">Neues aus den Geschäftsfeldern</p>

          {/* Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {focusNews.map((news, index) => (
                  <div key={index} className="min-w-full">
                    <Link
                      href={news.href}
                      className="group block overflow-hidden md:flex"
                    >
                      <div className="relative h-64 w-full md:h-80 md:w-1/2">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-center bg-white dark:bg-slate-800 p-8 md:w-1/2">
                        <h3 className="font-db-screenhead text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {news.title}
                        </h3>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">{news.description}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e2001a] group-hover:text-[#c10015]">
                          Mehr erfahren
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
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleManualSlideChange(
                      (currentSlide - 1 + focusNews.length) % focusNews.length,
                    );
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  aria-label="Vorheriger Slide"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleManualSlideChange((currentSlide + 1) % focusNews.length);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  aria-label="Nächster Slide"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {focusNews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleManualSlideChange(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? "w-8 bg-[#e2001a]"
                        : "w-2 bg-slate-300 dark:bg-slate-600"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {currentSlide + 1} von {focusNews.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsroom Section */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-db-screenhead mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">RailNetwork Newsroom</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {newsItems.map((news, index) => (
              <Link
                key={index}
                href={news.href}
                className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
              >
                <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  {news.date}, {news.location}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {news.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{news.description}</p>
                <div className="mt-4 text-sm font-semibold text-[#e2001a] group-hover:text-[#c10015]">
                  Zur Presseinformation →
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/de/presse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Mehr News anzeigen
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
            </Link>
          </div>
        </div>
      </section>

      {/* Themenwelten */}
      <section className="bg-slate-50 dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-db-screenhead mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">RailNetwork Themenwelten</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {themenwelten.map((thema, index) => (
              <Link
                key={index}
                href={thema.href}
                className="group block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
              >
                <div className="relative h-48">
                  <Image
                    src={thema.image}
                    alt={thema.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {thema.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{thema.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#e2001a]">
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
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-db-screenhead text-3xl font-bold text-slate-900 dark:text-slate-100">
              Unsere Leistungen
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Innovative Lösungen für die Schieneninfrastruktur von morgen
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2001a]/10 dark:bg-[#e2001a]/20">
                <svg
                  className="h-6 w-6 text-[#e2001a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Telemetrie & Monitoring
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Echtzeitüberwachung und Analyse von Schieneninfrastruktur mit
                modernster Sensorik und KI-gestützter Auswertung.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2001a]/10">
                <svg
                  className="h-6 w-6 text-[#e2001a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Automatisierung
              </h3>
              <p className="mt-2 text-slate-600">
                Intelligente Steuerungssysteme für optimale Betriebsabläufe und
                präventive Wartung durch Machine Learning.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2001a]/10">
                <svg
                  className="h-6 w-6 text-[#e2001a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Sicherheit & Compliance
              </h3>
              <p className="mt-2 text-slate-600">
                Höchste Sicherheitsstandards und vollständige Compliance mit
                allen regulatorischen Anforderungen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-db-screenhead text-3xl font-bold text-slate-900">
                Innovation durch Digitalisierung
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Wir entwickeln die Zukunft der Schieneninfrastruktur mit
                datengestützten Lösungen und künstlicher Intelligenz.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-[#e2001a]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-slate-900">
                      KI-gestützte Wartung
                    </span>
                    <p className="text-slate-600">
                      Reduzierung von Ausfallzeiten um bis zu 40% durch
                      prädiktive Analysen
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-[#e2001a]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-slate-900">
                      Echtzeit-Monitoring
                    </span>
                    <p className="text-slate-600">
                      Kontinuierliche Überwachung aller kritischen
                      Infrastrukturkomponenten
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-[#e2001a]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-slate-900">
                      Cloud-basierte Plattform
                    </span>
                    <p className="text-slate-600">
                      Skalierbare Architektur für wachsende Anforderungen
                    </p>
                  </div>
                </li>
              </ul>
              <Link
                href="/de/digitalisierung"
                className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[#e2001a] hover:text-[#c10015]"
              >
                Mehr zur Digitalisierung
                <svg
                  className="h-5 w-5"
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
              </Link>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg lg:h-[500px]">
            <Image
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070"
                alt="Innovation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Karriere Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-db-screenhead text-3xl font-bold text-slate-900">
                  Werde Teil unseres Teams
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Gestalte die Zukunft der Schieneninfrastruktur mit uns. Wir
                  suchen talentierte Menschen, die Innovation vorantreiben
                  wollen.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <span className="rounded-full bg-[#e2001a]/10 px-4 py-2 text-sm font-semibold text-[#e2001a]">
                    Software Engineering
                  </span>
                  <span className="rounded-full bg-[#e2001a]/10 px-4 py-2 text-sm font-semibold text-[#e2001a]">
                    Data Science
                  </span>
                  <span className="rounded-full bg-[#e2001a]/10 px-4 py-2 text-sm font-semibold text-[#e2001a]">
                    DevOps
                  </span>
                </div>
                <Link
                  href="/de/karriere"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#e2001a] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Offene Stellen
                  <svg
                    className="h-5 w-5"
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
                </Link>
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg md:h-80">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                  alt="Karriere"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weitere Themen */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-db-screenhead mb-8 text-2xl font-bold text-slate-900">Weitere Themen</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {weitereThemen.map((thema, index) => (
              <Link
                key={index}
                href={thema.href}
                className="group rounded-lg border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {thema.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{thema.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#e2001a] group-hover:text-[#c10015]">
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
                </span>
              </Link>
            ))}
          </div>
    </div>
      </section>
    </>
  );
}
