import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import TelemetrySensorsClient from "./telemetry-sensors-client";
import type { Session } from "next-auth";

export default async function TelemetrySensorsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/telemetry/sensors");
  }

  return (
    <DashboardLayout session={session}>
      <TelemetrySensorsClient session={session} />
    </DashboardLayout>
  );
}
