import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getAcademicEventsRepository } from "@/lib/database/repository";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyAdminToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const repo = getAcademicEventsRepository();
    const { data, total } = await repo.findMany({
      search,
      type: type && type !== "all" ? type : undefined,
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
      isPublished: true,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminData = await verifyAdminToken(token);
    if (!adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const repo = getAcademicEventsRepository();

    const created = await repo.create({
      title: body.title,
      description: body.description,
      type: body.type || "EVENT",
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      createdBy: adminData.email,
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
