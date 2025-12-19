import { NextRequest, NextResponse } from "next/server";
import { getExamSchedulesRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyToken(token: string | null | undefined) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId") || undefined;
    const subjectId = searchParams.get("subjectId") || undefined;
    const type = searchParams.get("type") || undefined;

    const repo = getExamSchedulesRepository();
    const result = await repo.findMany({
      page,
      limit,
      search,
      classId,
      subjectId,
      type,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = await verifyToken(token);

    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const repo = getExamSchedulesRepository();

    const created = await repo.create({
      ...body,
      createdBy: user.username,
      date: new Date(body.date),
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
