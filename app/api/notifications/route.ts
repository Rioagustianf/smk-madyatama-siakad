import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { authenticateUser } from "@/lib/auth/auth-service"; // Or similar auth check

// Mock auth for now or use the token from headers if you implemented middleware
// Ideally we get userId from the session/token.
// For now, assuming you pass userId in query or header for "simplicity" in this context
// OR better, decode the token.
// The project seems to use `jsonwebtoken`.

import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // 1. Get Token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    // 2. Verify
    let userId = "";
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      userId = decoded.id; // Assuming payload has id
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 401 }
      );
    }

    // 3. Get Notifications
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const whereClause: any = { userId };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Count unread
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 }
    );
  }
}
