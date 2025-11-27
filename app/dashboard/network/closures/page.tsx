import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import NetworkClosuresClient from "./network-closures-client";
import type { Session } from "next-auth";

export default async function NetworkClosuresPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/network/closures");
  }

  return (
    <DashboardLayout session={session}>
      <NetworkClosuresClient session={session} />
    </DashboardLayout>
  );
}
