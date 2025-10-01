import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const dynamic = "force-dynamic";

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 };
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return {
        error: "Akses ditolak. Hanya admin yang dapat mengakses",
        status: 403,
      };
    }
    return { user: decoded };
  } catch {
    return { error: "Token tidak valid", status: 401 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const collections = await getCollections();
    const filter: any = { kind: "extracurricular" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const [items, total] = await Promise.all([
      collections.activities
        ?.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() ?? [],
      collections.activities?.countDocuments(filter) ?? 0,
    ]);
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil((total as number) / limit),
      },
    });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    const body = await request.json();
    const { name, description } = body;
    if (!name)
      return NextResponse.json(
        { success: false, message: "Nama diperlukan" },
        { status: 400 }
      );
    const collections = await getCollections();
    const doc = {
      name,
      description: description || "",
      kind: "extracurricular",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await collections.activities?.insertOne(doc);
    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler ditambahkan",
      data: { _id: res?.insertedId, ...doc },
    });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
