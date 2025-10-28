import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { prisma } from "@/lib/database/prisma";

// Bulk operations for students: change semester, promote grade, set grade level
// POST body: { action: "changeSemester" | "promoteGrade" | "setGradeLevel", studentIds?: string[], filter?: Record<string, any>, payload?: any }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, studentIds, filter = {}, payload = {} } = body || {};

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action diperlukan" },
        { status: 400 }
      );
    }

    const where: any = {};
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      where.studentId = { in: studentIds };
    }
    Object.assign(where, filter);

    let data: any = {};
    let matched = 0;
    let modified = 0;

    if (action === "changeSemester") {
      const targetSemester = Number(payload?.semester);
      if (![1, 2].includes(targetSemester)) {
        return NextResponse.json(
          { success: false, message: "Semester tidak valid" },
          { status: 400 }
        );
      }
      const result = await prisma.student.updateMany({
        where,
        data: { semester: targetSemester },
      });
      matched = result.count;
      modified = result.count;
    } else if (action === "promoteGrade") {
      const increment = Number(payload?.increment ?? 1);
      // Fetch students with gradeLevel < 12
      const studentsToUpdate = await prisma.student.findMany({
        where: { ...where, gradeLevel: { lt: 12 } },
        select: { id: true, gradeLevel: true },
      });

      // Update each student individually
      for (const student of studentsToUpdate) {
        await prisma.student.update({
          where: { id: student.id },
          data: { gradeLevel: Math.min(student.gradeLevel + increment, 12) },
        });
      }
      matched = studentsToUpdate.length;
      modified = studentsToUpdate.length;
    } else if (action === "setGradeLevel") {
      const gradeLevel = Number(payload?.gradeLevel);
      if (![10, 11, 12].includes(gradeLevel)) {
        return NextResponse.json(
          { success: false, message: "Tingkat kelas tidak valid" },
          { status: 400 }
        );
      }
      const result = await prisma.student.updateMany({
        where,
        data: { gradeLevel },
      });
      matched = result.count;
      modified = result.count;
    } else {
      return NextResponse.json(
        { success: false, message: "Action tidak dikenali" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { matched, modified },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
