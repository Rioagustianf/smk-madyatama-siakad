import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin" && decoded.role !== "teacher") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const classFilter = searchParams.get("class");

    // Get date
    let dateFilter = new Date();
    if (dateStr) {
      dateFilter = new Date(dateStr);
    }
    dateFilter.setHours(0, 0, 0, 0);

    // Build where clause
    const where: any = {
      date: dateFilter,
    };

    if (classFilter) {
      where.student = {
        class: classFilter,
      };
    }

    // Get all attendance records for the date
    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nisn: true,
            class: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ student: { class: "asc" } }, { student: { name: "asc" } }],
    });

    // Get summary statistics
    const total = attendances.length;
    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const sick = attendances.filter((a) => a.status === "SICK").length;
    const permission = attendances.filter(
      (a) => a.status === "PERMISSION"
    ).length;
    const alpha = attendances.filter((a) => a.status === "ALPHA").length;
    const verified = attendances.filter((a) => a.isVerified).length;
    const pending = total - verified;

    return NextResponse.json({
      success: true,
      data: attendances,
      summary: {
        total,
        present,
        sick,
        permission,
        alpha,
        verified,
        pending,
      },
    });
  } catch (error: any) {
    console.error("Monitoring Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
