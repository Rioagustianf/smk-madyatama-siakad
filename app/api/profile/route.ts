import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 } as const;
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return {
        error: "Akses ditolak. Hanya admin yang dapat mengakses",
        status: 403,
      } as const;
    }
    return { user: decoded } as const;
  } catch {
    return { error: "Token tidak valid", status: 401 } as const;
  }
}

export async function GET() {
  try {
    const collections = await getCollections();
    const profile = await collections.profile.findOne({ _singleton: true });
    return NextResponse.json({ success: true, data: profile || null });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdminToken(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }
    const body = await request.json();
    const collections = await getCollections();
    const update = { ...body, _singleton: true, updatedAt: new Date() };
    await collections.profile.updateOne(
      { _singleton: true },
      { $set: update },
      { upsert: true }
    );
    return NextResponse.json({ success: true, data: update });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
