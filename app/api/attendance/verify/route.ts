import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function getTeacherFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "teacher" && decoded.role !== "admin") return null; // Admin also can verify
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const teacherUser = await getTeacherFromToken(request);
    if (!teacherUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      attendanceId,
      studentId,
      subjectId,
      status,
      isVerified = true,
      notes,
    } = body;

    if (!attendanceId && (!studentId || !subjectId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Attendance ID or Student ID + Subject ID required",
        },
        { status: 400 }
      );
    }

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

    let updated;

    if (attendanceId) {
      // First check if the record exists
      const existingRecord = await prisma.attendance.findUnique({
        where: { id: attendanceId },
      });

      if (existingRecord) {
        // Update existing record
        updated = await prisma.attendance.update({
          where: { id: attendanceId },
          data: {
            status: status,
            isVerified: isVerified,
            verifiedBy: teacherUser.name || "Teacher",
            verifiedAt: new Date(),
            notes: notes,
          },
        });
      } else if (studentId && subjectId) {
        // Record not found by ID, try to find by studentId + subjectId + date or create new
        const existingByStudent = await prisma.attendance.findFirst({
          where: {
            studentId,
            subjectId,
            date: today,
          },
        });

        if (existingByStudent) {
          updated = await prisma.attendance.update({
            where: { id: existingByStudent.id },
            data: {
              status: status || existingByStudent.status,
              isVerified: isVerified,
              verifiedBy: teacherUser.name || "Teacher",
              verifiedAt: new Date(),
              notes: notes,
            },
          });
        } else {
          // Create new record
          updated = await prisma.attendance.create({
            data: {
              studentId,
              subjectId,
              date: today,
              status: status || "ABSENT",
              isVerified: isVerified,
              verifiedBy: teacherUser.name || "Teacher",
              verifiedAt: new Date(),
              notes: notes,
              timeIn: new Date(),
            },
          });
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Record attendance tidak ditemukan. Silakan berikan studentId dan subjectId untuk membuat record baru.",
          },
          { status: 404 }
        );
      }
    } else {
      // Try to find existing record first, then update or create
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId,
          subjectId,
          date: today,
        },
      });

      if (existing) {
        // Update existing record
        updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            status: status || existing.status,
            isVerified: isVerified,
            verifiedBy: teacherUser.name || "Teacher",
            verifiedAt: new Date(),
            notes: notes,
          },
        });
      } else {
        // Create new record
        updated = await prisma.attendance.create({
          data: {
            studentId,
            subjectId,
            date: today,
            status: status || "ABSENT", // Default to ABSENT for teacher verification
            isVerified: isVerified,
            verifiedBy: teacherUser.name || "Teacher",
            verifiedAt: new Date(),
            notes: notes,
            timeIn: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Absensi berhasil diverifikasi",
      data: updated,
    });
  } catch (error: any) {
    console.error("Attendance Verify Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
