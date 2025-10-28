import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getStudentsRepository } from "@/lib/database/repository";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = getStudentsRepository();
    const body = await req.json();
    const { id } = params;
    const updated = await repo.update(id, body);
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
    const repo = getStudentsRepository();
    const { id } = params;
    await repo.remove(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
