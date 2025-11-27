import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import ProjectDetailClient from "./project-detail-client";
import type { Session } from "next-auth";
import { dataStore } from "@/lib/store";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/projects");
  }

  const { id } = await params;
  const userId = session.user?.id || "railnetwork-demo-user";
  const project = dataStore.getProject(id);

  if (!project || project.ownerId !== userId) {
    notFound();
  }

  return (
    <DashboardLayout session={session}>
      <ProjectDetailClient session={session} projectId={id} />
    </DashboardLayout>
  );
}

