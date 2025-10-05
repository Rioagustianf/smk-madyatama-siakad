import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";

// Bulk operations for students: change semester, promote grade, set grade level
// POST body: { action: "changeSemester" | "promoteGrade" | "setGradeLevel", studentIds?: string[], filter?: Record<string, any>, payload?: any }
export async function POST(req: NextRequest) {
  try {
    const { students } = await getCollections();
    const body = await req.json();
    const { action, studentIds, filter = {}, payload = {} } = body || {};

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action diperlukan" },
        { status: 400 }
      );
    }

    const query: any = {};
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      query.studentId = { $in: studentIds };
    }
    Object.assign(query, filter);

    let update: any = {};
    if (action === "changeSemester") {
      const targetSemester = Number(payload?.semester);
      if (![1, 2].includes(targetSemester)) {
        return NextResponse.json(
          { success: false, message: "Semester tidak valid" },
          { status: 400 }
        );
      }
      update = {
        $set: { semester: targetSemester },
        $currentDate: { updatedAt: true },
      };
    } else if (action === "promoteGrade") {
      const increment = Number(payload?.increment ?? 1);
      // Ensure only gradeLevel < 12 are promoted and cap at 12
      Object.assign(query, {
        $or: [{ gradeLevel: { $lt: 12 } }, { gradeLevel: { $exists: false } }],
      });
      update = {
        $set: { updatedAt: new Date() },
        $inc: { gradeLevel: increment },
      };
    } else if (action === "setGradeLevel") {
      const gradeLevel = Number(payload?.gradeLevel);
      if (![10, 11, 12].includes(gradeLevel)) {
        return NextResponse.json(
          { success: false, message: "Tingkat kelas tidak valid" },
          { status: 400 }
        );
      }
      update = {
        $set: { gradeLevel },
        $currentDate: { updatedAt: true },
      };
    } else {
      return NextResponse.json(
        { success: false, message: "Action tidak dikenali" },
        { status: 400 }
      );
    }

    const result = await students.updateMany(query, update);
    return NextResponse.json({
      success: true,
      data: { matched: result.matchedCount, modified: result.modifiedCount },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
