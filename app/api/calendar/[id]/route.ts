import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getAcademicEventsRepository } from "@/lib/database/repository";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyAdminToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = getAcademicEventsRepository();
    const event = await repo.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminData = await verifyAdminToken(token);
    if (!adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const repo = getAcademicEventsRepository();

    const updated = await repo.update(params.id, {
      title: body.title,
      description: body.description,
      type: body.type,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      isPublished: body.isPublished,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminData = await verifyAdminToken(token);
    if (!adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = getAcademicEventsRepository();
    await repo.remove(params.id);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
