import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth/auth-service";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();

    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        { message: "Username dan password diperlukan" },
        { status: 400 }
      );
    }

    const result = await authenticateUser(credentials);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: result.message,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
