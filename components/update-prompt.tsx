"use client";

import { useState } from "react";
import { useAppVersion } from "@/hooks/useAppVersion";
import { RefreshCw, X, Download, CheckCircle2, Loader2 } from "lucide-react";

/**
 * Update-Prompt Komponente
 * 
 * Zeigt einen Dialog an, wenn eine neue Version verfügbar ist.
 * Bietet Optionen zum sofortigen Update oder später.
 */
export default function UpdatePrompt() {
  const { isUpdateAvailable, performUpdate, dismissUpdate, serverVersion, currentVersion } = useAppVersion();
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Update wird vorbereitet...",
    "Neue Version wird heruntergeladen...",
    "Dateien werden aktualisiert...",
    "Anwendung wird neu gestartet...",
  ];

  // Debug-Logging (kann später entfernt werden)
  if (process.env.NODE_ENV === "development" && isUpdateAvailable) {
    console.log("🔄 Update verfügbar:", {
      current: currentVersion,
      server: serverVersion?.buildId,
      timestamp: serverVersion?.buildTimestamp,
    });
  }

  if (!isUpdateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    setIsUpdating(true);
    setProgress(0);
    setLoadingStep(0);

    // Simuliere Update-Prozess mit Progress
    const totalDuration = 5000; // 5 Sekunden
    const stepDuration = totalDuration / loadingSteps.length;
    const progressInterval = 50; // Update alle 50ms
    const progressIncrement = (100 / totalDuration) * progressInterval;

    let currentProgress = 0;
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress >= 100) {
        currentProgress = 100;
      }
      setProgress(currentProgress);

      // Wechsle zu nächstem Schritt
      const newStep = Math.floor((currentProgress / 100) * loadingSteps.length);
      if (newStep !== currentStep && newStep < loadingSteps.length) {
        currentStep = newStep;
        setLoadingStep(currentStep);
      }

      if (currentProgress >= 100) {
        clearInterval(progressTimer);
        // Warte noch kurz, dann reload
        setTimeout(() => {
          performUpdate();
        }, 500);
      }
    }, progressInterval);
  };

  return (
    <>
      {/* Update-Dialog */}
      {!isUpdating && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center sm:p-6">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={dismissUpdate}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-[#e2001a]/5 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2001a]/10 ring-1 ring-[#e2001a]/15">
                    <Download className="h-5 w-5 text-[#e2001a]" />
                  </div>
                  <div>
                    <h3 className="font-db-screenhead text-lg font-bold text-slate-900">
                      Neue Version verfügbar
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      Ein Update steht bereit
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissUpdate}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Schließen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600">
                Eine neue Version der Anwendung ist verfügbar. Möchten Sie jetzt aktualisieren?
              </p>
              {serverVersion && (
                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
                  <p className="text-xs font-medium text-slate-500">Build-ID</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-700">
                    {serverVersion.buildId.substring(0, 12)}...
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={dismissUpdate}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Später
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 rounded-lg bg-[#e2001a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c10015]"
                >
                  Jetzt updaten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update-Loader (Fullscreen) */}
      {isUpdating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-spin-slow rounded-full bg-gradient-to-r from-[#e2001a]/5 via-transparent to-[#e2001a]/5"></div>
            <div className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-spin-slow rounded-full bg-gradient-to-r from-transparent via-[#e2001a]/5 to-transparent" style={{ animationDirection: "reverse", animationDuration: "8s" }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-md px-6">
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 shadow-2xl">
              {/* Main Spinner */}
              <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100"></div>
                {/* Progress Ring */}
                <div
                  className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#e2001a] border-r-[#e2001a]"
                  style={{
                    animationDuration: "1s",
                  }}
                ></div>
                {/* Inner Circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e2001a]/10 to-[#e2001a]/5">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#e2001a]" style={{ animationDuration: "1.5s" }} />
                </div>
              </div>

              {/* Title */}
              <h2 className="font-db-screenhead mb-2 text-center text-2xl font-bold text-slate-900">
                Update wird installiert
              </h2>

              {/* Current Step */}
              <div className="mb-6 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {loadingSteps[loadingStep] || loadingSteps[loadingSteps.length - 1]}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Fortschritt</span>
                  <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-100"></div>
                  {/* Progress Fill */}
                  <div
                    className="relative h-full rounded-full bg-gradient-to-r from-[#e2001a] via-[#ff6f61] to-[#e2001a] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Steps Indicator */}
              <div className="space-y-2">
                {loadingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      index === loadingStep
                        ? "bg-[#e2001a]/10"
                        : index < loadingStep
                          ? "bg-emerald-50"
                          : "bg-slate-50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {index < loadingStep ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      ) : index === loadingStep ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#e2001a]" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-300"></div>
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        index === loadingStep
                          ? "text-[#e2001a]"
                          : index < loadingStep
                            ? "text-emerald-700"
                            : "text-slate-500"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Info Text */}
              <p className="mt-6 text-center text-xs text-slate-500">
                Bitte schließen Sie diese Seite nicht
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

