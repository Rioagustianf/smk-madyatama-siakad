import { prisma } from "@/lib/database/prisma";
import { ActivitiesRepository, FindActivitiesParams } from "./activities";

export const activitiesPrismaRepository: ActivitiesRepository = {
  async findMany(params: FindActivitiesParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search)
      where.OR = [
        { title: { contains: params.search } },
        { description: { contains: params.search } },
        { category: { contains: params.search } },
      ];
    if (params.category) where.category = params.category;
    if (params.kind) where.kind = params.kind;
    if (typeof params.isPublished === "boolean")
      where.isPublished = params.isPublished;
    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.activity.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.activity.create({
      data: { ...payload, createdAt: new Date(), updatedAt: new Date() },
    });
  },
  update(id: string, payload: any) {
    return prisma.activity.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });
  },
  async remove(id: string) {
    await prisma.activity.delete({ where: { id } });
  },
};
