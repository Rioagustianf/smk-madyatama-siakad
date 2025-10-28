import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getGalleryRepository } from "@/lib/database/repository";
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

// GET - Get all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const isPublished = searchParams.get("isPublished");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const repo = getGalleryRepository();
    const { data, total } = await repo.findMany({
      search,
      category: category || undefined,
      type: type || undefined,
      isPublished:
        isPublished !== null && isPublished !== undefined
          ? isPublished === "true"
          : undefined,
      page,
      limit,
    });

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
    console.error("Error fetching gallery:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
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

    const repo = getGalleryRepository();
    const created = await repo.create({
      title,
      description: description || "",
      type,
      url,
      thumbnail: thumbnail || "",
      category: category || "general",
      tags: tags || [],
      isPublished: isPublished || false,
      createdBy: authResult.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Item galeri berhasil ditambahkan",
      data: created,
    });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
