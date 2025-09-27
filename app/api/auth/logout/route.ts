import { NextRequest, NextResponse } from "next/server";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // For logout, we just need to clear the token on client side
    // The token will expire naturally
    return NextResponse.json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
