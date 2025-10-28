import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getGradesRepository, getTeachersRepository } from "@/lib/database/repository";
import { calculateLetterGrade, roundNumber } from "@/lib/utils";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyHomeroomTeacher(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 } as const;
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded?.id || decoded?.role !== "teacher") {
      return { error: "Akses ditolak", status: 403 } as const;
    }
    const teachersRepo = getTeachersRepository();
    const teacher = await teachersRepo.findById(decoded.id);
    const classes = (teacher as any)?.classes || [];
    if (!Array.isArray(classes) || classes.length === 0) {
      return {
        error: "Hanya wali kelas yang dapat menginput nilai",
        status: 403,
      } as const;
    }
    return { teacher: decoded } as const;
  } catch {
    return { error: "Token tidak valid", status: 401 } as const;
  }
}

// Upsert many grades at once by compound keys (studentId, subjectId, semester, year)
export async function POST(req: NextRequest) {
  try {
    // Guard: only homeroom teachers may write grades
    const authResult = await verifyHomeroomTeacher(req);
    if ("error" in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await req.json();
    const { items } = body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Items tidak boleh kosong" },
        { status: 400 }
      );
    }

    const repo = getGradesRepository();
    const upsertData = items.map((g: any) => {
      const avg =
        (Number(g.assignments || 0) +
          Number(g.midterm || 0) +
          Number(g.final || 0)) /
        3;
      return {
        studentId: g.studentId,
        subjectId: g.subjectId,
        semester: Number(g.semester),
        year: Number(g.year),
        assignments: Number(g.assignments ?? 0),
        midterm: Number(g.midterm ?? 0),
        final: Number(g.final ?? 0),
        total: roundNumber(avg, 2),
        grade: calculateLetterGrade(avg),
        teacherId: g.teacherId,
      };
    });

    const result = await repo.bulkUpsert(upsertData);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
