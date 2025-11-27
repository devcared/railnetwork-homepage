"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Version-Information vom Server
 */
interface VersionInfo {
  version: string;
  buildId: string;
  buildTimestamp: string;
  timestamp: string;
  source?: string; // Optional: Debug-Info, woher die Build-Info kommt
}

/**
 * Custom Hook für App-Version-Check
 * 
 * Prüft regelmäßig, ob eine neue Version der App verfügbar ist.
 * 
 * @param checkInterval - Intervall in Millisekunden für Version-Check (Standard: 60 Sekunden)
 * @returns Objekt mit aktueller Version, neuer Version verfügbar, und Update-Funktion
 */
export function useAppVersion(checkInterval: number = 60000) {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [serverVersion, setServerVersion] = useState<VersionInfo | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Holt die aktuelle Version vom Server
   */
  const checkVersion = useCallback(async () => {
    try {
      setIsChecking(true);
      const response = await fetch("/api/version", {
        cache: "no-store", // Wichtig: Kein Caching, damit wir immer die neueste Version bekommen
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        console.warn("Version-Check fehlgeschlagen:", response.statusText);
        return;
      }

      const data: VersionInfo = await response.json();
      setServerVersion(data);

      // Lade aktuelle Version aus State oder localStorage
      const storedVersion = typeof window !== "undefined" 
        ? localStorage.getItem("app-version") 
        : null;
      const currentStoredVersion = currentVersion || storedVersion;

      // Beim ersten Check: Setze die aktuelle Version
      if (currentStoredVersion === null) {
        setCurrentVersion(data.buildId);
        // Speichere die Version im localStorage für Persistenz
        if (typeof window !== "undefined") {
          localStorage.setItem("app-version", data.buildId);
          localStorage.setItem("app-version-timestamp", data.buildTimestamp);
          console.log("✅ Initiale Version gespeichert:", data.buildId);
        }
      } else {
        // Prüfe, ob sich die Version geändert hat
        const storedTimestamp = typeof window !== "undefined"
          ? localStorage.getItem("app-version-timestamp")
          : null;
        
        // Debug-Logging
        console.log("🔍 Version Check:", {
          stored: storedVersion,
          server: data.buildId,
          storedTimestamp,
          serverTimestamp: data.buildTimestamp,
          currentVersion: currentStoredVersion,
          buildIdMatch: storedVersion === data.buildId,
          timestampMatch: storedTimestamp === data.buildTimestamp,
          source: data.source, // Debug-Info von API
        });
        
        // Prüfe sowohl Build-ID als auch Timestamp für bessere Erkennung
        if (storedVersion && storedVersion !== data.buildId) {
          console.log("🔄 Neue Version erkannt! Build-ID geändert:", storedVersion, "→", data.buildId);
          setIsUpdateAvailable(true);
        } else if (storedTimestamp && storedTimestamp !== data.buildTimestamp) {
          console.log("🔄 Neue Version erkannt! Timestamp geändert:", storedTimestamp, "→", data.buildTimestamp);
          setIsUpdateAvailable(true);
        } else if (data.buildId !== currentStoredVersion) {
          console.log("🔄 Neue Version erkannt! Current Version geändert:", currentStoredVersion, "→", data.buildId);
          setIsUpdateAvailable(true);
        } else {
          console.log("✅ Version unverändert:", data.buildId);
        }
      }
    } catch (error) {
      console.error("Fehler beim Version-Check:", error);
    } finally {
      setIsChecking(false);
    }
  }, [currentVersion]);

  /**
   * Initialisiert den Version-Check
   */
  useEffect(() => {
    // Lade gespeicherte Version beim Start
    if (typeof window !== "undefined") {
      const storedVersion = localStorage.getItem("app-version");
      if (storedVersion) {
        setCurrentVersion(storedVersion);
      }
    }

    // Erster Check sofort
    void checkVersion();

    // Regelmäßige Checks
    intervalRef.current = setInterval(() => {
      void checkVersion();
    }, checkInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkInterval, checkVersion]);

  /**
   * Führt das Update durch (Seite neu laden)
   */
  const performUpdate = () => {
    if (typeof window !== "undefined") {
      // Aktualisiere die gespeicherte Version
      if (serverVersion) {
        localStorage.setItem("app-version", serverVersion.buildId);
        localStorage.setItem("app-version-timestamp", serverVersion.buildTimestamp);
      }
      // Seite neu laden
      window.location.reload();
    }
  };

  /**
   * Ignoriert das Update (setzt den Status zurück)
   */
  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
    // Optional: Speichere, dass Update ignoriert wurde
    if (serverVersion) {
      localStorage.setItem("app-version", serverVersion.buildId);
    }
  };

  return {
    currentVersion,
    serverVersion,
    isUpdateAvailable,
    isChecking,
    checkVersion,
    performUpdate,
    dismissUpdate,
  };
}

