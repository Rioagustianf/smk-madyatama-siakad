import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

async function getTeacherFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "teacher" && decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const teacherUser = await getTeacherFromToken(request);
    if (!teacherUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1. Get Teacher Data (to match name in Schedule)
    // The legacy Schedule uses "teacher" string name.
    // The new Subject uses "teacherId".
    // We should try to find schedules by Teacher Name (from Teacher Profile).

    // First get full teacher profile to get the stored name
    const teacherProfile = await prisma.teacher.findUnique({
      where: { id: teacherUser.id },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { success: false, message: "Teacher profile not found" },
        { status: 404 }
      );
    }

    // 2. Get Today's Day
    const today = new Date();
    const dayName = dayNames[today.getDay()];
    // const dayName = "Senin"; // Testing

    // 3. Find Schedules where teacher name matches OR linked Subject matches
    // Since Schedule.teacher is string, we match string.
    // Also we should check if Schedule.subject matches a Subject where teacherId is this teacher.

    // Approach A: Match by Schedule.teacher string
    const schedulesByString = await prisma.schedule.findMany({
      where: {
        day: dayName,
        teacher: teacherProfile.name, // Strict name match?
        isActive: true,
      },
    });

    // Approach B: Find Subjects owned by this teacher, then find Schedules for those subjects
    const subjects = await prisma.subject.findMany({
      where: { teacherId: teacherProfile.id },
    });
    const subjectNames = subjects.map((s) => s.name);

    const schedulesBySubject = await prisma.schedule.findMany({
      where: {
        day: dayName,
        subject: { in: subjectNames },
        isActive: true,
      },
    });

    // Merge and deduplicate
    const combined = [...schedulesByString, ...schedulesBySubject];
    const uniqueSchedules = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );

    // Enrich with Subject ID
    // Enrich with Subject ID
    const enriched = await Promise.all(
      uniqueSchedules.map(async (sched) => {
        // Subject name mapping for legacy schedule names (Must match student API)
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

        const searchName = subjectAliases[sched.subject] || sched.subject;

        const subject = await prisma.subject.findFirst({
          where: {
            OR: [
              { name: sched.subject },
              { name: searchName },
              { code: sched.subject },
            ],
          },
          orderBy: { name: "asc" }, // Deterministic sort
        });
        return {
          ...sched,
          subjectId: subject?.id || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enriched,
    });
  } catch (error: any) {
    console.error("Teacher Schedule Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
