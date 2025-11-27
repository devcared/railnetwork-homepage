import { NextResponse } from "next/server";

/**
 * API Route für Version-Check
 * 
 * Gibt die aktuelle Build-ID zurück, die bei jedem Deployment neu generiert wird.
 * 
 * Für Vercel: Die Build-ID wird automatisch bei jedem Deployment generiert.
 * Alternativ kann man auch eine Umgebungsvariable verwenden (z.B. VERCEL_GIT_COMMIT_SHA).
 */
export async function GET() {
  // Option 1: Next.js Build-ID (wird bei jedem Build neu generiert)
  // Diese ist in .next/BUILD_ID gespeichert, aber nicht direkt zugänglich
  // Wir nutzen stattdessen eine Kombination aus Timestamp und Git Commit (falls verfügbar)
  
  // Option 2: Vercel-spezifische Umgebungsvariablen
  const buildId = process.env.NEXT_BUILD_ID || 
                  process.env.VERCEL_GIT_COMMIT_SHA || 
                  process.env.BUILD_ID ||
                  `build-${Date.now()}`;
  
  // Option 3: Custom Version aus package.json (wird bei jedem Build aktualisiert)
  const version = process.env.APP_VERSION || "1.0.0";
  
  // Timestamp des aktuellen Builds (wird bei jedem Deployment neu gesetzt)
  const buildTimestamp = process.env.BUILD_TIMESTAMP || new Date().toISOString();
  
  return NextResponse.json({
    version,
    buildId,
    buildTimestamp,
    // Zusätzliche Info für Debugging
    timestamp: new Date().toISOString(),
  });
}

