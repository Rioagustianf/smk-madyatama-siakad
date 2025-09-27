import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase, getCollections } from "@/lib/database/mongodb";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Prevent static generation
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password diperlukan" },
        { status: 400 }
      );
    }

    const collections = await getCollections();
    let user = null;
    let userCollection = null;

    // Find user based on role or try all collections
    if (role) {
      switch (role) {
        case "admin":
          userCollection = collections.admins;
          break;
        case "teacher":
          userCollection = collections.teachers;
          break;
        case "student":
          userCollection = collections.students;
          break;
      }
    } else {
      // Try to find user in any collection
      const adminUser = await collections.admins.findOne({ username });
      const teacherUser = await collections.teachers.findOne({ username });
      const studentUser = await collections.students.findOne({ username });

      if (adminUser) {
        user = adminUser;
        userCollection = collections.admins;
      } else if (teacherUser) {
        user = teacherUser;
        userCollection = collections.teachers;
      } else if (studentUser) {
        user = studentUser;
        userCollection = collections.students;
      }
    }

    if (!user && userCollection) {
      user = await userCollection.findOne({ username });
    }

    if (!user) {
      return NextResponse.json(
        { message: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: "Akun tidak aktif" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      (user as any).password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      username: (user as any).username,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      ...(user.role === "admin" && { permissions: (user as any).permissions }),
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

    return NextResponse.json({
      message: "Login berhasil",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
