"use client";

import { useState } from "react";
import { useAppVersion } from "@/hooks/useAppVersion";
import { X, Download } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

/**
 * Update-Prompt Komponente
 * 
 * Zeigt einen Dialog an, wenn eine neue Version verfügbar ist.
 * Bietet Optionen zum sofortigen Update oder später.
 */
export default function UpdatePrompt() {
  const { isUpdateAvailable, performUpdate, dismissUpdate, serverVersion, currentVersion } = useAppVersion();
  const [isUpdating, setIsUpdating] = useState(false);

  const loadingSteps = [
    { text: "Update wird vorbereitet..." },
    { text: "Neue Version wird heruntergeladen..." },
    { text: "Dateien werden aktualisiert..." },
    { text: "Anwendung wird neu gestartet..." },
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
    
    // Warte bis alle Schritte durchlaufen sind, dann reload
    // Die MultiStepLoader Komponente zeigt alle Schritte an
    // Dauer: loadingSteps.length * duration (default 2000ms pro Schritt)
    const totalDuration = loadingSteps.length * 2000;
    
    setTimeout(() => {
      performUpdate();
    }, totalDuration + 500); // +500ms Puffer
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

      {/* Update-Loader (Fullscreen) - Multi-Step Loader */}
      <MultiStepLoader
        loadingStates={loadingSteps}
        loading={isUpdating}
        duration={2000}
        loop={false}
      />
    </>
  );
}

