import { prisma } from "@/lib/database/prisma";
import { GalleryRepository, FindGalleryParams } from "./gallery";

export const galleryPrismaRepository: GalleryRepository = {
  async findMany(params: FindGalleryParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { category: { contains: params.search, mode: "insensitive" } },
    ];
    if (params.category) where.category = params.category;
    if (typeof params.isPublished === "boolean") where.isPublished = params.isPublished;
    const [data, total] = await Promise.all([
      prisma.gallery.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.gallery.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.gallery.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.gallery.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
    update(id: string, payload: any) {
    return prisma.gallery.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.gallery.delete({ where: { id } });
  }
};


