import { NextResponse } from "next/server";

/**
 * API Route für Version-Check
 * 
 * Gibt die aktuelle Build-ID zurück, die bei jedem Deployment neu generiert wird.
 * 
 * Für Vercel: Die Build-ID wird automatisch bei jedem Deployment generiert.
 * Die Build-ID wird aus der build-info.ts Datei gelesen, die zur Build-Zeit generiert wird.
 */
export async function GET() {
  // Versuche Build-Informationen aus build-info.ts zu lesen
  // Fallback für Dev-Modus, wenn die Datei noch nicht existiert
  let buildId: string;
  let buildTimestamp: string;
  let version: string;
  let source: string = "unknown";

  try {
    const { BUILD_ID, BUILD_TIMESTAMP, APP_VERSION } = await import("@/lib/build-info");
    buildId = BUILD_ID;
    buildTimestamp = BUILD_TIMESTAMP;
    version = APP_VERSION;
    source = "build-info.ts";
  } catch {
    // Fallback: Nutze Vercel-Umgebungsvariablen oder generiere dynamisch
    // Auf Vercel sollte VERCEL_GIT_COMMIT_SHA immer verfügbar sein
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      buildId = process.env.VERCEL_GIT_COMMIT_SHA;
      buildTimestamp = process.env.VERCEL_BUILD_TIMESTAMP || new Date().toISOString();
      version = process.env.npm_package_version || "1.0.0";
      source = "vercel-env";
    } else {
      // Dev-Modus Fallback
      buildId = `dev-${Date.now()}`;
      buildTimestamp = new Date().toISOString();
      version = process.env.npm_package_version || "0.1.0";
      source = "dev-fallback";
    }
  }
  
  return NextResponse.json({
    version,
    buildId,
    buildTimestamp,
    // Zusätzliche Info für Debugging
    timestamp: new Date().toISOString(),
    source, // Debug: Woher die Build-Info kommt
  }, {
    // Wichtig: Kein Caching, damit immer die neueste Version zurückgegeben wird
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

