import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import NetworkClient from "./network-client";
import type { Session } from "next-auth";

export default async function NetworkPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/network");
  }

  return (
    <DashboardLayout session={session}>
      <NetworkClient session={session} />
    </DashboardLayout>
  );
}

