import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections, handleDatabaseError } from "@/lib/database/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");

    const { grades, subjects } = await getCollections();

    const filter: any = { studentId: id };
    if (semester) filter.semester = Number(semester);
    if (year) filter.year = Number(year);

    const items = await grades
      .find(filter)
      .sort({ updatedAt: -1, year: -1, semester: -1 })
      .toArray();

    // Enrich with subject name when possible
    const subjectIds = Array.from(
      new Set(
        items
          .map((g: any) => g.subjectId)
          .filter((sid: any) => typeof sid === "string" && sid.trim() !== "")
      )
    );

    let subjectDocs: Record<string, string> = {};
    if (subjectIds.length > 0) {
      const docs = await subjects
        .find({
          _id: {
            $in: subjectIds
              .filter((x) => ObjectId.isValid(x))
              .map((x) => new ObjectId(x)),
          },
        })
        .toArray();
      docs.forEach((s: any) => {
        subjectDocs[String(s._id)] = s.name;
      });
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
    return handleDatabaseError(error);
  }
}
