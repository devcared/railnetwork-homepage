import type { NextConfig } from "next";
import { writeFileSync } from "fs";
import { join } from "path";

// Generiere Build-Informationen zur Build-Zeit (nur einmal beim Build)
const buildTimestamp = new Date().toISOString();
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;

// Schreibe Build-Info in eine Datei, die zur Laufzeit gelesen werden kann
// Dies wird nur beim Build ausgeführt, nicht bei jedem Request
try {
  const buildInfoPath = join(process.cwd(), "lib", "build-info.ts");
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
