import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import AlertDetailClient from "./alert-detail-client";
import type { Session } from "next-auth";
import { dataStore } from "@/lib/store";

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ alertNr: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/alerts");
  }

  const { alertNr } = await params;
  const alert = dataStore.getAlert(alertNr);

  if (!alert) {
    notFound();
  }

  return (
    <DashboardLayout session={session}>
      <AlertDetailClient session={session} alertId={alertNr} />
    </DashboardLayout>
  );
}

