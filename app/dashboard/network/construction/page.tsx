import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import NetworkConstructionClient from "./network-construction-client";
import type { Session } from "next-auth";

export default async function NetworkConstructionPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/network/construction");
  }

  return (
    <DashboardLayout session={session}>
      <NetworkConstructionClient session={session} />
    </DashboardLayout>
  );
}
