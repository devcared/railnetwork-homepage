import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardClient from "./dashboard-client";
import type { Session } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to signin if not authenticated
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return (
    <DashboardLayout session={session}>
      <DashboardClient session={session} />
    </DashboardLayout>
  );
}
