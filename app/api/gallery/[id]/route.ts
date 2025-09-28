import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Prevent static generation
export const dynamic = "force-dynamic";

// Helper function to verify admin token
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
  } catch (error) {
    return { error: "Token tidak valid", status: 401 };
  }
}

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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    const galleryItem = await collections.gallery.findOne({
      _id: new ObjectId(id),
    });

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform _id to id for frontend consistency
    const transformedGalleryItem = {
      ...galleryItem,
      id: galleryItem._id.toString(),
      _id: undefined, // Remove _id to avoid confusion
    };

    return NextResponse.json({
      success: true,
      data: transformedGalleryItem,
    });
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

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

    const collections = await getCollections();

    // Check if gallery item exists
    const existingGalleryItem = await collections.gallery.findOne({
      _id: new ObjectId(id),
    });
    if (!existingGalleryItem) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update gallery item
    const updateData = {
      title,
      description: description || "",
      type,
      url,
      thumbnail: thumbnail || "",
      category: category || "general",
      tags: tags || [],
      isPublished: isPublished || false,
      updatedAt: new Date(),
    };

    const result = await collections.gallery.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item galeri berhasil diperbarui",
      data: { id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
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

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID item galeri diperlukan" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if gallery item exists
    const existingGalleryItem = await collections.gallery.findOne({
      _id: new ObjectId(id),
    });
    if (!existingGalleryItem) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hard delete (permanently remove from database)
    const result = await collections.gallery.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item galeri berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
