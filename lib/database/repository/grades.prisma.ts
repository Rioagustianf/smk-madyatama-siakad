import { prisma } from "@/lib/database/prisma";
import { GradesRepository, FindGradesParams } from "./grades";

export const gradesPrismaRepository: GradesRepository = {
  async findMany(params: FindGradesParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.studentId) where.studentId = params.studentId;
    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.teacherId) where.teacherId = params.teacherId;
    if (typeof params.semester === "number") where.semester = params.semester;
    if (typeof params.year === "number") where.year = params.year;
    const [data, total] = await Promise.all([
      prisma.grade.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.grade.count({ where })
    ]);
    return { data, total };
  },
  async findByStudent(studentId: string) {
    return prisma.grade.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  },
  async bulkUpsert(data: any[]) {
    const results = [];
    for (const item of data) {
      // Find existing grade
      const existing = await prisma.grade.findFirst({
        where: {
          studentId: item.studentId,
          subjectId: item.subjectId,
          semester: item.semester,
          year: item.year,
        },
      });

      if (existing) {
        // Update existing grade
        const result = await prisma.grade.update({
          where: { id: existing.id },
          data: {
            assignments: item.assignments || item.score,
            midterm: item.midterm || item.score,
            final: item.final || item.score,
            updatedAt: new Date(),
          },
        });
        results.push(result);
      } else {
        // Create new grade
        const result = await prisma.grade.create({
          data: {
            studentId: item.studentId,
            subjectId: item.subjectId,
            teacherId: item.teacherId,
            semester: item.semester,
            year: item.year,
            assignments: item.assignments || item.score,
            midterm: item.midterm || item.score,
            final: item.final || item.score,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        results.push(result);
      }
    }
    return results;
  },
  create(payload: any) {
    return prisma.grade.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.grade.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.grade.delete({ where: { id } });
  }
};


