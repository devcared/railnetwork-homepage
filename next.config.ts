import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Generiere eine Build-ID basierend auf Timestamp
  generateBuildId: async () => {
    // Für Vercel: Nutze den Git Commit SHA falls verfügbar
    // Sonst: Nutze Timestamp
    const buildId = process.env.VERCEL_GIT_COMMIT_SHA || 
                    `build-${Date.now()}`;
    return buildId;
  },
  
  // Setze Umgebungsvariablen für Version-Check
  env: {
    BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`,
    BUILD_TIMESTAMP: new Date().toISOString(),
    APP_VERSION: process.env.npm_package_version || "1.0.0",
  },
};

export default nextConfig;
