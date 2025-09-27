import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/database/seeder";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Check if running in development mode
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "Seeder hanya bisa dijalankan di development mode" },
        { status: 403 }
      );
    }

    console.log("🌱 Starting database seeding...");

    const result = await seedDatabase();

    return NextResponse.json({
      message: "Database berhasil di-seed",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat seeding database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Seeder API endpoint",
    usage: "POST /api/seed untuk menjalankan seeder",
    note: "Hanya bisa dijalankan di development mode",
  });
}
