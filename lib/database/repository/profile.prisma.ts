import { prisma } from "@/lib/database/prisma";
import { ProfileRepository } from "./profile";

export const profilePrismaRepository: ProfileRepository = {
  async get() {
    return prisma.profile.findFirst();
  },
  async upsert(payload: any) {
    const existing = await prisma.profile.findFirst();
    
    // Prepare data for Prisma
    const data = {
      history: payload.history,
      historyImage: payload.historyImage,
      vision: payload.vision,
      mission: payload.mission,
      facilities: payload.facilities || null,
      organization: payload.organization || null,
      address: payload.address || null,
      contact: payload.contact || null,
    };

    if (existing) {
      return prisma.profile.update({ 
        where: { id: existing.id }, 
        data 
      });
    }
    return prisma.profile.create({ data });
  }
};


