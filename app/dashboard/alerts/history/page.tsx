import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import AlertsClient from "../alerts-client";
import type { Session } from "next-auth";

export default async function AlertsHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/alerts/history");
  }

  return (
    <DashboardLayout session={session}>
      <AlertsClient session={session} />
    </DashboardLayout>
  );
}

