import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getTeachersRepository, getClassesRepository } from "@/lib/database/repository";
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

// GET - Get single teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID guru diperlukan" },
        { status: 400 }
      );
    }

    const repo = getTeachersRepository();
    const teacher = await repo.findById(id);

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update teacher by ID
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
    const { name, username, phone, education, classes } = body;

    // Validation
    if (!name || !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan username guru diperlukan",
        },
        { status: 400 }
      );
    }

    const repo = getTeachersRepository();
    const existingTeacher = await repo.findById(id);
    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    try {
      const updated = await repo.update(id, {
        name,
        username,
        phone: phone || "",
        education: education || "",
        classes: classes || [],
      });

    return NextResponse.json({
      success: true,
      message: "Guru berhasil diperbarui",
      data: updated,
    });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Username sudah digunakan" },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error updating teacher:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete teacher by ID
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

    const repo = getTeachersRepository();
    const existingTeacher = await repo.findById(id);
    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if teacher is homeroom teacher for any class
    const classesRepo = getClassesRepository();
    const classesWithTeacher = await classesRepo.findMany({
      homeroomTeacherId: id,
      limit: 1,
    });
    if (classesWithTeacher.total > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Guru tidak dapat dihapus karena masih menjadi wali kelas",
        },
        { status: 400 }
      );
    }

    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Guru berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
