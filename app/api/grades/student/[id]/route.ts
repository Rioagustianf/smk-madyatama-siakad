import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import {
  getGradesRepository,
  getSubjectsRepository,
} from "@/lib/database/repository";
import { prisma } from "@/lib/database/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");

    const repo = getGradesRepository();
    const items = await repo.findByStudent(id);

    // Enrich with subject name
    const subjectsRepo = getSubjectsRepository();
    const subjectIds = Array.from(
      new Set(
        items
          .map((g: any) => g.subjectId)
          .filter((sid: any) => typeof sid === "string" && sid.trim() !== "")
      )
    );

    let subjectDocs: Record<string, string> = {};
    for (const sid of subjectIds) {
      try {
        const subject = await subjectsRepo.findById(sid as string);
        if (subject) {
          subjectDocs[sid as string] = subject.name;
        }
      } catch {
        // Ignore if subject not found
      }
    }

    const data = items.map((g: any) => ({
      ...g,
      subjectName:
        subjectDocs[String(g.subjectId)] ||
        g.subjectName ||
        g.subject ||
        g.subjectId ||
        "",
    }));

    // Fetch Homeroom Teacher & Headmaster
    let homeroomTeacherName = "";
    let homeroomTeacherNip = "";
    let headmasterName = ""; // Default empty per user request
    let headmasterNip = "";
    let parentName = "";

    try {
      // 1. Get Homeroom Teacher and parentName
      const student = await prisma.student.findUnique({
        where: { id },
        select: { class: true, parentName: true },
      });

      if (student?.parentName) {
        parentName = student.parentName;
      }

      if (student?.class) {
        // Find class by name (assuming student.class stores class name)
        const classInfo = await prisma.schoolClass.findUnique({
          where: { name: student.class },
          include: { homeroomTeacher: true },
        });

        if (classInfo?.homeroomTeacher?.name) {
          homeroomTeacherName = classInfo.homeroomTeacher.name;
        }
        if (classInfo?.homeroomTeacher?.nip) {
          homeroomTeacherNip = classInfo.homeroomTeacher.nip;
        }
      }

      // 2. Get Headmaster from Profile
      const profile = await prisma.profile.findFirst();
      if (profile?.principalName) {
        headmasterName = profile.principalName;
      }
      if (profile?.principalNip) {
        headmasterNip = profile.principalNip;
      }
    } catch (e) {
      console.error("Error fetching additional report data:", e);
      // Continue without failing the main grades request
    }

    return NextResponse.json({
      success: true,
      data,
      parentName: parentName,
      homeroomTeacher: homeroomTeacherName,
      homeroomTeacherNip: homeroomTeacherNip,
      headmaster: headmasterName,
      headmasterNip: headmasterNip,
    });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.status }
    );
  }
}
