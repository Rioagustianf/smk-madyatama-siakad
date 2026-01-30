import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin" && decoded.role !== "teacher") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const classFilter = searchParams.get("class");

    // Parse the date string into start and end of day for proper querying
    let startOfDay: Date;
    let endOfDay: Date;

    if (dateStr) {
      // Parse user input date as-is (e.g., "2026-01-30")
      // Create date range for the entire day
      startOfDay = new Date(dateStr + "T00:00:00.000Z");
      endOfDay = new Date(dateStr + "T23:59:59.999Z");
    } else {
      // Default to today
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
      startOfDay = new Date(todayStr + "T00:00:00.000Z");
      endOfDay = new Date(todayStr + "T23:59:59.999Z");
    }

    // Build where clause with date range
    const where: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (classFilter) {
      where.student = {
        class: classFilter,
      };
    }

    // Get all attendance records for the date
    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nisn: true,
            class: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { timeIn: "desc" }, // Simplified orderBy - sort by time instead
    });

    // Debug logging
    console.log("Monitoring API - Date range:", {
      start: startOfDay,
      end: endOfDay,
    });
    console.log("Monitoring API - Found attendances:", attendances.length);
    if (attendances.length > 0) {
      console.log("Sample record:", JSON.stringify(attendances[0], null, 2));
    }

    // Get summary statistics
    const total = attendances.length;
    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const sick = attendances.filter((a) => a.status === "SICK").length;
    const permission = attendances.filter(
      (a) => a.status === "PERMISSION",
    ).length;
    const alpha = attendances.filter((a) => a.status === "ALPHA").length;
    const verified = attendances.filter((a) => a.isVerified).length;
    const pending = total - verified;

    return NextResponse.json({
      success: true,
      data: attendances,
      summary: {
        total,
        present,
        sick,
        permission,
        alpha,
        verified,
        pending,
      },
    });
  } catch (error: any) {
    console.error("Monitoring Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
