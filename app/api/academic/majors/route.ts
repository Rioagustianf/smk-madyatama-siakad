import { NextRequest, NextResponse } from "next/server";
import { getMajorsRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import { verifyAdminToken } from "@/lib/auth";

// Prevent static generation
export const dynamic = "force-dynamic";

// GET - Get all majors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const repo = getMajorsRepository();
    const { data, total } = await repo.findMany({ search, page, limit });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching majors:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}

// POST - Create new major
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status },
      );
    }

    const body = await request.json();
    const {
      name,
      code,
      description,
      image,
      facilities,
      careerProspects,
      headName,
      headPhoto,
      vision,
      mission,
    } = body;

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan kode program keahlian diperlukan",
        },
        { status: 400 },
      );
    }

    const repo = getMajorsRepository();
    // Will throw duplicate error if code exists (Mongo) or unique constraint (Prisma)
    const created = await repo.create({
      name,
      code,
      description,
      image,
      facilities,
      careerProspects,
      headName,
      headPhoto,
      vision,
      mission,
    });

    return NextResponse.json({
      success: true,
      message: "Program keahlian berhasil ditambahkan",
      data: created,
    });
  } catch (error) {
    console.error("Error creating major:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 },
    );
  }
}
