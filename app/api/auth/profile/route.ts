import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserProfile, updateUserProfile } from "@/lib/auth";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyToken(request);

    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const user = await getUserProfile(authResult.user!.id, authResult.user!.role);

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan atau tidak aktif" },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = verifyToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const updateData = await request.json();
    const result = await updateUserProfile(
      authResult.user!.id,
      authResult.user!.role,
      updateData
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
