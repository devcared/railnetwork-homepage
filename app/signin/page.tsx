"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Ungültige Anmeldedaten.");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Ein Fehler ist aufgetreten.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Zurück-Button */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-db-screensans flex items-center gap-2 text-base font-medium text-slate-700 transition hover:text-slate-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zurück
          </button>
        </div>
      </div>

      {/* Login-Formular */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-db-screenhead text-3xl font-bold text-slate-900">
              Anmelden
            </h1>
            <p className="font-db-screensans mt-2 text-sm text-slate-600">
              Gib deine Zugangsdaten ein, um fortzufahren
            </p>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="font-db-screensans mb-1.5 block text-sm font-medium text-slate-700"
            >
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-db-screensans w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 transition focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
              placeholder="demo@railnetwork.app"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-db-screensans mb-1.5 block text-sm font-medium text-slate-700"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-db-screensans w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 transition focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="font-db-screensans w-full rounded-lg bg-[#e2001a] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#c10015] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>

          {/* Demo Hint */}
          <div className="mt-8 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-medium text-slate-700">Demo:</p>
            <p className="mt-1">demo@railnetwork.app / railnetwork</p>
          </div>
        </div>
      </div>
    </div>
  );
}
