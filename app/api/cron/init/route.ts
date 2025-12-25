import { NextResponse } from "next/server";
import { initCronJobs } from "@/lib/cron";

// Simple endpoint to initialize cron jobs
// Call this once when server starts or via startup script
export async function GET() {
  try {
    initCronJobs();
    return NextResponse.json({
      success: true,
      message: "Cron jobs initialized successfully",
    });
  } catch (error) {
    console.error("[CRON INIT] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize cron jobs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
