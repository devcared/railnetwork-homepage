import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";

import ConditionalLayout from "@/components/conditional-layout";
import UpdatePrompt from "@/components/update-prompt";
import { ThemeProvider } from "@/contexts/theme-context";
import { authOptions } from "@/lib/auth";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RailNetwork Platform",
  description:
    "Moderne Next.js-Experience mit TailwindCSS und NextAuth für RailNetwork.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--page-bg)] text-slate-900 dark:text-slate-100 antialiased w-full`}
      >
        <ThemeProvider>
          <ConditionalLayout session={session}>{children}</ConditionalLayout>
          <UpdatePrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
