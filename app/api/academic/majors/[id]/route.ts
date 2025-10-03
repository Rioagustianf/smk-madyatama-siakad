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

// GET - Get single major by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID program keahlian diperlukan" },
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

    const major = await collections.majors.findOne({
      _id: new ObjectId(id),
    });

    if (!major) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform _id to id for frontend consistency
    const transformedMajor = {
      ...major,
      id: major._id.toString(),
      _id: undefined, // Remove _id to avoid confusion
    };

    return NextResponse.json({
      success: true,
      data: transformedMajor,
    });
  } catch (error) {
    console.error("Error fetching major:", error);
    return handleDatabaseError(error);
  }
}

// PUT - Update major by ID
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
    const { name, code, description, image, facilities, careerProspects } =
      body;

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan kode program keahlian diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if major exists
    const existingMajor = await collections.majors.findOne({
      _id: new ObjectId(id),
    });
    if (!existingMajor) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if code is used by another major
    const codeExists = await collections.majors.findOne({
      code,
      _id: { $ne: new ObjectId(id) },
    });
    if (codeExists) {
      return NextResponse.json(
        { success: false, message: "Kode program keahlian sudah digunakan" },
        { status: 400 }
      );
    }

    // Update major
    const updateData = {
      name,
      code,
      description: description || "",
      image: image || "",
      facilities: facilities || [],
      careerProspects: careerProspects || [],
      updatedAt: new Date(),
    };

    const result = await collections.majors.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program keahlian berhasil diperbarui",
      data: { id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating major:", error);
    return handleDatabaseError(error);
  }
}

// DELETE - Delete major by ID
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
        { success: false, message: "ID program keahlian diperlukan" },
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

    // Check if major exists
    const existingMajor = await collections.majors.findOne({
      _id: new ObjectId(id),
    });
    if (!existingMajor) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if major has students
    const studentsCount = await collections.students.countDocuments({
      major: existingMajor.name,
    });
    if (studentsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Tidak dapat menghapus program keahlian karena masih memiliki ${studentsCount} siswa`,
        },
        { status: 400 }
      );
    }

    // Hard delete (permanently remove from database)
    const result = await collections.majors.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program keahlian berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting major:", error);
    return handleDatabaseError(error);
  }
}
