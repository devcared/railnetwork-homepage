import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import InventoryOrdersClient from "./inventory-orders-client";
import type { Session } from "next-auth";

export default async function InventoryOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/inventory/orders");
  }

  return (
    <DashboardLayout session={session}>
      <InventoryOrdersClient session={session} />
    </DashboardLayout>
  );
}
