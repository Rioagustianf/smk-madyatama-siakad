import { prisma } from "@/lib/database/prisma";
import { StudentsRepository, FindStudentsParams } from "./students";

export const studentsPrismaRepository: StudentsRepository = {
  async findMany(params: FindStudentsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const where: any = {};
    if (search) where.name = { contains: search };
    if (params.major) where.major = params.major;
    if (params.className) where.class = params.className;
    if (typeof params.gradeLevel === "number")
      where.gradeLevel = params.gradeLevel;
    if (typeof params.semester === "number") where.semester = params.semester;

    const sortBy = params.sortBy || "name";
    const sortOrder = params.sortOrder || "asc";
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      prisma.student.findMany({ where, orderBy, skip, take: limit }),
      prisma.student.count({ where }),
    ]);
    return { data, total };
  },

  async create(payload: any) {
    const created = await prisma.student.create({
      data: { ...payload, createdAt: new Date(), updatedAt: new Date() },
    });
    return created;
  },

  async update(id: string, payload: any) {
    const updated = await prisma.student.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });
    return updated;
  },

  async remove(id: string) {
    await prisma.student.delete({ where: { id } });
  },
};
