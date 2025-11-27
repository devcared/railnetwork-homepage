import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";
import ProjectsClient from "../projects-client";
import type { Session } from "next-auth";

export default async function ProjectsArchivePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/projects/archive");
  }

  return (
    <DashboardLayout session={session}>
      <ProjectsClient session={session} />
    </DashboardLayout>
  );
}

