import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import InventorySuppliersClient from "./inventory-suppliers-client";
import type { Session } from "next-auth";

export default async function InventorySuppliersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/inventory/suppliers");
  }

  return (
    <DashboardLayout session={session}>
      <InventorySuppliersClient session={session} />
    </DashboardLayout>
  );
}
