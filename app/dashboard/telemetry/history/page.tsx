import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import TelemetryHistoryClient from "./telemetry-history-client";
import type { Session } from "next-auth";

export default async function TelemetryHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/telemetry/history");
  }

  return (
    <DashboardLayout session={session}>
      <TelemetryHistoryClient session={session} />
    </DashboardLayout>
  );
}
