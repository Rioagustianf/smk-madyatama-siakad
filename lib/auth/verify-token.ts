import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface TokenPayload {
  id: string;
  role: "admin" | "teacher" | "student";
  name: string;
}

export function verifyToken(request: NextRequest): {
  user?: TokenPayload;
  error?: string;
  status?: number;
} {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token tidak ditemukan", status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { user: decoded };
  } catch (error) {
    return { error: "Token tidak valid", status: 401 };
  }
}

export function verifyAdminToken(request: NextRequest) {
  const result = verifyToken(request);

  if (result.error) {
    return result;
  }

  if (result.user?.role !== "admin") {
    return {
      error: "Akses ditolak. Hanya admin yang dapat mengakses",
      status: 403,
    };
  }

  return { user: result.user };
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

