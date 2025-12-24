import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    let userId = "";
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      userId = decoded.id;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    if (!notification || notification.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, message: "Marked as read" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 }
    );
  }
}
