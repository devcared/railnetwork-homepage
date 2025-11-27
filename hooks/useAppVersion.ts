"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Version-Information vom Server
 */
interface VersionInfo {
  version: string;
  buildId: string;
  buildTimestamp: string;
  timestamp: string;
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
  const checkVersion = async () => {
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

      // Beim ersten Check: Setze die aktuelle Version
      if (currentVersion === null) {
        setCurrentVersion(data.buildId);
        // Speichere die Version im localStorage für Persistenz
        if (typeof window !== "undefined") {
          localStorage.setItem("app-version", data.buildId);
          localStorage.setItem("app-version-timestamp", data.buildTimestamp);
        }
      } else {
        // Prüfe, ob sich die Version geändert hat
        const storedVersion = localStorage.getItem("app-version");
        if (storedVersion && storedVersion !== data.buildId) {
          setIsUpdateAvailable(true);
        } else if (data.buildId !== currentVersion) {
          setIsUpdateAvailable(true);
        }
      }
    } catch (error) {
      console.error("Fehler beim Version-Check:", error);
    } finally {
      setIsChecking(false);
    }
  };

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
  }, [checkInterval]);

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

