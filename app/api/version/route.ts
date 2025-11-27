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

  try {
    const { BUILD_ID, BUILD_TIMESTAMP, APP_VERSION } = await import("@/lib/build-info");
    buildId = BUILD_ID;
    buildTimestamp = BUILD_TIMESTAMP;
    version = APP_VERSION;
  } catch (error) {
    // Fallback für Dev-Modus oder wenn build-info.ts nicht existiert
    buildId = process.env.VERCEL_GIT_COMMIT_SHA || `dev-${Date.now()}`;
    buildTimestamp = new Date().toISOString();
    version = process.env.npm_package_version || "0.1.0";
  }
  
  return NextResponse.json({
    version,
    buildId,
    buildTimestamp,
    // Zusätzliche Info für Debugging
    timestamp: new Date().toISOString(),
  }, {
    // Wichtig: Kein Caching, damit immer die neueste Version zurückgegeben wird
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

