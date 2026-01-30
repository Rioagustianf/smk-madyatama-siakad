import { NextRequest, NextResponse } from "next/server";
import { getMajorAlumniRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT - Update Alumni
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, photo, workAt } = body;

    const repo = getMajorAlumniRepository();

    // Check exist
    const existing = await repo.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Data alumni tidak ditemukan" },
        { status: 404 },
      );
    }

    const updated = await repo.update(id, {
      name: name || undefined,
      photo: photo || undefined,
      workAt: workAt || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Data alumni berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete Alumni
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;
    const repo = getMajorAlumniRepository();

    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Data alumni berhasil dihapus",
    });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}
