import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getSchedulesRepository } from "@/lib/database/repository";
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
    const limit = parseInt(searchParams.get("limit") || "100");
    const classFilter = searchParams.get("class") || undefined;
    const teacherFilter = searchParams.get("teacher") || undefined;

    const repo = getSchedulesRepository();
    const { data, total } = await repo.findMany({
      search,
      classFilter,
      teacherFilter,
      isActive: true,
      page,
      limit,
    });

    // Group schedules by class
    const groupedSchedules = data.reduce((acc, schedule) => {
      const className = schedule.class;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(schedule);
      return acc;
    }, {} as Record<string, any[]>);

    const scheduleGroups = Object.entries(groupedSchedules).map(
      ([className, schedules]) => ({
        className,
        schedules,
        totalSchedules: (schedules as any[]).length,
      })
    );

    return NextResponse.json({
      success: true,
      data,
      groupedData: scheduleGroups,
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

    const repo = getSchedulesRepository();
    const created = await repo.create({
      day,
      time,
      subject,
      class: className,
      teacher: teacher || "",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil ditambahkan",
      data: created,
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
