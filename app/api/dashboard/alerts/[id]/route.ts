import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dataStore } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const alert = dataStore.getAlert(id);

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  return NextResponse.json({ alert });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const alert = dataStore.getAlert(id);

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updatedAlert = dataStore.updateAlert(id, body);

    if (!updatedAlert) {
      return NextResponse.json(
        { error: "Failed to update alert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ alert: updatedAlert });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

