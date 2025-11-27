"use client";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import DbNavbar from "@/components/db-navbar";
import DbFooter from "@/components/db-footer";

type ConditionalLayoutProps = {
  session: Session | null;
  children: React.ReactNode;
};

export default function ConditionalLayout({
  session,
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/signin";
  const isDashboardPage = pathname?.startsWith("/dashboard");

  // SignIn page has no layout
  if (isSignInPage) {
    return <>{children}</>;
  }

  // Dashboard pages use their own layout with sidebar
  if (isDashboardPage) {
    return <>{children}</>;
  }

  // All other pages use the standard layout with navbar and footer
  return (
    <>
      <DbNavbar session={session} />
      <main>{children}</main>
      <DbFooter />
    </>
  );
}

