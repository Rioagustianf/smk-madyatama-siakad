import { NextRequest, NextResponse } from "next/server";
import { getMajorsRepository } from "@/lib/database/repository";
import { handleDatabaseError } from "@/lib/database/errors";
import { verifyAdminToken } from "@/lib/auth";

// Prevent static generation
export const dynamic = "force-dynamic";

// GET - Get single major by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID program keahlian diperlukan" },
        { status: 400 }
      );
    }

    const repo = getMajorsRepository();
    const major = await repo.findById(id);

    if (!major) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: major,
    });
  } catch (error) {
    console.error("Error fetching major:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update major by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, code, description, image, facilities, careerProspects } = body;

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan kode program keahlian diperlukan",
        },
        { status: 400 }
      );
    }

    const repo = getMajorsRepository();

    // Check if major exists
    const existingMajor = await repo.findById(id);
    if (!existingMajor) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update major
    const updateData = {
      name,
      code,
      description: description || "",
      image: image || "",
      facilities: facilities || [],
      careerProspects: careerProspects || [],
    };

    const updatedMajor = await repo.update(id, updateData);

    return NextResponse.json({
      success: true,
      message: "Program keahlian berhasil diperbarui",
      data: updatedMajor,
    });
  } catch (error) {
    console.error("Error updating major:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete major by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID program keahlian diperlukan" },
        { status: 400 }
      );
    }

    const repo = getMajorsRepository();

    // Check if major exists
    const existingMajor = await repo.findById(id);
    if (!existingMajor) {
      return NextResponse.json(
        { success: false, message: "Program keahlian tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete major
    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Program keahlian berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting major:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
