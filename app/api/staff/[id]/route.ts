import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { storage } from "@/lib/supabase-client";

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
      role,
      position,
      image,
      bio,
      subject,
      quote,
      order,
      isActive,
    } = body;

    // Validation (minimal)
    if (!name || !position) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan jabatan diperlukan",
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

    // If image changed and old image was a Supabase public URL, delete the old file
    try {
      if (existingStaff.image && image && existingStaff.image !== image) {
        const parsed = storage.parsePublicUrl(existingStaff.image);
        if (parsed) {
          await storage.deleteFile(parsed.bucket, parsed.path);
        }
      }
    } catch (e) {
      console.warn("Warning: failed to delete old staff image:", e);
    }

    // Update staff with minimal schema
    const updateData = {
      name,
      role: role || existingStaff.role || "staff",
      position,
      image: image || "",
      bio: bio || "",
      subject: subject || "",
      quote: quote || "",
      order: typeof order === "number" ? order : existingStaff.order ?? 0,
      isActive:
        isActive !== undefined ? isActive : existingStaff.isActive ?? true,
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
      data: { _id: id, ...updateData },
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

    // Try deleting image from Supabase Storage if present
    try {
      if (existingStaff.image) {
        const parsed = storage.parsePublicUrl(existingStaff.image);
        if (parsed) {
          await storage.deleteFile(parsed.bucket, parsed.path);
        }
      }
    } catch (e) {
      console.warn("Warning: failed to delete staff image from storage:", e);
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
