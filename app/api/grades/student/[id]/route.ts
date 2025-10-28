import { NextRequest, NextResponse } from "next/server";
import { handleDatabaseError } from "@/lib/database/errors";
import { getGradesRepository, getSubjectsRepository } from "@/lib/database/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");

    const repo = getGradesRepository();
    const items = await repo.findByStudent(id);

    // Enrich with subject name
    const subjectsRepo = getSubjectsRepository();
    const subjectIds = Array.from(
      new Set(
        items
          .map((g: any) => g.subjectId)
          .filter((sid: any) => typeof sid === "string" && sid.trim() !== "")
      )
    );

    let subjectDocs: Record<string, string> = {};
    for (const sid of subjectIds) {
      try {
        const subject = await subjectsRepo.findById(sid as string);
        if (subject) {
          subjectDocs[sid as string] = subject.name;
        }
      } catch {
        // Ignore if subject not found
      }
    }

    const data = items.map((g: any) => ({
      ...g,
      subjectName:
        subjectDocs[String(g.subjectId)] ||
        g.subjectName ||
        g.subject ||
        g.subjectId ||
        "",
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorResponse = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.status }
    );
  }
}
