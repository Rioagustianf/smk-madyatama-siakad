import { prisma } from "@/lib/database/prisma";
import {
  AcademicEventsRepository,
  FindAcademicEventsParams,
} from "./academic-events";

export const academicEventsPrismaRepository: AcademicEventsRepository = {
  async findMany(params: FindAcademicEventsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 100);
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }

    if (params.type && params.type !== "all") {
      where.type = params.type;
    }

    if (typeof params.isPublished === "boolean") {
      where.isPublished = params.isPublished;
    }

    // Filter by year and month if provided
    if (params.year && params.month) {
      const startDate = new Date(params.year, params.month - 1, 1);
      const endDate = new Date(params.year, params.month, 0);

      where.OR = [
        {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: endDate } },
          ],
        },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.academicEvent.findMany({
        where,
        orderBy: { startDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.academicEvent.count({ where }),
    ]);

    return { data, total };
  },

  findById(id: string) {
    return prisma.academicEvent.findUnique({ where: { id } });
  },

  create(payload: any) {
    return prisma.academicEvent.create({
      data: {
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },

  update(id: string, payload: any) {
    return prisma.academicEvent.update({
      where: { id },
      data: {
        ...payload,
        updatedAt: new Date(),
      },
    });
  },

  async remove(id: string) {
    await prisma.academicEvent.delete({ where: { id } });
  },
};
