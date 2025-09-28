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

// GET - Get all classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = { isActive: true };
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    // Get classes with homeroom teacher and major information using aggregation
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          homeroomTeacherObjectId: {
            $cond: {
              if: { $ne: ["$homeroomTeacherId", ""] },
              then: { $toObjectId: "$homeroomTeacherId" },
              else: null,
            },
          },
          majorObjectId: {
            $cond: {
              if: { $ne: ["$majorId", ""] },
              then: { $toObjectId: "$majorId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "homeroomTeacherObjectId",
          foreignField: "_id",
          as: "homeroomTeacher",
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "majorObjectId",
          foreignField: "_id",
          as: "major",
        },
      },
      {
        $addFields: {
          homeroomTeacher: { $arrayElemAt: ["$homeroomTeacher", 0] },
          major: { $arrayElemAt: ["$major", 0] },
        },
      },
      {
        $addFields: {
          homeroomTeacherName: "$homeroomTeacher.name",
          homeroomTeacherEducation: "$homeroomTeacher.education",
          majorName: "$major.name",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [classes, total] = await Promise.all([
      collections.classes.aggregate(pipeline).toArray(),
      collections.classes.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: classes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new class
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
    const { name, majorId, homeroomTeacherId } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama kelas diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if class name already exists
    const existingClass = await collections.classes.findOne({ name });
    if (existingClass) {
      return NextResponse.json(
        { success: false, message: "Nama kelas sudah digunakan" },
        { status: 400 }
      );
    }

    // Validate homeroom teacher if provided
    if (homeroomTeacherId) {
      const teacher = await collections.teachers.findOne({
        _id: new ObjectId(homeroomTeacherId),
      });
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Guru wali kelas tidak ditemukan" },
          { status: 400 }
        );
      }
    }

    // Create new class
    const newClass = {
      name,
      majorId: majorId || "",
      homeroomTeacherId: homeroomTeacherId || "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.classes.insertOne(newClass);

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil ditambahkan",
      data: { id: result.insertedId, ...newClass },
    });
  } catch (error) {
    console.error("Error creating class:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
