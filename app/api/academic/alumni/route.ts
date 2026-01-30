import { NextRequest, NextResponse } from "next/server";
import { getMajorAlumniRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";

export const dynamic = "force-dynamic";

// GET - List All Alumni (with Major name)
export async function GET(request: NextRequest) {
  try {
    const repo = getMajorAlumniRepository();
    const { data: alumni } = await repo.findMany({});

    return NextResponse.json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}
