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

// GET - Get single staff by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID staf diperlukan" },
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

    const staff = await collections.staff.findOne({
      _id: new ObjectId(id),
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform _id to id for frontend consistency
    const transformedStaff = {
      ...staff,
      id: staff._id.toString(),
      _id: undefined, // Remove _id to avoid confusion
    };

    return NextResponse.json({
      success: true,
      data: transformedStaff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update staff by ID
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
    const {
      name,
      position,
      department,
      email,
      phone,
      image,
      bio,
      education,
      experience,
      certifications,
      isActive,
    } = body;

    // Validation
    if (!name || !position || !department) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama, posisi, dan departemen diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if staff exists
    const existingStaff = await collections.staff.findOne({
      _id: new ObjectId(id),
    });
    if (!existingStaff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if email is used by another staff
    if (email) {
      const emailExists = await collections.staff.findOne({
        email,
        _id: { $ne: new ObjectId(id) },
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email sudah digunakan" },
          { status: 400 }
        );
      }
    }

    // Update staff
    const updateData = {
      name,
      position,
      department,
      email: email || "",
      phone: phone || "",
      image: image || "",
      bio: bio || "",
      education: education || "",
      experience: experience || 0,
      certifications: certifications || [],
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    const result = await collections.staff.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Staf berhasil diperbarui",
      data: { id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff by ID
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
        { success: false, message: "ID staf diperlukan" },
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

    // Check if staff exists
    const existingStaff = await collections.staff.findOne({
      _id: new ObjectId(id),
    });
    if (!existingStaff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hard delete (permanently remove from database)
    const result = await collections.staff.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Staf berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
