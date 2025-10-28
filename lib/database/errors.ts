import { NextResponse } from "next/server";

export const handleDatabaseError = (error: any): any => {
  console.error("Database error:", error);

  if (error?.code === "P2002" || error?.code === 11000) {
    const field = Array.isArray(error?.meta?.target)
      ? error.meta.target[0]
      : Object.keys(error.keyPattern || {})[0] || "unknown";
    const payload = {
      success: false,
      message: `${field} sudah digunakan`,
      field,
      code: "DUPLICATE_KEY",
    } as const;
    const res = NextResponse.json(payload, { status: 409 });
    (res as any).message = payload.message;
    return res as any;
  }

  const payload = {
    success: false,
    message: "Terjadi kesalahan pada database",
    code: "DATABASE_ERROR",
  } as const;
  const res = NextResponse.json(payload, { status: 500 });
  (res as any).message = payload.message;
  return res as any;
};


