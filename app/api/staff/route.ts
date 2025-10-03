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
    const position = searchParams.get("position") || "";
    const role = searchParams.get("role") || ""; // e.g., teacher
    const level = searchParams.get("level") || ""; // organizational level
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter (minimal fields)
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }
    if (position) {
      filter.position = position;
    }
    if (role) {
      filter.role = { $regex: role, $options: "i" };
    }
    if (level) {
      filter.level = { $regex: level, $options: "i" };
    }
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

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

    const collections = await getCollections();

    const newStaff = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.staff.insertOne(newStaff);

    return NextResponse.json({
      success: true,
      message: "Staf berhasil ditambahkan",
      data: { _id: result.insertedId, ...newStaff },
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
