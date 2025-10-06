import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/database/mongodb";

export const dynamic = "force-dynamic";

function toCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function rowsToCsv(
  headers: string[],
  rows: Array<Record<string, unknown>>
): string {
  const headerLine = headers.map(toCsvValue).join(",");
  const lines = rows.map((row) =>
    headers.map((h) => toCsvValue(row[h])).join(",")
  );
  return [headerLine, ...lines].join("\n");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "csv").toLowerCase();

    const collections = await getCollections();

    const [students, teachers, admins] = await Promise.all([
      collections.students.find({}).toArray(),
      collections.teachers.find({}).toArray(),
      collections.admins.find({}).toArray(),
    ]);

    const studentRows = students.map((s: any) => ({
      username: s.username,
      password: "password123",
    }));

    const teacherRows = teachers.map((t: any) => ({
      username: t.username,
      password: "password123",
    }));

    const adminRows = admins.map((a: any) => ({
      username: a.username,
      password: "admin123",
    }));

    if (format === "json") {
      return NextResponse.json({
        students: studentRows,
        teachers: teacherRows,
        admins: adminRows,
      });
    }

    const role = (searchParams.get("role") || "").toLowerCase();
    const headers = ["username", "password"];

    let rows: Array<Record<string, unknown>> = [];
    let filename = "accounts-credentials.csv";
    if (role === "students" || role === "student") {
      rows = studentRows as any;
      filename = "students-credentials.csv";
    } else if (role === "teachers" || role === "teacher") {
      rows = teacherRows as any;
      filename = "teachers-credentials.csv";
    } else if (role === "admins" || role === "admin") {
      rows = adminRows as any;
      filename = "admins-credentials.csv";
    } else {
      return NextResponse.json(
        {
          message:
            "Harap tentukan role untuk CSV melalui ?role=students|teachers|admins",
        },
        { status: 400 }
      );
    }

    const csvContent = rowsToCsv(headers, rows);

    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${filename}`,
        "Cache-Control": "no-store",
      },
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil data akun",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
