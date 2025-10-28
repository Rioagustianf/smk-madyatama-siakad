import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getStaffRepository } from "@/lib/database/repository";
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

// GET - Get all staff
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const position = searchParams.get("position") || "";
    const role = searchParams.get("role") || ""; // e.g., teacher
    const level = searchParams.get("level") || ""; // organizational level
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const repo = getStaffRepository();
    const { data, total } = await repo.findMany({
      search,
      position: position || undefined,
      role: role || undefined,
      level: level || undefined,
      isActive:
        isActive !== null && isActive !== undefined
          ? isActive === "true"
          : undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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

// POST - Create new staff
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
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
      level,
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

    const repo = getStaffRepository();
    const created = await repo.create({
      name,
      role: role || "staff",
      position,
      image: image || "",
      bio: bio || "",
      subject: subject || "",
      quote: quote || "",
      order: typeof order === "number" ? order : 0,
      level: level || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      message: "Staf berhasil ditambahkan",
      data: created,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
