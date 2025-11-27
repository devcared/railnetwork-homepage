import type { NextConfig } from "next";
import { writeFileSync } from "fs";
import { join } from "path";

// Generiere Build-Informationen zur Build-Zeit (nur beim Build, nicht im Dev-Modus!)
const buildTimestamp = new Date().toISOString();
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;

// Prüfe, ob wir im Build-Modus sind (nicht im Dev-Modus)
// NEXT_PHASE wird nur beim Build gesetzt, nicht beim Dev-Server
const isBuild = process.env.NEXT_PHASE === "phase-production-build" || 
                process.argv.includes("build");

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
  } catch (error) {
    console.warn("⚠️ Konnte build-info.ts nicht schreiben:", error);
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
