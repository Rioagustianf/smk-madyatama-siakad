import { prisma } from "@/lib/database/prisma";
import { ClassesRepository, FindClassesParams } from "./classes";

export const classesPrismaRepository: ClassesRepository = {
  async findMany(params: FindClassesParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.name = { contains: params.search, mode: "insensitive" };
    if (params.majorId) where.majorId = params.majorId;
    if (params.homeroomTeacherId) where.homeroomTeacherId = params.homeroomTeacherId;
    if (typeof params.isActive === "boolean") where.isActive = params.isActive;
    
    try {
      const [data, total] = await Promise.all([
        prisma.schoolClass.findMany({
          where,
          include: {
            major: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            homeroomTeacher: {
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
        prisma.schoolClass.count({ where })
      ]);

      // Transform data to include majorName and homeroomTeacherName
      const transformedData = data.map((cls: any) => ({
        ...cls,
        majorName: cls.major?.name || "-",
        homeroomTeacherName: cls.homeroomTeacher?.name || "-",
      }));

      return { data: transformedData, total };
    } catch (error) {
      console.error("Error in classesPrismaRepository.findMany:", error);
      // Fallback to simple query without relations
      const [data, total] = await Promise.all([
        prisma.schoolClass.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.schoolClass.count({ where })
      ]);

      // Transform data with fallback values
      const transformedData = data.map((cls: any) => ({
        ...cls,
        majorName: "-",
        homeroomTeacherName: "-",
      }));

      return { data: transformedData, total };
    }
  },
  findById(id: string) {
    return prisma.schoolClass.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.schoolClass.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.schoolClass.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.schoolClass.delete({ where: { id } });
  }
};


