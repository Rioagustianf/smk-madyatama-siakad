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

// GET - Get all schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId") || "";
    const teacherId = searchParams.get("teacherId") || "";
    const day = searchParams.get("day") || "";
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { subjectId: { $regex: search, $options: "i" } },
        { teacherId: { $regex: search, $options: "i" } },
        { classId: { $regex: search, $options: "i" } },
        { room: { $regex: search, $options: "i" } },
      ];
    }
    if (classId) {
      filter.classId = classId;
    }
    if (teacherId) {
      filter.teacherId = teacherId;
    }
    if (day) {
      filter.day = day;
    }
    if (semester) {
      filter.semester = parseInt(semester);
    }
    if (year) {
      filter.year = parseInt(year);
    }
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Get schedules with pagination
    const [schedules, total] = await Promise.all([
      collections.schedules
        .find(filter)
        .sort({ day: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.schedules.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: schedules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new schedule
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
      subjectId,
      teacherId,
      classId,
      day,
      startTime,
      endTime,
      room,
      semester,
      year,
      isActive,
    } = body;

    // Validation
    if (
      !subjectId ||
      !teacherId ||
      !classId ||
      !day ||
      !startTime ||
      !endTime ||
      !room
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field jadwal diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check for time conflicts
    const conflictingSchedule = await collections.schedules.findOne({
      $and: [
        { classId },
        { day },
        { isActive: true },
        {
          $or: [
            {
              $and: [
                { startTime: { $lte: startTime } },
                { endTime: { $gt: startTime } },
              ],
            },
            {
              $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gte: endTime } },
              ],
            },
            {
              $and: [
                { startTime: { $gte: startTime } },
                { endTime: { $lte: endTime } },
              ],
            },
          ],
        },
      ],
    });

    if (conflictingSchedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Jadwal bertabrakan dengan jadwal yang sudah ada",
        },
        { status: 400 }
      );
    }

    // Create new schedule
    const newSchedule = {
      subjectId,
      teacherId,
      classId,
      day,
      startTime,
      endTime,
      room,
      semester: semester || 1,
      year: year || new Date().getFullYear(),
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.schedules.insertOne(newSchedule);

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil ditambahkan",
      data: { id: result.insertedId, ...newSchedule },
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
