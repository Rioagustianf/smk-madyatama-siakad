import { prisma } from "@/lib/database/prisma";
import { MajorAlumniRepository, FindMajorAlumniParams } from "./major-alumni";

export const majorAlumniPrismaRepository: MajorAlumniRepository = {
  async findMany(params: FindMajorAlumniParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const search = params.search?.trim() || "";
    const majorId = params.majorId;

    const where: any = {};

    if (majorId) {
      where.majorId = majorId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { workAt: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.majorAlumni.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          major: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.majorAlumni.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: string) {
    return prisma.majorAlumni.findUnique({
      where: { id },
    });
  },

  async create(payload: any) {
    return prisma.majorAlumni.create({
      data: {
        name: payload.name,
        photo: payload.photo || null,
        workAt: payload.workAt,
        majorId: payload.majorId,
      },
    });
  },

  async update(id: string, payload: any) {
    return prisma.majorAlumni.update({
      where: { id },
      data: {
        name: payload.name,
        photo: payload.photo || null,
        workAt: payload.workAt,
        // majorId biasanya tidak diupdate, tapi jika perlu bisa ditambahkan
        updatedAt: new Date(),
      },
    });
  },

  async remove(id: string) {
    await prisma.majorAlumni.delete({
      where: { id },
    });
  },
};
