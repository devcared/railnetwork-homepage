import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const fallbackEmail = process.env.DEMO_USER_EMAIL ?? "demo@railnetwork.app";
const fallbackPassword = process.env.DEMO_USER_PASSWORD ?? "railnetwork";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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

