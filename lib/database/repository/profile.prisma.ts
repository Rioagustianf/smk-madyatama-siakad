import { prisma } from "@/lib/database/prisma";
import { ProfileRepository } from "./profile";

export const profilePrismaRepository: ProfileRepository = {
  async get() {
    return prisma.profile.findFirst();
  },
  async upsert(payload: any) {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      return prisma.profile.update({ where: { id: existing.id }, data: { ...payload, updatedAt: new Date() } });
    }
    return prisma.profile.create({ data: { ...payload, updatedAt: new Date() } });
  }
};


