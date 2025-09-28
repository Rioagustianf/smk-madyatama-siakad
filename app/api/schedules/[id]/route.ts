import { NextRequest, NextResponse } from "next/server";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Prevent static generation
export const dynamic = "force-dynamic";

// Helper function to verify admin token
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
  } catch (error) {
    return { error: "Token tidak valid", status: 401 };
  }
}

// GET - Get single schedule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID jadwal diperlukan" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    const schedule = await collections.schedules.findOne({
      _id: new ObjectId(id),
    });

    if (!schedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform _id to id for frontend consistency
    const transformedSchedule = {
      ...schedule,
      id: schedule._id.toString(),
      _id: undefined, // Remove _id to avoid confusion
    };

    return NextResponse.json({
      success: true,
      data: transformedSchedule,
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update schedule by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      subjectId,
      teacherId,
      classId,
      day,
      startTime,
      endTime,
      room,
      semester,
      year,
      isActive,
    } = body;

    // Validation
    if (
      !subjectId ||
      !teacherId ||
      !classId ||
      !day ||
      !startTime ||
      !endTime ||
      !room
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field jadwal diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if schedule exists
    const existingSchedule = await collections.schedules.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check for time conflicts (excluding current schedule)
    const conflictingSchedule = await collections.schedules.findOne({
      $and: [
        { _id: { $ne: new ObjectId(id) } },
        { classId },
        { day },
        { isActive: true },
        {
          $or: [
            {
              $and: [
                { startTime: { $lte: startTime } },
                { endTime: { $gt: startTime } },
              ],
            },
            {
              $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gte: endTime } },
              ],
            },
            {
              $and: [
                { startTime: { $gte: startTime } },
                { endTime: { $lte: endTime } },
              ],
            },
          ],
        },
      ],
    });

    if (conflictingSchedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Jadwal bertabrakan dengan jadwal yang sudah ada",
        },
        { status: 400 }
      );
    }

    // Update schedule
    const updateData = {
      subjectId,
      teacherId,
      classId,
      day,
      startTime,
      endTime,
      room,
      semester: semester || 1,
      year: year || new Date().getFullYear(),
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    const result = await collections.schedules.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil diperbarui",
      data: { id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete schedule by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID jadwal diperlukan" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if schedule exists
    const existingSchedule = await collections.schedules.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hard delete (permanently remove from database)
    const result = await collections.schedules.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Jadwal tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
