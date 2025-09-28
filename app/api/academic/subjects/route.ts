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

// GET - Get all subjects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const majorId = searchParams.get("majorId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (majorId) {
      filter.majorId = new ObjectId(majorId);
    }

    // Get subjects with pagination
    const [subjects, total] = await Promise.all([
      collections.courses
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.courses.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: subjects,
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

    // Check if code already exists
    const existingSubject = await collections.courses.findOne({ code });
    if (existingSubject) {
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

    // Create new subject
    const newSubject = {
      name,
      code,
      description: description || "",
      credits: credits || 0,
      majorId: new ObjectId(majorId),
      teacherId: new ObjectId(teacherId),
      semester: semester || 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.courses.insertOne(newSubject);

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil ditambahkan",
      data: { id: result.insertedId, ...newSubject },
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
