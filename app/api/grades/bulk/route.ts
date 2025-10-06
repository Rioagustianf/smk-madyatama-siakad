import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { calculateLetterGrade, roundNumber } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

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
    const { teachers } = await getCollections();
    const teacher = await teachers.findOne({ _id: new ObjectId(decoded.id) });
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

    const { grades } = await getCollections();
    const ops = items.map((g: any) => ({
      updateOne: {
        filter: {
          studentId: g.studentId,
          subjectId: g.subjectId,
          semester: g.semester,
          year: g.year,
        },
        update: {
          $set: {
            assignments: Number(g.assignments ?? 0),
            midterm: Number(g.midterm ?? 0),
            final: Number(g.final ?? 0),
            total: roundNumber(
              (Number(g.assignments || 0) +
                Number(g.midterm || 0) +
                Number(g.final || 0)) /
                3,
              2
            ),
            grade: calculateLetterGrade(
              (Number(g.assignments || 0) +
                Number(g.midterm || 0) +
                Number(g.final || 0)) /
                3
            ),
            teacherId: g.teacherId,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        upsert: true,
      },
    }));

    const result = await grades.bulkWrite(ops, { ordered: false });
    return NextResponse.json({
      success: true,
      data: { modified: result.modifiedCount, upserted: result.upsertedCount },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
