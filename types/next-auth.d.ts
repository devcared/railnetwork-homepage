import "next-auth";
import "next-auth/jwt";

/**
 * Erweitert die NextAuth-Typen, um das `id` Feld im User-Objekt zu unterstützen.
 * 
 * Dies ist notwendig, da NextAuth standardmäßig nur `name`, `email` und `image` 
 * im User-Objekt hat, aber wir auch `id` benötigen.
 */
declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

