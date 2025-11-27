import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import SettingsClient from "../settings-client";
import type { Session } from "next-auth";

export default async function SettingsTeamPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/settings/team");
  }

  return (
    <DashboardLayout session={session}>
      <SettingsClient session={session} />
    </DashboardLayout>
  );
}

