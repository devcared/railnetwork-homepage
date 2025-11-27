import type { NextConfig } from "next";
import { writeFileSync } from "fs";
import { join } from "path";

// Generiere Build-Informationen zur Build-Zeit (nur beim Build, nicht im Dev-Modus!)
const buildTimestamp = new Date().toISOString();
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;

// Prüfe, ob wir im Build-Modus sind (nicht im Dev-Modus)
// Auf Vercel: VERCEL ist gesetzt, NEXT_PHASE wird beim Build gesetzt
// Lokal: process.argv.includes("build") oder NEXT_PHASE === "phase-production-build"
const isVercel = !!process.env.VERCEL;
const isBuild = process.env.NEXT_PHASE === "phase-production-build" || 
                process.argv.includes("build") ||
                (isVercel && !process.argv.includes("dev")); // Auf Vercel immer beim Build generieren

const buildInfoPath = join(process.cwd(), "lib", "build-info.ts");

// WICHTIG: Nur beim Build generieren, niemals im Dev-Modus!
// Im Dev-Modus wird die Datei NICHT generiert, um Neustarts zu vermeiden
// Die API-Route hat einen Fallback für den Dev-Modus
if (isBuild) {
  try {
    const buildInfoContent = `/**
 * Build-Informationen
 * 
 * Diese Datei wird zur Build-Zeit generiert und enthält die Build-ID und den Build-Timestamp.
 * In Vercel wird diese Datei bei jedem Deployment neu generiert.
 * 
 * ⚠️ WICHTIG: Diese Datei wird automatisch generiert - nicht manuell bearbeiten!
 * 
 * Generiert am: ${buildTimestamp}
 * Build-ID: ${buildId}
 */

export const BUILD_ID = "${buildId}";
export const BUILD_TIMESTAMP = "${buildTimestamp}";
export const APP_VERSION = "${process.env.npm_package_version || "1.0.0"}";
`;
    writeFileSync(buildInfoPath, buildInfoContent, "utf-8");
    console.log(`✅ Build-Info generiert: ${buildId} (${buildTimestamp})`);
    if (isVercel) {
      console.log(`📦 Vercel Build erkannt - Build-ID: ${buildId}`);
    }
  } catch (error) {
    console.warn("⚠️ Konnte build-info.ts nicht schreiben:", error);
  }
} else {
  // Debug-Logging im Dev-Modus
  if (process.env.NODE_ENV === "development") {
    console.log("ℹ️ Dev-Modus: Build-Info wird nicht generiert (verhindert Neustarts)");
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Generiere eine Build-ID basierend auf Git Commit SHA oder Timestamp
  generateBuildId: async () => {
    // Für Vercel: Nutze den Git Commit SHA falls verfügbar
    // Sonst: Nutze Timestamp (wird nur einmal beim Build gesetzt)
    return buildId;
  },
};

export default nextConfig;
