import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import ReportsClient from "./reports-client";
import type { Session } from "next-auth";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/reports");
  }

  return (
    <DashboardLayout session={session}>
      <ReportsClient session={session} />
    </DashboardLayout>
  );
}

