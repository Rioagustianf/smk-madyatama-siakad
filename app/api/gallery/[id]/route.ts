import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getGalleryRepository } from "@/lib/database/repository";
import { verifyAdminToken } from "@/lib/auth";

// GET - Get single gallery item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID item galeri diperlukan" },
        { status: 400 }
      );
    }

    const repo = getGalleryRepository();
    const galleryItem = await repo.findById(id);

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    return handleDatabaseError(error);
  }
}

// PUT - Update gallery item by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    const body = await request.json();
    const {
      title,
      description,
      type,
      url,
      thumbnail,
      category,
      tags,
      isPublished,
    } = body;

    // Validation
    if (!title || !type || !url) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul, tipe, dan URL diperlukan",
        },
        { status: 400 }
      );
    }

    const repo = getGalleryRepository();
    const updated = await repo.update(id, {
      title,
      description: description || "",
      type,
      url,
      thumbnail: thumbnail || "",
      category: category || "general",
      tags: tags || [],
      isPublished: isPublished || false,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item galeri berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return handleDatabaseError(error);
  }
}

// DELETE - Delete gallery item by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    const repo = getGalleryRepository();
    await repo.remove(id);

    return NextResponse.json({
      success: true,
      message: "Item galeri berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return handleDatabaseError(error);
  }
}
