import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/store";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as
    | "open"
    | "acknowledged"
    | "resolved"
    | undefined;

  const alerts = dataStore.getAlerts(status);

  return NextResponse.json({ alerts });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || "railnetwork-demo-user";

  try {
    const body = await request.json();
    const { title, message, severity, system } = body;

    if (!title || !message || !severity || !system) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const alert = dataStore.createAlert({
      title,
      message,
      severity,
      system,
      status: "open",
    });

    // Create notification
    dataStore.createNotification({
      title: "Neuer Alert",
      message: `${title} in ${system}`,
      type: severity === "critical" || severity === "high" ? "error" : "warning",
      userId: userId,
      actionUrl: `/dashboard/alerts/${alert.id}`,
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

