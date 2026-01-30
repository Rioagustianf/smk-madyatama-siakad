import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getStaffRepository } from "@/lib/database/repository";
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID staf diperlukan" },
        { status: 400 },
      );
    }

    const repo = getStaffRepository();
    const staff = await repo.findById(id);

    if (!staff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}

// PUT - Update staff by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      name,
      username,
      role,
      position,
      department,
      phone,
      email,
      image,
      bio,
      isActive,
    } = body;

    // Validation (minimal)
    if (!name || !position) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan jabatan diperlukan",
        },
        { status: 400 },
      );
    }

    const repo = getStaffRepository();
    const existingStaff = await repo.findById(id);
    if (!existingStaff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 },
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

    const updated = await repo.update(id, {
      name,
      username: username || existingStaff.username,
      role: role || existingStaff.role || "staff",
      position,
      department: department || existingStaff.department || "",
      phone: phone || existingStaff.phone || "",
      email: email || existingStaff.email || "",
      image: image || "",
      bio: bio || "",
      isActive:
        isActive !== undefined ? isActive : (existingStaff.isActive ?? true),
    });

    return NextResponse.json({
      success: true,
      message: "Staf berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete staff by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID staf diperlukan" },
        { status: 400 },
      );
    }

    const repo = getStaffRepository();
    const existingStaff = await repo.findById(id);
    if (!existingStaff) {
      return NextResponse.json(
        { success: false, message: "Staf tidak ditemukan" },
        { status: 404 },
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

    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Staf berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}
