import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import WorkshopFleetClient from "./workshop-fleet-client";
import type { Session } from "next-auth";

export default async function WorkshopFleetPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/workshop/fleet");
  }

  return (
    <DashboardLayout session={session}>
      <WorkshopFleetClient session={session} />
    </DashboardLayout>
  );
}
