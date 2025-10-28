import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getSubjectsRepository, getTeachersRepository } from "@/lib/database/repository";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Prevent static generation
export const dynamic = "force-dynamic";

// Helper function to verify admin token
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
  } catch (error) {
    return { error: "Token tidak valid", status: 401 };
  }
}

// GET - Get single subject by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID mata pelajaran diperlukan" },
        { status: 400 }
      );
    }

    const repo = getSubjectsRepository();
    const subject = await repo.findById(id);

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update subject by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    const body = await request.json();
    const { name, code, description, teacherId } = body;

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan kode mata pelajaran diperlukan",
        },
        { status: 400 }
      );
    }

    const repo = getSubjectsRepository();
    const existingSubject = await repo.findById(id);
    if (!existingSubject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validate teacher if provided
    if (teacherId) {
      const teachersRepo = getTeachersRepository();
      const teacher = await teachersRepo.findById(teacherId);
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Guru tidak ditemukan" },
          { status: 400 }
        );
      }
    }

    try {
      const updated = await repo.update(id, {
        name,
        code,
        description: description || "",
        teacherId: teacherId || null,
      });

      return NextResponse.json({
        success: true,
        message: "Mata pelajaran berhasil diperbarui",
        data: updated,
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Kode mata pelajaran sudah digunakan" },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error updating subject:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete subject by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID mata pelajaran diperlukan" },
        { status: 400 }
      );
    }

    const repo = getSubjectsRepository();
    const existingSubject = await repo.findById(id);
    if (!existingSubject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // TODO: Add business validation for grades/schedules if needed
    // For now, soft delete via repository
    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
