import { NextRequest, NextResponse } from "next/server";
import { getMajorAlumniRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET - List Alumni by Major ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Jurusan diperlukan" },
        { status: 400 },
      );
    }

    const repo = getMajorAlumniRepository();
    const { data: alumni } = await repo.findMany({ majorId: id });

    return NextResponse.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}

// POST - Create Alumni
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin
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

    if (!name || !workAt) {
      return NextResponse.json(
        { success: false, message: "Nama dan Pekerjaan/Status wajib diisi" },
        { status: 400 },
      );
    }

    const repo = getMajorAlumniRepository();
    const newAlumni = await repo.create({
      name,
      photo: photo || null,
      workAt,
      majorId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Data alumni berhasil ditambahkan",
      data: newAlumni,
    });
  } catch (error) {
    console.error("Error creating alumni:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}
