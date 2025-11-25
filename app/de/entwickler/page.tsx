import Link from "next/link";
import Signature from "@/components/signature";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section - Split Layout */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#e2001a]"></span>
                Entwickler & Designer
              </div>
              <h1 className="font-db-screenhead mb-4 text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl">
                Emil
                <br />
                <span className="text-[#e2001a]">Schröder</span>
              </h1>
              <p className="font-db-screensans mb-8 text-lg text-slate-600 lg:text-xl">
                Ich entwickle moderne Web-Anwendungen mit Fokus auf Benutzererfahrung,
                Performance und elegante Lösungen.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:emil@railnetwork.app"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e2001a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Kontakt aufnehmen
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/emilschroeder"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  GitHub
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017c0-5.533-4.477-10.017-10-10.017z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side - Signature */}
            <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-16 lg:px-12 lg:py-24">
              <div className="w-full max-w-md">
                <div className="mb-4 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Digitale Unterschrift
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                  <Signature />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Asymmetric Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {/* Skills Grid */}
        <section className="mb-24">
          <div className="mb-12">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              Technologie-Stack
            </h2>
            <p className="text-lg text-slate-600">
              Moderne Tools und Frameworks, die ich täglich verwende
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Next.js",
                category: "Framework",
                icon: (
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 394 80">
                    <path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z" />
                  </svg>
                ),
              },
              {
                name: "React",
                category: "Library",
                icon: (
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" />
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(-60 12 12)" />
                  </svg>
                ),
              },
              {
                name: "TypeScript",
                category: "Language",
                icon: (
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="#3178C6" />
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 7.53 7.53 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 5.933 5.933 0 0 1 1.77-.272zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="#fff" />
                  </svg>
                ),
              },
              {
                name: "TailwindCSS",
                category: "Styling",
                icon: (
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z" fill="#06B6D4" />
                  </svg>
                ),
              },
              {
                name: "Node.js",
                category: "Runtime",
                icon: (
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="#339933">
                    <path d="M11.998 24c-2.246 0-4.085-.89-5.24-2.307l1.196-.962c.947 1.05 2.41 1.634 4.044 1.634 2.905 0 4.635-1.707 4.635-4.55V0h2.48v17.455c0 3.95-2.316 6.545-6.115 6.545zm-1.776-3.48l-1.68 1.126c-.947-1.05-2.41-1.634-4.044-1.634-2.905 0-4.635 1.707-4.635 4.55V24h2.48V6.545c0-3.95 2.316-6.545 6.115-6.545 2.246 0 4.085.89 5.24 2.307l-1.196.962c-.947-1.05-2.41-1.634-4.044-1.634z" />
                  </svg>
                ),
              },
              {
                name: "PostgreSQL",
                category: "Database",
                icon: (
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="#336791">
                    <path d="M23.559 4.321c-.772-2.912-3.202-4.275-6.48-4.275C12.772.046 9.346 2.475 8.5 5.772c-.846 3.297-2.475 4.97-5.653 4.97-1.693 0-3.096-.423-4.22-1.27v9.303c0 .846.423 1.27 1.27 1.27h20.286c.846 0 1.27-.423 1.27-1.27V5.59c.423-.846.846-1.693 1.27-1.27zm-1.27 15.18H2.71V6.86c.846.423 1.693.846 2.54.846 2.54 0 4.22-1.27 5.07-3.802.846-2.54 2.54-3.802 5.07-3.802 2.117 0 3.38.846 3.89 2.54.423 1.27.423 2.54.423 3.802v9.857z" />
                  </svg>
                ),
              },
              {
                name: "Prisma",
                category: "ORM",
                icon: (
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="#2D3748">
                    <path d="M21.806 8.703L12.32.017a1.077 1.077 0 0 0-1.537 0L1.194 8.703a1.12 1.12 0 0 0-.006 1.57l4.32 4.454a1.064 1.064 0 0 0 1.523 0l3.58-3.688a.29.29 0 0 1 .41 0l3.58 3.688a1.064 1.064 0 0 0 1.523 0l4.32-4.454a1.12 1.12 0 0 0-.006-1.57zm-1.41 15.29h-4.32v-4.454a1.12 1.12 0 0 0-1.12-1.12h-2.256a1.12 1.12 0 0 0-1.12 1.12v4.454H7.604V12.32a1.064 1.064 0 0 0-1.523 0l-4.32 4.454a1.12 1.12 0 0 0-.006 1.57l9.488 8.686a1.077 1.077 0 0 0 1.537 0l9.488-8.686a1.12 1.12 0 0 0-.006-1.57l-4.32-4.454a1.064 1.064 0 0 0-1.523 0v11.673z" />
                  </svg>
                ),
              },
              {
                name: "Vercel",
                category: "Hosting",
                icon: (
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 22.525H0l12-21.05 12 21.05z" fill="#000000" />
                  </svg>
                ),
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-lg"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center text-slate-700">
                  {tech.icon}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-slate-900">
                  {tech.name}
                </h3>
                <p className="text-sm text-slate-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-24">
          <div className="mb-12">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Projekte & Erfahrung</h2>
            <p className="text-lg text-slate-600">
              Einblicke in meine Arbeit und Projekte
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2001a]/10">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">RailNetwork Platform</h3>
                  <p className="text-sm text-slate-500">2024 - Heute</p>
                </div>
              </div>
              <p className="text-slate-600">
                Entwicklung einer modernen Web-Plattform für intelligente Schienennetze mit
                Next.js, TypeScript und TailwindCSS. Fokus auf Performance, UX und skalierbare
                Architektur.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Full-Stack Development</h3>
                  <p className="text-sm text-slate-500">Seit 2020</p>
                </div>
              </div>
              <p className="text-slate-600">
                Entwicklung von Web-Anwendungen von Frontend bis Backend. Erfahrung mit modernen
                Frameworks, APIs, Datenbanken und Cloud-Services.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-24 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-slate-900">Meine Philosophie</h2>
            <p className="mb-8 text-xl leading-relaxed text-slate-600">
              &ldquo;Code sollte nicht nur funktionieren, sondern auch elegant, wartbar und
              benutzerfreundlich sein. Jedes Projekt ist eine Gelegenheit, etwas Neues zu lernen
              und zu verbessern.&rdquo;
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2001a]"></span>
                Clean Code
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2001a]"></span>
                User Experience
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2001a]"></span>
                Performance
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2001a]"></span>
                Innovation
              </span>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="flex justify-center border-t border-slate-200 pt-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
