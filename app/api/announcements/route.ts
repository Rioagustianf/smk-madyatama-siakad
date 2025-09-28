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

// GET - Get all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const isPublished = searchParams.get("isPublished");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const collections = await getCollections();

    // Build filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (isPublished !== null && isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }

    // Get announcements with pagination
    const [announcements, total] = await Promise.all([
      collections.announcements
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.announcements.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// POST - Create new announcement
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
    const { title, content, excerpt, image, category, priority, isPublished } =
      body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul dan konten pengumuman diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Create new announcement
    const newAnnouncement = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      image: image || "",
      category: category || "general",
      priority: priority || "medium",
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      createdBy: authResult.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.announcements.insertOne(newAnnouncement);

    return NextResponse.json({
      success: true,
      message: "Pengumuman berhasil ditambahkan",
      data: { id: result.insertedId, ...newAnnouncement },
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
