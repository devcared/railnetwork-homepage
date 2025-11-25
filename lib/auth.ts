import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const fallbackEmail = process.env.DEMO_USER_EMAIL ?? "demo@railnetwork.app";
const fallbackPassword = process.env.DEMO_USER_PASSWORD ?? "railnetwork";

// Generate a secret if not provided (for development only)
// In production, NEXTAUTH_SECRET must be set in Vercel environment variables
const getSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // Only use fallback in development
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️  NEXTAUTH_SECRET not set. Using fallback secret for development only."
    );
    return "railnetwork-dev-secret-change-in-production";
  }
  
  // In production, throw an error if secret is missing
  throw new Error(
    "NEXTAUTH_SECRET is required in production. Please set it in Vercel environment variables."
  );
};

export const authOptions: NextAuthOptions = {
  secret: getSecret(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: {
          label: "E-Mail",
          type: "email",
          placeholder: fallbackEmail,
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === fallbackEmail &&
          credentials?.password === fallbackPassword
        ) {
          return {
            id: "railnetwork-demo-user",
            name: "Rail Ops",
            email: fallbackEmail,
          };
        }

        return null;
      },
    }),
  ],
};

