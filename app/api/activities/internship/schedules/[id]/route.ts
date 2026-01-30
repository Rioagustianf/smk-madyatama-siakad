import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getInternshipSchedulesRepository } from "@/lib/database/repository";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const dynamic = "force-dynamic";

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 };
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return {
        error: "Akses ditolak. Hanya admin yang dapat mengakses",
        status: 403,
      };
    }
    return { user: decoded };
  } catch {
    return { error: "Token tidak valid", status: 401 };
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status },
      );
    const { id } = await params;
    const body = await request.json();
    const { program, period, notes, className } = body;

    // Transform frontend fields to Prisma schema fields
    const updateData: any = {};

    // program maps to class
    if (program !== undefined || className !== undefined) {
      updateData.class = className || program;
    }

    // Combine period and notes for storage
    if (period !== undefined || notes !== undefined) {
      updateData.notes = [period, notes].filter(Boolean).join(" - ");
    }

    const repo = getInternshipSchedulesRepository();
    const updated = await repo.update(id, updateData);
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    return NextResponse.json({
      success: true,
      message: "Jadwal prakerin diperbarui",
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status },
      );
    const { id } = await params;
    const repo = getInternshipSchedulesRepository();
    await repo.remove(id);
    return NextResponse.json({
      success: true,
      message: "Jadwal prakerin dihapus",
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
