import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== DEBUG LOG ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Data:", JSON.stringify(body, null, 2));
    console.log("=================");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Debug logging error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log debug info" },
      { status: 500 }
    );
  }
}
