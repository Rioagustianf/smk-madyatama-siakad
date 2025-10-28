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

// GET - Get all subjects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const teacherId = searchParams.get("teacherId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const repo = getSubjectsRepository();
    const { data, total } = await repo.findMany({
      search,
      teacherId: teacherId || undefined,
      isActive: true,
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
    console.error("Error fetching subjects:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new subject
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
      const created = await repo.create({
        name,
        code,
        description: description || "",
        teacherId: teacherId || null,
        isActive: true,
      });

      return NextResponse.json({
        success: true,
        message: "Mata pelajaran berhasil ditambahkan",
        data: created,
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
    console.error("Error creating subject:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
