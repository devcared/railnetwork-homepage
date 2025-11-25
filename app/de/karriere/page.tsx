"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const beliebteBerufe = [
  {
    title: "Software Engineer (w/m/d)",
    description: "Entwicklung innovativer Lösungen für die Schieneninfrastruktur",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
    href: "/de/karriere/software-engineer",
  },
  {
    title: "Data Scientist (w/m/d)",
    description: "KI-gestützte Analysen und prädiktive Wartung",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
    href: "/de/karriere/data-scientist",
  },
  {
    title: "DevOps Engineer (w/m/d)",
    description: "Skalierbare Cloud-Infrastruktur und CI/CD-Pipelines",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070",
    href: "/de/karriere/devops-engineer",
  },
  {
    title: "Product Manager (w/m/d)",
    description: "Strategische Produktentwicklung und Roadmap-Planung",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
    href: "/de/karriere/product-manager",
  },
  {
    title: "UX/UI Designer (w/m/d)",
    description: "Benutzerfreundliche Interfaces für komplexe Systeme",
    image: "https://images.unsplash.com/photo-1561070791-2526d38794b5?q=80&w=2070",
    href: "/de/karriere/ux-ui-designer",
  },
];

const unternehmenswerte = [
  {
    title: "Familie und Beruf",
    description: "Flexible Arbeitszeiten und familienfreundliche Angebote",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Soziales",
    description: "Engagement für gesellschaftliche Verantwortung",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    title: "Inklusion",
    description: "Vielfalt als Stärke - alle willkommen",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Vielfalt",
    description: "Chancengleichheit für alle Talente",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Nachhaltigkeit",
    description: "Verantwortung für Umwelt und Zukunft",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Mehr Frauen",
    description: "Gleichberechtigung und Förderung",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

const informationsangebote = [
  {
    title: "Berufstest",
    description: "Beantworte 25 Fragen und finde so die passende Stelle für dich!",
    href: "/de/karriere/berufstest",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Arbeitsorte",
    description: "Finde deinen Einstieg über deinen bevorzugten Arbeitsort!",
    href: "/de/karriere/arbeitsorte",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Mitarbeiter:innen-Berichte",
    description: "Erfahre mehr über den Arbeitsalltag bei RailNetwork",
    href: "/de/karriere/mitarbeiter-berichte",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Bewerbungstipps",
    description: "So bewirbst du dich erfolgreich bei RailNetwork",
    href: "/de/karriere/bewerbungstipps",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const auszeichnungen = [
  {
    title: "Preis für Altersdiversität",
    description:
      "2025 haben wir den ersten Platz bei Trendence Awards in der Kategorie 'Beste Recruiting Kampagne/Event (Konzern)' gewonnen.",
    year: "2025",
  },
  {
    title: "Frauenfreundlichstes Unternehmen",
    description:
      "2024 gewannen wir den 1. Platz beim FKi für das frauenfreundlichste Unternehmen in Deutschland.",
    year: "2024",
  },
  {
    title: "Preis für Generationenaustausch",
    description:
      "Die DB fördert den Austausch von Kolleg:innen verschiedener Generationen und wurde dafür mit dem Impact of Diversity Award ausgezeichnet.",
    year: "2024",
  },
  {
    title: "Inklusive Arbeitgeberin",
    description:
      "Das Inklusionszentrum der Personalgewinnung wurde 2023 in der Kategorie 'Inclusive Workplace' ausgezeichnet.",
    year: "2023",
  },
];

export default function KarrierePage() {
  const [currentBeruf, setCurrentBeruf] = useState(0);
  const [currentAuszeichnung, setCurrentAuszeichnung] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section mit Suchfunktion */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Karriere und Jobs bei RailNetwork
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Finde die Stelle, die zu dir passt
            </p>

            {/* Suchfunktion */}
            <div className="mt-10">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Wonach suchst du?"
                  className="w-full rounded-lg border-2 border-slate-300 px-6 py-4 text-lg text-slate-900 placeholder-slate-400 focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-lg bg-[#e2001a] px-6 py-2 text-base font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Suchen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entdecke deine Job-Möglichkeiten */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Entdecke deine Job-Möglichkeiten bei RailNetwork
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Erzähle uns, was du aktuell bist und was du suchst, und wir zeigen
              dir deine Einstiegsmöglichkeiten bei RailNetwork auf!
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Schüler:in", href: "/de/karriere/schueler" },
              { label: "Student:in", href: "/de/karriere/studenten" },
              { label: "Absolvent:in", href: "/de/karriere/absolventen" },
              { label: "Fachkraft", href: "/de/karriere/fachkraefte" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-lg border-2 border-slate-200 bg-white p-6 text-center transition hover:border-[#e2001a] hover:shadow-md"
              >
                <div className="text-xl font-semibold text-slate-900 group-hover:text-[#e2001a]">
                  {item.label}
                </div>
                <div className="mt-2 text-sm text-slate-600">Mehr erfahren →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beliebte Berufe - Slider */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Deine Chance auf einen festen Job mit Zukunft: Unsere beliebten
              Berufe
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du bist Schüler:in, Student:in oder bereits berufserfahren? Lerne
              besonders gefragte RailNetwork-Berufe im Detail kennen!
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBeruf * 100}%)` }}
              >
                {beliebteBerufe.map((beruf, index) => (
                  <div key={index} className="min-w-full">
                    <Link
                      href={beruf.href}
                      className="group block overflow-hidden md:flex"
                    >
                      <div className="relative h-64 w-full md:h-80 md:w-1/2">
                        <Image
                          src={beruf.image}
                          alt={beruf.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-center bg-white p-8 md:w-1/2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {beruf.title}
                        </h3>
                        <p className="mt-4 text-slate-600">{beruf.description}</p>
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
                  onClick={() =>
                    setCurrentBeruf(
                      (prev) => (prev - 1 + beliebteBerufe.length) % beliebteBerufe.length,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Vorheriger Beruf"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentBeruf((prev) => (prev + 1) % beliebteBerufe.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Nächster Beruf"
                >
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
                </button>
              </div>
              <div className="flex items-center gap-2">
                {beliebteBerufe.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentBeruf(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentBeruf === index
                        ? "w-8 bg-[#e2001a]"
                        : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Beruf ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-500">
                {currentBeruf + 1} von {beliebteBerufe.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unternehmenswerte */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Auf diese Unternehmenswerte kannst du dich bei uns einstellen
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              RailNetwork ist eine der größten und vielfältigsten
              Arbeitgeberinnen in Deutschland. Lerne die Mission von RailNetwork
              kennen und erfahre Genaueres zu unseren Unternehmenswerten:
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {unternehmenswerte.map((wert, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-6 text-center transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#e2001a]/10 text-[#e2001a]">
                  {wert.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {wert.title}
                </h3>
                <p className="mt-2 text-slate-600">{wert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lerne RailNetwork kennen */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Lerne RailNetwork und ihre Berufe kennen
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Lerne die vielfältigen Jobs und Berufe bei RailNetwork über unsere
              verschiedenen Informationsangebote kennen.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {informationsangebote.map((angebot, index) => (
              <Link
                key={index}
                href={angebot.href}
                className="group rounded-lg border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2001a]/10 text-[#e2001a]">
                  {angebot.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {angebot.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {angebot.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-[#e2001a] group-hover:text-[#c10015]">
                  Mehr erfahren →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ausgezeichnete Arbeitgeberin */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              RailNetwork – eine ausgezeichnete Arbeitgeberin
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Die Arbeitgeberin RailNetwork wurde vielfach für ihre Frauen-,
              Familien- und Inklusionsfreundlichkeit sowie für ihr
              Generationen-Management ausgezeichnet.
            </p>
          </div>

          {/* Auszeichnungen Slider */}
          <div className="mt-12">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentAuszeichnung * 100}%)`,
                }}
              >
                {auszeichnungen.map((auszeichnung, index) => (
                  <div
                    key={index}
                    className="min-w-full px-8 py-12 text-center md:px-16"
                  >
                    <div className="mx-auto max-w-2xl">
                      <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#e2001a]">
                        {auszeichnung.year}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {auszeichnung.title}
                      </h3>
                      <p className="mt-4 text-lg text-slate-600">
                        {auszeichnung.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {auszeichnungen.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentAuszeichnung(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentAuszeichnung === index
                      ? "w-8 bg-[#e2001a]"
                      : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Auszeichnung ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

