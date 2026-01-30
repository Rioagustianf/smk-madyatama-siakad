import { prisma } from "@/lib/database/prisma";
import { SubjectsRepository, FindSubjectsParams } from "./subjects";

export const subjectsPrismaRepository: SubjectsRepository = {
  async findMany(params: FindSubjectsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search)
      where.OR = [
        { name: { contains: params.search } },
        { code: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    if (params.teacherId) where.teacherId = params.teacherId;
    if (typeof params.isActive === "boolean") where.isActive = params.isActive;
    const [data, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.subject.count({ where }),
    ]);

    // Transform data to include teacherName
    const transformedData = data.map((subject: any) => ({
      ...subject,
      teacherName: subject.teacher?.name || "-",
      teacherId: subject.teacherId,
    }));

    return { data: transformedData, total };
  },
  findById(id: string) {
    return prisma.subject.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.subject.create({
      data: { ...payload, createdAt: new Date(), updatedAt: new Date() },
    });
  },
  update(id: string, payload: any) {
    return prisma.subject.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });
  },
  async remove(id: string) {
    await prisma.subject.delete({ where: { id } });
  },
};
