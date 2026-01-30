import { prisma } from "@/lib/database/prisma";
import { MajorsRepository, FindMajorsParams } from "./majors";

export const majorsPrismaRepository: MajorsRepository = {
  async findMany(params: FindMajorsParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const search = params.search?.trim() || "";

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.major.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          alumni: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.major.count({ where }),
    ]);

    // Compute totalStudents by grouping students.major = major.name
    const majorNames = data.map((m: any) => m.name);
    if (majorNames.length > 0) {
      const rows = await prisma.student.groupBy({
        by: ["major"],
        where: { major: { in: majorNames } },
        _count: { _all: true },
      });
      const map = new Map<string, number>();
      rows.forEach((r: any) => map.set(r.major, r._count._all));
      const merged = data.map((m: any) => ({
        ...m,
        totalStudents: map.get(m.name) ?? m.totalStudents ?? 0,
      }));
      return { data: merged, total };
    }

    return { data, total };
  },

  findById(id: string) {
    return prisma.major.findUnique({ where: { id } });
  },

  async create(payload: any) {
    try {
      const created = await prisma.major.create({
        data: {
          name: payload.name,
          code: payload.code,
          description: payload.description || "",
          image: payload.image || "",
          facilities: Array.isArray(payload.facilities)
            ? payload.facilities
            : [],
          careerProspects: Array.isArray(payload.careerProspects)
            ? payload.careerProspects
            : [],
          headName: payload.headName || "",
          headPhoto: payload.headPhoto || "",
          vision: payload.vision || "",
          mission: payload.mission || "",
          totalStudents: 0,
        },
      });
      return created;
    } catch (err: any) {
      if (err?.code === "P2002") {
        const field = Array.isArray(err?.meta?.target)
          ? err.meta.target[0]
          : err?.meta?.target || "code";
        const dup = new Error("Unique constraint failed");
        (dup as any).code = 11000;
        (dup as any).keyPattern = { [field]: 1 };
        throw dup;
      }
      throw err;
    }
  },

  update(id: string, payload: any) {
    return prisma.major.update({
      where: { id },
      data: {
        name: payload.name,
        code: payload.code,
        description: payload.description || "",
        image: payload.image || "",
        facilities: Array.isArray(payload.facilities) ? payload.facilities : [],
        careerProspects: Array.isArray(payload.careerProspects)
          ? payload.careerProspects
          : [],
        headName: payload.headName || "",
        headPhoto: payload.headPhoto || "",
        vision: payload.vision || "",
        mission: payload.mission || "",
        updatedAt: new Date(),
      },
    });
  },

  async remove(id: string) {
    await prisma.major.delete({ where: { id } });
  },
};
