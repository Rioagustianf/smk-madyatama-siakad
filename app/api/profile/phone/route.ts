import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 401 }
      );
    }

    const { phone } = await req.json();
    const { id, role } = decoded;

    // Update phone based on role
    if (role === "student") {
      await prisma.student.update({
        where: { id },
        data: { phone },
      });
    } else if (role === "teacher") {
      await prisma.teacher.update({
        where: { id },
        data: { phone },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Role not supported" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Phone number updated",
    });
  } catch (error) {
    console.error("Update Phone Error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating phone" },
      { status: 500 }
    );
  }
}
