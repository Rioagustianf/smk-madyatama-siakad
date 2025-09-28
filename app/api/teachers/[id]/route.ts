import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    const teacher = await collections.teachers.findOne({
      _id: new ObjectId(id),
      isActive: true,
    });

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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

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

    const collections = await getCollections();

    // Check if teacher exists
    const existingTeacher = await collections.teachers.findOne({
      _id: new ObjectId(id),
    });
    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if username is used by another teacher
    const usernameExists = await collections.teachers.findOne({
      username,
      _id: { $ne: new ObjectId(id) },
    });
    if (usernameExists) {
      return NextResponse.json(
        { success: false, message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Update teacher
    const updateData = {
      name,
      username,
      phone: phone || "",
      education: education || "",
      classes: classes || [],
      updatedAt: new Date(),
    };

    const result = await collections.teachers.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guru berhasil diperbarui",
      data: { _id: id, ...updateData },
    });
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if teacher exists
    const existingTeacher = await collections.teachers.findOne({
      _id: new ObjectId(id),
    });
    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if teacher is assigned to any subjects
    const subjectsWithTeacher = await collections.subjects.countDocuments({
      teacherId: id,
    });
    if (subjectsWithTeacher > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Guru tidak dapat dihapus karena masih mengajar mata pelajaran",
        },
        { status: 400 }
      );
    }

    // Check if teacher is homeroom teacher for any class
    const classesWithTeacher = await collections.classes.countDocuments({
      homeroomTeacherId: id,
    });
    if (classesWithTeacher > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Guru tidak dapat dihapus karena masih menjadi wali kelas",
        },
        { status: 400 }
      );
    }

    // Soft delete teacher
    const result = await collections.teachers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

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
