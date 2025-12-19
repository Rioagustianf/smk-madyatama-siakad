import { NextRequest, NextResponse } from "next/server";
import { getExamSchedulesRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyToken(token: string | null | undefined) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = getExamSchedulesRepository();
    const data = await repo.findById(params.id);

    if (!data) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data,
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
    const user = await verifyToken(token);

    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const repo = getExamSchedulesRepository();

    const updated = await repo.update(params.id, {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
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
    const user = await verifyToken(token);

    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = getExamSchedulesRepository();
    await repo.remove(params.id);

    return NextResponse.json({
      success: true,
      message: "Exam schedule deleted successfully",
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
