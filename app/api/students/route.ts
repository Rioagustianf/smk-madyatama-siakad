import { NextRequest, NextResponse } from "next/server";
import {
  getCollections,
  handleDatabaseError,
  paginate,
  createFilterObject,
} from "@/lib/database/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { students } = await getCollections();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const filters: Record<string, any> = {};
    const sortBy = (searchParams.get("sortBy") || "class").toString();
    const sortOrder = (searchParams.get("sortOrder") || "asc").toString();
    const search = searchParams.get("search") || undefined;
    const major = searchParams.get("major") || undefined;
    const className = searchParams.get("class") || undefined;
    const gradeLevel = searchParams.get("gradeLevel") || undefined;
    const semester = searchParams.get("semester") || undefined;

    if (search) filters.name = search;
    if (major) filters.major = major;
    if (className) filters.class = className;
    if (gradeLevel) filters.gradeLevel = parseInt(gradeLevel, 10);
    if (semester) filters.semester = parseInt(semester, 10);

    const query = createFilterObject(filters);
    const { skip } = paginate(page, limit);
    const sortObj: any = {};
    if (sortBy) {
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const [data, total] = await Promise.all([
      students
        .find(query)
        .sort(Object.keys(sortObj).length ? sortObj : { class: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      students.countDocuments(query),
    ]);

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
    const { students } = await getCollections();
    const now = new Date();
    const doc = { ...body, createdAt: now, updatedAt: now };
    const result = await students.insertOne(doc);
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...doc },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
