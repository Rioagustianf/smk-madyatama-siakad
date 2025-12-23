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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updated;

    if (attendanceId) {
      // Update existing
      updated = await prisma.attendance.update({
        where: { id: attendanceId },
        data: {
          status: status,
          isVerified: isVerified,
          verifiedBy: teacherUser.name || "Teacher",
          verifiedAt: new Date(),
          notes: notes, // Allow updating notes if provided
        },
      });
    } else {
      // Upsert (Create or Update if exists by unique constraint)
      updated = await prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId,
            subjectId,
            date: today,
          },
        },
        create: {
          studentId,
          subjectId,
          date: today,
          status: status || "PRESENT", // Default to PRESENT if not specified
          isVerified: isVerified,
          verifiedBy: teacherUser.name || "Teacher",
          verifiedAt: new Date(),
          notes: notes,
          timeIn: new Date(), // Set timeIn to now
        },
        update: {
          status: status,
          isVerified: isVerified,
          verifiedBy: teacherUser.name || "Teacher",
          verifiedAt: new Date(),
          notes: notes,
        },
      });
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
