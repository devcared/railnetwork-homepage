import { NextResponse } from "next/server";
import { BUILD_ID, BUILD_TIMESTAMP, APP_VERSION } from "@/lib/build-info";

/**
 * API Route für Version-Check
 * 
 * Gibt die aktuelle Build-ID zurück, die bei jedem Deployment neu generiert wird.
 * 
 * Für Vercel: Die Build-ID wird automatisch bei jedem Deployment generiert.
 * Die Build-ID wird aus der build-info.ts Datei gelesen, die zur Build-Zeit generiert wird.
 */
export async function GET() {
  // Nutze die Build-Informationen, die zur Build-Zeit gesetzt wurden
  const buildId = BUILD_ID;
  const buildTimestamp = BUILD_TIMESTAMP;
  const version = APP_VERSION;
  
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

