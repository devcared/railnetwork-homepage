import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/store";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || "railnetwork-demo-user";
  const projects = dataStore.getProjects(userId);

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || "railnetwork-demo-user";

  try {
    const body = await request.json();
    const { name, description, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = dataStore.createProject({
      name,
      description,
      status: status || "active",
      progress: 0,
      ownerId: userId,
    });

    // Create notification
    dataStore.createNotification({
      title: "Neues Projekt erstellt",
      message: `Projekt '${name}' wurde erfolgreich erstellt`,
      type: "success",
      userId: userId,
      actionUrl: `/dashboard/projects/${project.id}`,
    });

    // Add activity
    dataStore.addActivity({
      action: `Neues Projekt erstellt: ${name}`,
      system: "Dashboard",
      status: "success",
      time: "Gerade eben",
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

