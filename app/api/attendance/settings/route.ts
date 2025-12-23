import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET - Get attendance settings
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.attendanceSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.attendanceSettings.create({
        data: {
          schoolName: "SMK Madyatama",
          latitude: -6.17511,
          longitude: 106.865036,
          radius: 100,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("Get Settings Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update attendance settings
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { latitude, longitude, radius } = body;

    // Get existing settings
    let settings = await prisma.attendanceSettings.findFirst();

    if (!settings) {
      // Create new
      settings = await prisma.attendanceSettings.create({
        data: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseInt(radius),
        },
      });
    } else {
      // Update existing
      settings = await prisma.attendanceSettings.update({
        where: { id: settings.id },
        data: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseInt(radius),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil diperbarui",
      data: settings,
    });
  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
