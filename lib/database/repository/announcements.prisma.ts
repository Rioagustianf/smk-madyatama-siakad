import { prisma } from "@/lib/database/prisma";
import { AnnouncementsRepository, FindAnnouncementsParams } from "./announcements";

export const announcementsPrismaRepository: AnnouncementsRepository = {
  async findMany(params: FindAnnouncementsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { content: { contains: params.search, mode: "insensitive" } },
      { category: { contains: params.search, mode: "insensitive" } },
    ];
    if (params.category) where.category = params.category;
    if (typeof params.isPublished === "boolean") where.isPublished = params.isPublished;
    const [data, total] = await Promise.all([
      prisma.announcement.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.announcement.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.announcement.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.announcement.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.announcement.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.announcement.delete({ where: { id } });
  }
};


