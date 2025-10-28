import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getTeachersRepository } from "@/lib/database/repository";
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

// GET - List teachers with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const repo = getTeachersRepository();
    const { data: teachers, total } = await repo.findMany({
      search,
      isActive: isActive === null || isActive === undefined ? undefined : isActive === "true",
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new teacher
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
    try {
      const created = await repo.create({
        name,
        username,
        phone: phone || "",
        education: education || "",
        subjects: [],
        classes: classes || [],
        isActive: true,
        role: "teacher",
      });

    return NextResponse.json({
      success: true,
      message: "Guru berhasil ditambahkan",
      data: created,
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
    console.error("Error creating teacher:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
