import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getInternshipSchedulesRepository } from "@/lib/database/repository";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const dynamic = "force-dynamic";

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 };
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") {
      return {
        error: "Akses ditolak. Hanya admin yang dapat mengakses",
        status: 403,
      };
    }
    return { user: decoded };
  } catch {
    return { error: "Token tidak valid", status: 401 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const repo = getInternshipSchedulesRepository();
    const { data, total } = await repo.findMany({
      search,
      page,
      limit,
    });

    // Transform data to match frontend expectations
    const transformedData = data.map((item: any) => {
      // Split notes back into period and notes if it contains " - "
      const noteParts = (item.notes || "").split(" - ");
      const period = noteParts.length > 1 ? noteParts[0] : "";
      const notes =
        noteParts.length > 1
          ? noteParts.slice(1).join(" - ")
          : item.notes || "";

      return {
        ...item,
        program: item.class || "", // Map class back to program for frontend
        period,
        notes,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminToken(request);
    if (auth.error)
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status },
      );
    const body = await request.json();
    const { program, period, notes, partnerId, className } = body;

    // program is used as class (required field)
    const classValue = className || program || "";
    if (!classValue)
      return NextResponse.json(
        { success: false, message: "Program/Kelas diperlukan" },
        { status: 400 },
      );

    // Get first partner if partnerId not provided
    let finalPartnerId = partnerId;
    if (!finalPartnerId) {
      const { getInternshipPartnersRepository } =
        await import("@/lib/database/repository");
      const partnerRepo = getInternshipPartnersRepository();
      const { data: partners } = await partnerRepo.findMany({
        page: 1,
        limit: 1,
      });
      if (partners && partners.length > 0) {
        finalPartnerId = partners[0].id;
      } else {
        // Create a default partner if none exists
        const newPartner = await partnerRepo.create({
          name: "Mitra Default",
          description: "Auto-created partner",
        });
        finalPartnerId = newPartner.id;
      }
    }

    // Combine period and notes for storage
    const combinedNotes = [period, notes].filter(Boolean).join(" - ");

    const repo = getInternshipSchedulesRepository();
    const created = await repo.create({
      partnerId: finalPartnerId,
      class: classValue,
      notes: combinedNotes || "",
    });
    return NextResponse.json({
      success: true,
      message: "Jadwal prakerin ditambahkan",
      data: created,
    });
  } catch (error) {
    const err = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
