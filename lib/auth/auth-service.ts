import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";
import { createToken, TokenPayload } from "./verify-token";

export interface LoginCredentials {
  username: string;
  password: string;
  role?: "admin" | "teacher" | "student" | "staff";
}

export interface UserData {
  id: string;
  username: string;
  name: string;
  role: string;
  [key: string]: any;
}

export async function authenticateUser(credentials: LoginCredentials): Promise<{
  success: boolean;
  user?: UserData;
  token?: string;
  message: string;
}> {
  const { username, password, role } = credentials;

  try {
    let user: any = null;
    let userRole: string = "";

    // Find user based on role or try all tables
    if (role) {
      switch (role) {
        case "admin":
          user = await prisma.admin.findUnique({ where: { username } });
          userRole = "admin";
          break;
        case "teacher":
          user = await prisma.teacher.findUnique({ where: { username } });
          userRole = "teacher";
          break;
        case "student":
          user = await prisma.student.findUnique({ where: { username } });
          userRole = "student";
          break;
        case "staff":
          user = await prisma.staff.findUnique({ where: { username } as any });
          userRole = "staff";
          break;
      }
    } else {
      // Try to find user in any table
      const adminUser = await prisma.admin.findUnique({ where: { username } });
      const teacherUser = await prisma.teacher.findUnique({
        where: { username },
      });
      const studentUser = await prisma.student.findUnique({
        where: { username },
      });
      const staffUser = await prisma.staff.findUnique({
        where: { username } as any,
      });

      if (adminUser) {
        user = adminUser;
        userRole = "admin";
      } else if (teacherUser) {
        user = teacherUser;
        userRole = "teacher";
      } else if (studentUser) {
        user = studentUser;
        userRole = "student";
      } else if (staffUser) {
        user = staffUser;
        userRole = "staff";
      }
    }

    if (!user) {
      return { success: false, message: "Username atau password salah" };
    }

    // Check if user is active
    if (!user.isActive) {
      return { success: false, message: "Akun tidak aktif" };
    }

    // Verify password
    if (!user.password) {
      return {
        success: false,
        message: "Password tidak tersedia untuk user ini",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Username atau password salah" };
    }

    // Create JWT token
    // For staff users, always use 'staff' as the role in the token
    // The 'role' field in Staff table is for position type (e.g., 'finance', 'academic')
    const tokenRole = userRole === "staff" ? "staff" : user.role || userRole;

    console.log("🔑 Creating token for user:", {
      id: user.id,
      role: tokenRole,
      name: user.name,
      userRole,
      userRoleFromDB: user.role,
    });

    const token = createToken({
      id: user.id,
      role: tokenRole as any,
      name: user.name,
    });

    console.log("✅ Token created successfully");

    // Return user data without password
    const userData: UserData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: tokenRole,
    };

    // Add role-specific fields
    if (userRole === "admin") {
      userData.permissions = user.permissions;
    } else if (userRole === "teacher") {
      userData.subjects = user.subjects;
      userData.classes = user.classes;
      userData.education = user.education;
      userData.phone = user.phone;
    } else if (userRole === "student") {
      userData.studentId = user.studentId;
      userData.class = user.class;
      userData.major = user.major;
      userData.nisn = user.nisn;
      userData.year = user.year;
      userData.gradeLevel = user.gradeLevel;
      userData.semester = user.semester;
    } else if (userRole === "staff") {
      userData.position = user.position;
      userData.department = user.department;
      userData.email = user.email;
      userData.phone = user.phone;
    }

    return {
      success: true,
      user: userData,
      token,
      message: "Login berhasil",
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, message: "Terjadi kesalahan server" };
  }
}

export async function getUserProfile(
  userId: string,
  role: string
): Promise<UserData | null> {
  try {
    let user: any = null;

    switch (role) {
      case "admin":
        user = await prisma.admin.findUnique({ where: { id: userId } });
        break;
      case "teacher":
        user = await prisma.teacher.findUnique({ where: { id: userId } });
        break;
      case "student":
        user = await prisma.student.findUnique({ where: { id: userId } });
        break;
      case "staff":
        user = await prisma.staff.findUnique({ where: { id: userId } });
        break;
    }

    if (!user || !user.isActive) {
      return null;
    }

    const userData: UserData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role || role,
    };

    // Add role-specific fields
    if (role === "admin") {
      userData.permissions = user.permissions;
      userData.avatar = user.avatar;
    } else if (role === "teacher") {
      userData.subjects = user.subjects;
      userData.classes = user.classes;
      userData.education = user.education;
      userData.phone = user.phone;
      userData.avatar = user.avatar;
    } else if (role === "student") {
      userData.studentId = user.studentId;
      userData.class = user.class;
      userData.major = user.major;
      userData.nisn = user.nisn;
      userData.year = user.year;
      userData.gradeLevel = user.gradeLevel;
      userData.semester = user.semester;
      userData.phone = user.phone;
      userData.avatar = user.avatar;
    } else if (role === "staff") {
      userData.position = user.position;
      userData.department = user.department;
      userData.email = user.email;
      userData.phone = user.phone;
      userData.avatar = user.image; // Staff menggunakan field 'image'
    }

    return userData;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  role: string,
  updateData: {
    name?: string;
    username?: string;
    phone?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // Find user
    let userDoc: any = null;
    switch (role) {
      case "admin":
        userDoc = await prisma.admin.findUnique({ where: { id: userId } });
        break;
      case "teacher":
        userDoc = await prisma.teacher.findUnique({ where: { id: userId } });
        break;
      case "student":
        userDoc = await prisma.student.findUnique({ where: { id: userId } });
        break;
      case "staff":
        userDoc = await prisma.staff.findUnique({ where: { id: userId } });
        break;
    }

    if (!userDoc) {
      return { success: false, message: "Akun tidak ditemukan" };
    }

    const updateDoc: any = {};
    if (typeof updateData.name === "string") updateDoc.name = updateData.name;
    if (typeof updateData.username === "string")
      updateDoc.username = updateData.username;
    if (typeof updateData.phone === "string")
      updateDoc.phone = updateData.phone;
    // Handle avatar for all roles (staff uses 'image' field)
    if (typeof updateData.avatar === "string") {
      if (role === "staff") {
        updateDoc.image = updateData.avatar;
      } else {
        updateDoc.avatar = updateData.avatar;
      }
    }

    if (updateData.newPassword) {
      // Validate current password if set
      if (!updateData.currentPassword) {
        return { success: false, message: "Password saat ini diperlukan" };
      }
      const valid = await bcrypt.compare(
        updateData.currentPassword,
        userDoc.password || ""
      );
      if (!valid) {
        return { success: false, message: "Password saat ini salah" };
      }
      const hashed = await bcrypt.hash(updateData.newPassword, 10);
      updateDoc.password = hashed;
    }

    if (Object.keys(updateDoc).length === 0) {
      return { success: true, message: "Tidak ada perubahan" };
    }

    // Update user
    switch (role) {
      case "admin":
        await prisma.admin.update({ where: { id: userId }, data: updateDoc });
        break;
      case "teacher":
        await prisma.teacher.update({ where: { id: userId }, data: updateDoc });
        break;
      case "student":
        await prisma.student.update({ where: { id: userId }, data: updateDoc });
        break;
      case "staff":
        await prisma.staff.update({ where: { id: userId }, data: updateDoc });
        break;
    }

    return { success: true, message: "Akun diperbarui" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Terjadi kesalahan server" };
  }
}
