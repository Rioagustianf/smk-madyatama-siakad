import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { students } = await getCollections();
    const body = await req.json();
    const { id } = params;
    const filter = { _id: new ObjectId(id) };
    const update = { $set: { ...body, updatedAt: new Date() } };
    await students.updateOne(filter, update);
    const updated = await students.findOne(filter);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { students } = await getCollections();
    const { id } = params;
    await students.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
