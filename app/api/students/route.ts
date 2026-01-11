import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getStudentsRepository } from "@/lib/database/repository";
import bcrypt from "bcryptjs";

const DEFAULT_PASSWORD = "password123";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = (searchParams.get("sortBy") || "name").toString();
    const sortOrder = (searchParams.get("sortOrder") || "asc").toString();
    const search = searchParams.get("search") || undefined;
    const major = searchParams.get("major") || undefined;
    const className = searchParams.get("class") || undefined;
    const gradeLevel = searchParams.get("gradeLevel") || undefined;
    const semester = searchParams.get("semester") || undefined;
    const repo = getStudentsRepository();
    const { data, total } = await repo.findMany({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder === "desc" ? "desc" : "asc",
      search,
      major,
      className,
      gradeLevel: gradeLevel ? parseInt(gradeLevel, 10) : undefined,
      semester: semester ? parseInt(semester, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Hash default password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const repo = getStudentsRepository();
    const created = await repo.create({
      ...body,
      password: hashedPassword,
    });
    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
