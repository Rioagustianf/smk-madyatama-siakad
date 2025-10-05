import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectToDatabase, getCollections } from "@/lib/database/mongodb";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const collections = await getCollections();
      let user = null;

      // Find user based on role
      switch (decoded.role) {
        case "admin":
          user = await collections.admins.findOne({
            _id: new ObjectId(decoded.id),
          });
          break;
        case "teacher":
          user = await collections.teachers.findOne({
            _id: new ObjectId(decoded.id),
          });
          break;
        case "student":
          user = await collections.students.findOne({
            _id: new ObjectId(decoded.id),
          });
          break;
      }

      if (!user || !user.isActive) {
        return NextResponse.json(
          { message: "User tidak ditemukan atau tidak aktif" },
          { status: 401 }
        );
      }

      // Return user data without password
      const userData = {
        id: user._id.toString(),
        username: (user as any).username,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        ...(user.role === "admin" && {
          permissions: (user as any).permissions,
        }),
        ...(user.role === "teacher" && {
          subjects: (user as any).subjects,
          classes: (user as any).classes,
          education: (user as any).education,
        }),
        ...(user.role === "student" && {
          studentId: (user as any).studentId,
          class: (user as any).class,
          major: (user as any).major,
          nisn: (user as any).nisn,
        }),
      };

      return NextResponse.json(userData);
    } catch (jwtError) {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 401 }
      );
    }
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
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded?.id || !decoded?.role) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { name, username, currentPassword, newPassword } =
      await request.json();
    const collections = await getCollections();
    const colMap: Record<string, any> = {
      admin: collections.admins,
      teacher: collections.teachers,
      student: collections.students,
    };
    const col = colMap[decoded.role];
    if (!col) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    const userDoc = await col.findOne({ _id: new ObjectId(decoded.id) });
    if (!userDoc) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateDoc: any = {};
    if (typeof name === "string") updateDoc.name = name;
    if (typeof username === "string") updateDoc.username = username;

    if (newPassword) {
      // Validate current password if set
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Password saat ini diperlukan" },
          { status: 400 }
        );
      }
      const bcrypt = (await import("bcryptjs")).default;
      const valid = await bcrypt.compare(
        currentPassword,
        (userDoc as any).password || ""
      );
      if (!valid) {
        return NextResponse.json(
          { message: "Password saat ini salah" },
          { status: 400 }
        );
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      updateDoc.password = hashed;
    }

    if (Object.keys(updateDoc).length === 0) {
      return NextResponse.json({ message: "Tidak ada perubahan" });
    }

    await col.updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: { ...updateDoc, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Akun diperbarui" });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
