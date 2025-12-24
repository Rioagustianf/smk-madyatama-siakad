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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    // Student can upload proof (PENDING), Admin can verify/make CASH payment (PAID)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { billId, amount, method, notes, proofUrl } = body;

    // Check bill existence
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { payments: true, student: true },
    });

    if (!bill) {
      return NextResponse.json(
        { success: false, message: "Bill not found" },
        { status: 404 }
      );
    }

    // Determine status based on role
    let paymentStatus = "PENDING";
    let verifiedBy = null;

    if (user.role === "admin" || user.role === "staff") {
      paymentStatus = "VERIFIED";
      verifiedBy = user.name;
    }

    const payment = await prisma.payment.create({
      data: {
        billId,
        amount: parseFloat(amount),
        method: method || "CASH",
        status: paymentStatus,
        notes,
        proofUrl,
        verifiedBy,
      },
    });

    // Check total paid calculate new status
    const totalPaid =
      bill.payments.reduce((sum, p) => sum + Number(p.amount), 0) +
      parseFloat(amount);

    const updatedBill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { payments: true },
    });

    const totalVerifiedPaid =
      updatedBill?.payments
        .filter((p) => p.status === "VERIFIED")
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    let newBillStatus = bill.status;
    if (totalVerifiedPaid >= Number(bill.amount)) {
      newBillStatus = "PAID";
    }

    if (newBillStatus !== bill.status) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: { status: newBillStatus },
      });
    }

    // Send Notification if Bill is now PAID
    if (newBillStatus === "PAID" && newBillStatus !== bill.status) {
      try {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification(
          bill.studentId,
          "Pembayaran Berhasil",
          `Terima kasih ${bill.student.name}, pembayaran untuk *${
            bill.title
          }* sebesar *Rp ${new Intl.NumberFormat("id-ID").format(
            Number(bill.amount)
          )}* telah kami terima. Status: LUNAS/PAID.`,
          "SUCCESS",
          "/dashboard/student/finance",
          true // Send WhatsApp
        );
      } catch (notifError) {
        console.error("Notification Error:", notifError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dicatat",
      data: payment,
    });
  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
