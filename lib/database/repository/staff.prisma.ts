import { prisma } from "@/lib/database/prisma";
import { StaffRepository, FindStaffParams } from "./staff";

export const staffPrismaRepository: StaffRepository = {
  async findMany(params: FindStaffParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { position: { contains: params.search, mode: "insensitive" } },
      { department: { contains: params.search, mode: "insensitive" } },
    ];
    if (params.department) where.department = params.department;
    if (typeof params.isActive === "boolean") where.isActive = params.isActive;
    const [data, total] = await Promise.all([
      prisma.staff.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.staff.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.staff.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.staff.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.staff.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.staff.delete({ where: { id } });
  }
};


