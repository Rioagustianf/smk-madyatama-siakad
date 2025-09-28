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

// GET - Get all staff
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const position = searchParams.get("position") || "";
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) {
      filter.department = department;
    }
    if (position) {
      filter.position = position;
    }
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Get staff with pagination
    const [staff, total] = await Promise.all([
      collections.staff
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.staff.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: staff,
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

    // Check if email already exists
    if (email) {
      const existingStaff = await collections.staff.findOne({ email });
      if (existingStaff) {
        return NextResponse.json(
          { success: false, message: "Email sudah digunakan" },
          { status: 400 }
        );
      }
    }

    // Create new staff
    const newStaff = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.staff.insertOne(newStaff);

    return NextResponse.json({
      success: true,
      message: "Staf berhasil ditambahkan",
      data: { id: result.insertedId, ...newStaff },
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
