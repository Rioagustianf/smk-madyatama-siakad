import { prisma } from "@/lib/database/prisma";
import { AdminsRepository, FindAdminsParams } from "./admins";

export const adminsPrismaRepository: AdminsRepository = {
  async findMany(params: FindAdminsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { username: { contains: params.search, mode: "insensitive" } },
    ];
    if (typeof params.isActive === "boolean") where.isActive = params.isActive;
    const [data, total] = await Promise.all([
      prisma.admin.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.admin.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.admin.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.admin.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.admin.delete({ where: { id } });
  }
};


