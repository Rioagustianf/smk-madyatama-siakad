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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = { isActive: true };

    // Add specific filters
    const classFilter = searchParams.get("class");
    const teacherFilter = searchParams.get("teacher");

    if (classFilter) {
      filter.class = classFilter;
    }

    if (teacherFilter) {
      filter.teacher = teacherFilter;
    }

    if (search) {
      filter.$or = [
        { day: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { class: { $regex: search, $options: "i" } },
        { teacher: { $regex: search, $options: "i" } },
      ];
    }

    // Get all schedules first for proper grouping
    const allSchedules = await collections.schedules
      .find(filter)
      .sort({
        class: 1,
        day: 1,
        time: 1,
      })
      .toArray();

    // Group schedules by class
    const groupedSchedules = allSchedules.reduce((acc, schedule) => {
      const className = schedule.class;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(schedule);
      return acc;
    }, {} as Record<string, any[]>);

    // Convert grouped data to array format for pagination
    const scheduleGroups = Object.entries(groupedSchedules).map(
      ([className, schedules]) => ({
        className,
        schedules,
        totalSchedules: schedules.length,
      })
    );

    // Apply pagination to groups
    const totalGroups = scheduleGroups.length;
    const paginatedGroups = scheduleGroups.slice(skip, skip + limit);

    // Flatten schedules for response
    const schedules = paginatedGroups.flatMap((group) => group.schedules);
    const total = allSchedules.length;

    return NextResponse.json({
      success: true,
      data: schedules,
      groupedData: paginatedGroups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(totalGroups / limit),
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
    const { day, time, subject, class: className, teacher } = body;

    // Validation
    if (!day || !time || !subject || !className) {
      return NextResponse.json(
        {
          success: false,
          message: "Hari, waktu, mata pelajaran, dan kelas diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Create new schedule
    const newSchedule = {
      day,
      time,
      subject,
      class: className,
      teacher: teacher || "",
      isActive: true,
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
