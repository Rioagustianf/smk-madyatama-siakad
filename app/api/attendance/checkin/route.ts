import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getDistance } from "geolib";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper to get student from token
async function getStudentFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Check if user is student
    if (decoded.role !== "student") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentUser = await getStudentFromToken(request);
    if (!studentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get input
    const body = await request.json();
    const {
      subjectId,
      latitude,
      longitude,
      photoUrl,
      status = "PRESENT",
      notes,
      scheduleTime,
    } = body;

    // Basic Validation
    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID is required" },
        { status: 400 }
      );
    }

    // Get Attendance Settings
    let settings = await prisma.attendanceSettings.findFirst();
    if (!settings) {
      // Create default if missing
      settings = await prisma.attendanceSettings.create({
        data: {
          schoolName: "SMK Madyatama",
          latitude: -6.17511, // Default Monas
          longitude: 106.865036,
          radius: 100,
        },
      });
    }

    // 1. Check Radius (Only if PRESENT)
    if (status === "PRESENT") {
      if (!latitude || !longitude || !photoUrl) {
        return NextResponse.json(
          {
            success: false,
            message: "Location and Selfie required for Presence",
          },
          { status: 400 }
        );
      }

      const studentLat = parseFloat(latitude);
      const studentLng = parseFloat(longitude);
      const schoolLat = settings.latitude;
      const schoolLng = settings.longitude;

      console.log("📍 Radius Check:", {
        student: { lat: studentLat, lng: studentLng },
        school: { lat: schoolLat, lng: schoolLng },
        radius: settings.radius,
      });

      const distance = getDistance(
        { latitude: studentLat, longitude: studentLng },
        { latitude: schoolLat, longitude: schoolLng }
      );

      console.log(`📏 Distance calculated: ${distance}m`);

      if (distance > settings.radius) {
        return NextResponse.json(
          {
            success: false,
            message: `Diluar radius sekolah! Jarak: ${distance}m (Max: ${settings.radius}m)\n\nLokasi Anda: ${studentLat}, ${studentLng}\nLokasi Sekolah: ${schoolLat}, ${schoolLng}`,
          },
          { status: 400 }
        );
      }

      // 2. Validate Time Window (based on schedule time)
      // Skip validation if SKIP_SCHEDULE_VALIDATION=true (for testing only)
      console.log("Environment Check:", {
        SKIP: process.env.SKIP_SCHEDULE_VALIDATION,
        NEXT_PUBLIC_SKIP: process.env.NEXT_PUBLIC_SKIP_SCHEDULE_VALIDATION,
      });

      const skipScheduleValidation =
        process.env.SKIP_SCHEDULE_VALIDATION === "true" ||
        process.env.NEXT_PUBLIC_SKIP_SCHEDULE_VALIDATION === "true";

      if (scheduleTime && !skipScheduleValidation) {
        // Parse scheduleTime format: "07:00-08:00" or "07:00 - 08:00"
        const timeMatch = scheduleTime.match(
          /(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/
        );
        if (timeMatch) {
          const [_, startHour, startMin, endHour, endMin] = timeMatch;
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
          const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);

          // Allow check-in from 15 minutes before until end of class
          const allowedStart = startMinutes - 15;
          const allowedEnd = endMinutes;

          if (currentMinutes < allowedStart || currentMinutes > allowedEnd) {
            return NextResponse.json(
              {
                success: false,
                message: `Absensi hanya bisa dilakukan pada jam pelajaran (${scheduleTime}). Sekarang: ${now
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${now
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // 3. Check Duplicate
    // ROBUST WIB (Asia/Jakarta) Calculation
    const nowCtx = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(nowCtx);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    // Force create 00:00:00 UTC Date for the WIB day
    const today = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    console.log("DEBUG DATE CHECK (ROBUST):", {
      serverTimeUTC: nowCtx.toISOString(),
      wibParts: { year, month, day },
      finalDateToDB: today.toISOString(),
    });

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: studentUser.id,
        subjectId: subjectId,
        date: today,
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Sudah absen untuk mapel ini hari ini" },
        { status: 400 }
      );
    }

    // 4. Create Attendance
    let attendance;
    try {
      attendance = await prisma.attendance.create({
        data: {
          studentId: studentUser.id,
          subjectId: subjectId,
          date: today,
          timeIn: new Date(),
          status: status, // PRESENT, SICK, PERMISSION
          latitude: status === "PRESENT" ? parseFloat(latitude) : null,
          longitude: status === "PRESENT" ? parseFloat(longitude) : null,
          photoUrl: photoUrl || null,
          notes: notes || null,
          isVerified: false,
        },
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Sudah absen untuk mapel ini hari ini" },
          { status: 400 }
        );
      }
      throw e;
    }

    return NextResponse.json({
      success: true,
      message: "Absensi berhasil dicatat",
      data: attendance,
    });
  } catch (error: any) {
    console.error("Attendance Checkin Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
