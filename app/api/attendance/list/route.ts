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
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const className = searchParams.get("class");
    const subjectId = searchParams.get("subjectId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!className || !subjectId) {
      return NextResponse.json(
        { success: false, message: "Class and Subject ID required" },
        { status: 400 }
      );
    }

    // 1. Get Students in Class
    const students = await prisma.student.findMany({
      where: { class: className, isActive: true },
      orderBy: { name: "asc" },
    });

    // 2. Get Date
    let dateFilter = new Date();
    if (dateStr) {
      dateFilter = new Date(dateStr);
    }
    dateFilter.setHours(0, 0, 0, 0);

    // 3. Get Attendances
    const attendances = await prisma.attendance.findMany({
      where: {
        subjectId: subjectId,
        date: dateFilter,
        student: { class: className },
      },
    });

    // 4. Map
    const result = students.map((student) => {
      const attendance = attendances.find((a) => a.studentId === student.id);
      return {
        studentId: student.id,
        name: student.name,
        nisn: student.nisn,
        attendance: attendance || null, // null means ALPHA (Not Checked In)
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Attendance List Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
