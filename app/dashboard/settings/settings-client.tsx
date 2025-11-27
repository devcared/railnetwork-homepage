"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import Sheet, {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

type SettingsClientProps = {
  session: Session;
};

export default function SettingsClient({ session }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "api" | "team">("profile");
  const [showApiKeySheet, setShowApiKeySheet] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[var(--page-bg)] dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="px-6 py-3 lg:px-8">
            <Breadcrumbs />
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Sidebar */}
              <div className="lg:col-span-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 shadow-sm">
                  <nav className="space-y-1">
                    {[
                      { id: "profile", label: "Profil", icon: "👤" },
                      { id: "notifications", label: "Benachrichtigungen", icon: "🔔" },
                      { id: "api", label: "API-Schlüssel", icon: "🔑" },
                      { id: "team", label: "Team", icon: "👥" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                          activeTab === tab.id
                            ? "bg-[#e2001a]/10 dark:bg-[#e2001a]/20 text-[#e2001a]"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {activeTab === "profile" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                      Profil
                    </h2>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Name
                        </label>
                        <input
                          type="text"
                          defaultValue={session.user?.name || ""}
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          E-Mail
                        </label>
                        <input
                          type="email"
                          defaultValue={session.user?.email || ""}
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                        />
                      </div>
                      <div className="pt-4">
                        <button className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]">
                          Änderungen speichern
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                      Benachrichtigungen
                    </h2>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: "E-Mail-Benachrichtigungen", description: "Erhalten Sie E-Mails bei wichtigen Ereignissen" },
                        { label: "Alert-Benachrichtigungen", description: "Benachrichtigungen bei neuen Alerts" },
                        { label: "Report-Benachrichtigungen", description: "Benachrichtigungen wenn Reports fertig sind" },
                      ].map((setting, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700/60 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {setting.label}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {setting.description}
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" className="peer sr-only" defaultChecked />
                            <div className="peer h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 dark:after:border-slate-600 after:bg-white dark:after:bg-slate-800 after:transition-all after:content-[''] peer-checked:bg-[#e2001a] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e2001a]/20"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "api" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                          API-Schlüssel
                        </h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          Verwalten Sie Ihre API-Zugriffsschlüssel
                        </p>
                      </div>
                      <button
                        onClick={() => setShowApiKeySheet(true)}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Neuer Schlüssel
                      </button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {[
                        { name: "Production API Key", created: "2024-01-15", lastUsed: "Heute" },
                        { name: "Development API Key", created: "2024-01-10", lastUsed: "Vor 2 Tagen" },
                      ].map((key, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700/60 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {key.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Erstellt: {key.created} • Zuletzt verwendet: {key.lastUsed}
                            </p>
                          </div>
                          <button className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/30">
                            Löschen
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "team" && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-db-screenhead text-lg font-bold text-slate-900 dark:text-slate-100">
                          Team-Mitglieder
                        </h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          Verwalten Sie Ihre Team-Mitglieder
                        </p>
                      </div>
                      <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Mitglied hinzufügen
                      </button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {[
                        { name: "Max Mustermann", email: "max@example.com", role: "Admin" },
                        { name: "Anna Schmidt", email: "anna@example.com", role: "Editor" },
                        { name: "Tom Weber", email: "tom@example.com", role: "Viewer" },
                      ].map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2001a]/10">
                              <span className="text-sm font-semibold text-[#e2001a]">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {member.name}
                              </p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {member.role}
                            </span>
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                              Bearbeiten
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Key Sheet */}
        <Sheet
          open={showApiKeySheet}
          onOpenChange={setShowApiKeySheet}
          side="right"
          size="md"
        >
          <SheetHeader>
            <SheetTitle>Neuer API-Schlüssel</SheetTitle>
            <SheetDescription>
              Erstellen Sie einen neuen API-Zugriffsschlüssel
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowApiKeySheet(false);
              setNewApiKeyName("");
            }}
          >
            <SheetContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
                    placeholder="z.B. Production API Key"
                    required
                  />
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Der API-Schlüssel wird nur einmal angezeigt. Speichern Sie ihn sicher.
                  </p>
                </div>
              </div>
            </SheetContent>
            <SheetFooter>
              <button
                type="button"
                onClick={() => {
                  setShowApiKeySheet(false);
                  setNewApiKeyName("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#e2001a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c10015]"
              >
                Erstellen
              </button>
            </SheetFooter>
          </form>
        </Sheet>
      </div>
    </SessionProvider>
  );
}

