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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    const { id } = params;
    if (!ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    const body = await request.json();
    const collections = await getCollections();
    const res = await collections.internships?.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (!res?.matchedCount)
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, message: "Mitra diperbarui" });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    const { id } = params;
    if (!ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    const collections = await getCollections();
    const res = await collections.internships?.deleteOne({
      _id: new ObjectId(id),
    });
    if (!res?.deletedCount)
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, message: "Mitra dihapus" });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
