import { prisma } from "@/lib/database/prisma";
import { SchedulesRepository, FindSchedulesParams } from "./schedules";

export const schedulesPrismaRepository: SchedulesRepository = {
  async findMany(params: FindSchedulesParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    
    // Handle different parameter names from API
    if (params.classFilter) where.class = params.classFilter;
    if (params.teacherFilter) where.teacher = params.teacherFilter;
    if (params.className) where.class = params.className;
    if (params.teacher) where.teacher = params.teacher;
    if (params.day) where.day = params.day;
    if (params.search) {
      where.OR = [
        { class: { contains: params.search, mode: "insensitive" } },
        { subject: { contains: params.search, mode: "insensitive" } },
        { teacher: { contains: params.search, mode: "insensitive" } },
      ];
    }
    
    const [data, total] = await Promise.all([
      prisma.schedule.findMany({ 
        where, 
        orderBy: { createdAt: "desc" }, 
        skip, 
        take: limit 
      }),
      prisma.schedule.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.schedule.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.schedule.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.schedule.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.schedule.delete({ where: { id } });
  }
};


