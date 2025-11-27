import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import WorkshopClient from "../workshop-client";
import type { Session } from "next-auth";

export default async function WorkshopMaintenancePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/workshop/maintenance");
  }

  return (
    <DashboardLayout session={session}>
      <WorkshopClient session={session} />
    </DashboardLayout>
  );
}

