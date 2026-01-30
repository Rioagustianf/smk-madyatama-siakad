import { prisma } from "@/lib/database/prisma";
import {
  InternshipPartnersRepository,
  InternshipSchedulesRepository,
  FindPartnersParams,
  FindSchedulesParams,
} from "./internships";

export const internshipPartnersPrismaRepository: InternshipPartnersRepository = {
  async findMany(params: FindPartnersParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.search) where.OR = [
      { name: { contains: params.search } },
      { address: { contains: params.search } },
      { contact: { contains: params.search } },
    ];
    if (typeof params.isActive === "boolean") where.isActive = params.isActive;
    const [data, total] = await Promise.all([
      prisma.internshipPartner.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.internshipPartner.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.internshipPartner.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.internshipPartner.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.internshipPartner.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.internshipPartner.delete({ where: { id } });
  }
};

export const internshipSchedulesPrismaRepository: InternshipSchedulesRepository = {
  async findMany(params: FindSchedulesParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;
    const where: any = {};
    if (params.partnerId) where.partnerId = params.partnerId;
    if (params.class) where.class = params.class;
    const [data, total] = await Promise.all([
      prisma.internshipSchedule.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.internshipSchedule.count({ where })
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.internshipSchedule.findUnique({ where: { id } });
  },
  create(payload: any) {
    return prisma.internshipSchedule.create({ data: { ...payload, createdAt: new Date(), updatedAt: new Date() } });
  },
  update(id: string, payload: any) {
    return prisma.internshipSchedule.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  },
  async remove(id: string) {
    await prisma.internshipSchedule.delete({ where: { id } });
  }
};


