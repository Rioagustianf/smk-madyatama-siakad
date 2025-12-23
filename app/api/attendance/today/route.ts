import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function getStudentFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "student") return null;
    return decoded;
  } catch {
    return null;
  }
}

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export async function GET(request: NextRequest) {
  try {
    const studentUser = await getStudentFromToken(request);
    if (!studentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1. Get Student Data (to know Class)
    const student = await prisma.student.findUnique({
      where: { id: studentUser.id },
    });

    if (!student || !student.class) {
      return NextResponse.json(
        { success: false, message: "Class not found for student" },
        { status: 404 }
      );
    }

    // 2. Get Today's Day
    const today = new Date();
    const dayName = dayNames[today.getDay()];
    // const dayName = "Senin"; // For testing

    // 3. Get Schedules
    const schedules = await prisma.schedule.findMany({
      where: {
        class: student.class,
        day: dayName,
        isActive: true,
      },
    });

    // 4. Enrich with Subject ID and Attendance Status
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const enrichedSchedules = await Promise.all(
      schedules.map(async (sched) => {
        // Subject name mapping for legacy schedule names
        const subjectAliases: Record<string, string> = {
          SENAM: "SENAM",
          UPACARA: "UPACARA",
          Adminfrajar: "AIJ",
          Teklayjar: "TLJ",
          Agama: "Agama",
          "Agama Islam": "Agama",
          "B. Inggris": "B. Inggris",
          "B. Indonesia": "B. Indonesia",
          MTK: "MTK",
          PKK: "PKK",
          PKN: "PKN",
          ASJ: "ASJ",
          TLJ: "TLJ",
          AIJ: "AIJ",
        };

        // Try to find subject by exact name first, then by alias
        const searchName = subjectAliases[sched.subject] || sched.subject;

        const subject = await prisma.subject.findFirst({
          where: {
            OR: [
              { name: sched.subject }, // Exact match
              { name: searchName }, // Alias match
              { code: sched.subject }, // Code match
            ],
          },
          include: {
            teacher: true,
          },
        });

        let attendance = null;
        if (subject) {
          attendance = await prisma.attendance.findFirst({
            where: {
              studentId: student.id,
              subjectId: subject.id,
              date: todayDate,
            },
          });
        }

        return {
          ...sched,
          subjectId: subject?.id || null,
          subjectCode: subject?.code || null,
          teacherName: subject?.teacher?.name || sched.teacher || "-",
          attendance: attendance,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedSchedules,
      studentClass: student.class,
      day: dayName,
    });
  } catch (error: any) {
    console.error("Get Today Schedule Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
