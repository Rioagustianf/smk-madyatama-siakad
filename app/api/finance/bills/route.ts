import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
}

// GET - List Bills
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");

    let whereClause: any = {};

    if (user.role === "student") {
      // Students can only see their own bills
      whereClause.studentId = user.id; // Assuming user.id is the Student UUID from token
    } else if (user.role === "admin" || user.role === "staff") {
      // Admin/Staff can filter by student
      if (studentId) whereClause.studentId = studentId;
    } else {
      // Teachers?
      return NextResponse.json(
        { success: false, message: "Unauthorized role" },
        { status: 403 }
      );
    }

    if (status) whereClause.status = status;

    const bills = await prisma.bill.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            name: true,
            class: true,
            nisn: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: bills,
    });
  } catch (error: any) {
    console.error("Get Bills Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create Bill (Admin Only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      // Assuming 'staff' role exists or admin handles finance
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studentId, title, amount, type, dueDate, description } = body;

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch student data to get the name for notification
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { name: true, phone: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const bill = await prisma.bill.create({
      data: {
        studentId,
        title,
        amount: parseFloat(amount),
        type: type || "SPP",
        status: "PENDING",
        dueDate: new Date(dueDate),
        description,
      },
    });

    // Send Notification (In-App + WhatsApp)
    try {
      const { createNotification } = await import("@/lib/notifications");
      await createNotification(
        studentId,
        "Tagihan Baru",
        `Halo ${
          student.name
        }, ada tagihan baru: *${title}* sebesar *Rp ${new Intl.NumberFormat(
          "id-ID"
        ).format(parseFloat(amount))}*. Jatuh tempo: ${new Date(
          dueDate
        ).toLocaleDateString(
          "id-ID"
        )}. Mohon segera lakukan pembayaran. Terima kasih.`,
        "INFO",
        "/dashboard/student/finance",
        true // Send WhatsApp
      );
    } catch (notifError) {
      console.error("Notification Error:", notifError);
      // Don't fail the bill creation if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Tagihan berhasil dibuat",
      data: bill,
    });
  } catch (error: any) {
    console.error("Create Bill Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
