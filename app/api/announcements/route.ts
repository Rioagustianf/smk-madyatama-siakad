import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getAnnouncementsRepository } from "@/lib/database/repository";
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const priority = searchParams.get("priority") || "";
    const isPublished = searchParams.get("isPublished");

    const repo = getAnnouncementsRepository();
    const { data, total } = await repo.findMany({
      search,
      category: category && category !== "all" ? category : undefined,
      priority: priority && priority !== "all" ? priority : undefined,
      isPublished:
        isPublished !== null && isPublished !== undefined
          ? isPublished === "true"
          : undefined,
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
    const repo = getAnnouncementsRepository();

    const created = await repo.create({
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
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
