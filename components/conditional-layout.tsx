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

  if (isSignInPage) {
    return <>{children}</>;
  }

  return (
    <>
      <DbNavbar session={session} />
      <main>{children}</main>
      <DbFooter />
    </>
  );
}

