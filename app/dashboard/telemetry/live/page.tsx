import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import TelemetryLiveClient from "./telemetry-live-client";
import type { Session } from "next-auth";

export default async function TelemetryLivePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/telemetry/live");
  }

  return (
    <DashboardLayout session={session}>
      <TelemetryLiveClient session={session} />
    </DashboardLayout>
  );
}
