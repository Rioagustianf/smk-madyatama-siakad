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

// GET - Get single class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID kelas diperlukan" },
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

    // Get class with homeroom teacher and major information using aggregation
    const pipeline = [
      { $match: { _id: new ObjectId(id), isActive: true } },
      {
        $addFields: {
          homeroomTeacherObjectId: {
            $cond: {
              if: { $ne: ["$homeroomTeacherId", ""] },
              then: { $toObjectId: "$homeroomTeacherId" },
              else: null,
            },
          },
          majorObjectId: {
            $cond: {
              if: { $ne: ["$majorId", ""] },
              then: { $toObjectId: "$majorId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "homeroomTeacherObjectId",
          foreignField: "_id",
          as: "homeroomTeacher",
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "majorObjectId",
          foreignField: "_id",
          as: "major",
        },
      },
      {
        $addFields: {
          homeroomTeacher: { $arrayElemAt: ["$homeroomTeacher", 0] },
          major: { $arrayElemAt: ["$major", 0] },
        },
      },
      {
        $addFields: {
          homeroomTeacherName: "$homeroomTeacher.name",
          homeroomTeacherEducation: "$homeroomTeacher.education",
          majorName: "$major.name",
        },
      },
    ];

    const classes = await collections.classes.aggregate(pipeline).toArray();
    const classData = classes[0];

    if (!classData) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error("Error fetching class:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// PUT - Update class by ID
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
    const { name, majorId, homeroomTeacherId } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama kelas diperlukan",
        },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if class exists
    const existingClass = await collections.classes.findOne({
      _id: new ObjectId(id),
    });
    if (!existingClass) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if name is used by another class
    const nameExists = await collections.classes.findOne({
      name,
      _id: { $ne: new ObjectId(id) },
    });
    if (nameExists) {
      return NextResponse.json(
        { success: false, message: "Nama kelas sudah digunakan" },
        { status: 400 }
      );
    }

    // Validate homeroom teacher if provided
    if (homeroomTeacherId) {
      const teacher = await collections.teachers.findOne({
        _id: new ObjectId(homeroomTeacherId),
      });
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Guru wali kelas tidak ditemukan" },
          { status: 400 }
        );
      }
    }

    // Update class
    const updateData = {
      name,
      majorId: majorId || "",
      homeroomTeacherId: homeroomTeacherId || "",
      updatedAt: new Date(),
    };

    const result = await collections.classes.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil diperbarui",
      data: { _id: id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating class:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete class by ID
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Format ID tidak valid" },
        { status: 400 }
      );
    }

    const collections = await getCollections();

    // Check if class exists
    const existingClass = await collections.classes.findOne({
      _id: new ObjectId(id),
    });
    if (!existingClass) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if class has students
    const studentsInClass = await collections.students.countDocuments({
      class: existingClass.name,
    });
    if (studentsInClass > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Kelas tidak dapat dihapus karena masih memiliki siswa",
        },
        { status: 400 }
      );
    }

    // Soft delete class
    const result = await collections.classes.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: 500 }
    );
  }
}
