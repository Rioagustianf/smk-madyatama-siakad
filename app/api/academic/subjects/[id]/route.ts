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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    const subject = await collections.courses.findOne({
      _id: new ObjectId(id),
      isActive: true,
    });

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
  { params }: { params: { _id: string } }
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

    const { _id } = params;

    // Validate ObjectId format
    if (!ObjectId.isValid(_id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, code, description, credits, majorId, teacherId, semester } =
      body;

    // Validation
    if (!name || !code || !majorId || !teacherId) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama, kode, program keahlian, dan guru diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if subject exists
    const existingSubject = await collections.courses.findOne({
      _id: new ObjectId(_id),
    });
    if (!existingSubject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if code is used by another subject
    const codeExists = await collections.courses.findOne({
      code,
      _id: { $ne: new ObjectId(_id) },
    });
    if (codeExists) {
      return NextResponse.json(
        { success: false, message: "Kode mata pelajaran sudah digunakan" },
        { status: 400 }
      );
    }

    // Verify major exists
    const major = await collections.majors.findOne({
      _id: new ObjectId(majorId),
      isActive: true,
    });
    if (!major) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 400 }
      );
    }

    // Verify teacher exists
    const teacher = await collections.teachers.findOne({
      _id: new ObjectId(teacherId),
      isActive: true,
    });
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 400 }
      );
    }

    // Update subject
    const updateData = {
      name,
      code,
      description: description || "",
      credits: credits || 0,
      majorId: new ObjectId(majorId),
      teacherId: new ObjectId(teacherId),
      semester: semester || 1,
      updatedAt: new Date(),
    };

    const result = await collections.courses.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil diperbarui",
      data: { _id, ...updateData },
    });
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
  { params }: { params: { _id: string } }
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if subject exists
    const existingSubject = await collections.courses.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSubject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if subject has grades
    const gradesCount = await collections.grades.countDocuments({
      subjectId: new ObjectId(id),
    });
    if (gradesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tidak dapat menghapus mata pelajaran karena masih memiliki ${gradesCount} nilai`,
        },
        { status: 400 }
      );
    }

    // Check if subject has schedules
    const schedulesCount = await collections.schedules.countDocuments({
      subject: existingSubject.name,
    });
    if (schedulesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tidak dapat menghapus mata pelajaran karena masih memiliki ${schedulesCount} jadwal`,
        },
        { status: 400 }
      );
    }

    // Soft delete (set isActive to false)
    const result = await collections.courses.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

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
