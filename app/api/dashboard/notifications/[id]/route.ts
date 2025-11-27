import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || "railnetwork-demo-user";
  const { id } = await params;

  try {
    const body = await request.json();

    if (body.read !== undefined) {
      const success = dataStore.markNotificationAsRead(id, userId);
      if (!success) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id || "railnetwork-demo-user";
  const { id } = await params;
  const deleted = dataStore.deleteNotification(id, userId);

  if (!deleted) {
    return NextResponse.json(
      { error: "Notification not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

