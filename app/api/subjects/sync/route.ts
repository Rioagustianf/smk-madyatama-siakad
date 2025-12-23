import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get all unique subjects from schedules
    const schedules = await prisma.schedule.findMany({
      where: { isActive: true },
      select: { subject: true },
    });

    const uniqueSubjects = [...new Set(schedules.map((s) => s.subject))];

    // Subject aliases for better matching
    const subjectData: Record<string, { code: string; description: string }> = {
      SENAM: { code: "SENAM", description: "Senam Pagi" },
      UPACARA: { code: "UPACARA", description: "Upacara Bendera" },
      Adminfrajar: {
        code: "AIJ",
        description: "Administrasi Infrastruktur Jaringan",
      },
      Teklayjar: { code: "TLJ", description: "Teknik Layanan Jaringan" },
      Agama: { code: "Agama", description: "Pendidikan Agama Islam" },
      "Agama Islam": {
        code: "Agama Islam",
        description: "Pendidikan Agama Islam",
      },
      "B. Inggris": { code: "B. Inggris", description: "Bahasa Inggris" },
      "B. Indonesia": { code: "B. Indonesia", description: "Bahasa Indonesia" },
      MTK: { code: "MTK", description: "Matematika" },
      PKK: { code: "PKK", description: "Produk Kreatif Kewirausahaan" },
      PKN: { code: "PKN", description: "Pendidikan Kewarganegaraan" },
      ASJ: { code: "ASJ", description: "Administrasi Sistem Jaringan" },
      TLJ: { code: "TLJ", description: "Teknik Layanan Jaringan" },
      AIJ: { code: "AIJ", description: "Administrasi Infrastruktur Jaringan" },
    };

    const created = [];
    const skipped = [];

    for (const subjectName of uniqueSubjects) {
      // Check if already exists
      const existing = await prisma.subject.findFirst({
        where: {
          OR: [{ name: subjectName }, { code: subjectName }],
        },
      });

      if (existing) {
        skipped.push(subjectName);
        continue;
      }

      // Create new subject
      const data = subjectData[subjectName] || {
        code: subjectName,
        description: `Mata pelajaran ${subjectName}`,
      };

      await prisma.subject.create({
        data: {
          name: subjectName,
          code: data.code,
          description: data.description,
          isActive: true,
        },
      });

      created.push(subjectName);
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} subjects, skipped ${skipped.length} existing`,
      created,
      skipped,
    });
  } catch (error: any) {
    console.error("Sync Subjects Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
