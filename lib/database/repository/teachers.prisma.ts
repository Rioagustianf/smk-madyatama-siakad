import { prisma } from "@/lib/database/prisma";
import { TeachersRepository, FindTeachersParams } from "./teachers";

export const teachersPrismaRepository: TeachersRepository = {
  async findMany(params) {
    const { search = "", isActive = true, page = 1, limit = 10 } = params;
    const skip = (Math.max(1, page) - 1) * limit;
    const where: any = { };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { username: { contains: search } },
        { education: { contains: search } },
      ];
    }
    if (typeof isActive === "boolean") where.isActive = isActive;
    const [data, total] = await Promise.all([
      prisma.teacher.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.teacher.count({ where })
    ]);
    return { data, total };
  },
  async findById(id) {
    return prisma.teacher.findUnique({ where: { id } });
  },
  async create(payload) {
    return prisma.teacher.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  async update(id, payload) {
    return prisma.teacher.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id) {
    await prisma.teacher.update({ where: { id }, data: { isActive: false, updatedAt: new Date() } });
  },
};
