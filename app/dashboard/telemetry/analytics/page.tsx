import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import TelemetryAnalyticsClient from "./telemetry-analytics-client";
import type { Session } from "next-auth";

export default async function TelemetryAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/telemetry/analytics");
  }

  return (
    <DashboardLayout session={session}>
      <TelemetryAnalyticsClient session={session} />
    </DashboardLayout>
  );
}
