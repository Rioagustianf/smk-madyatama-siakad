import { Prisma, MajorAlumni } from "@prisma/client";

export type FindMajorAlumniParams = {
  search?: string;
  page?: number;
  limit?: number;
  majorId?: string;
};

export interface MajorAlumniRepository {
  findMany(
    params: FindMajorAlumniParams,
  ): Promise<{ data: MajorAlumni[]; total: number }>;
  findById(id: string): Promise<MajorAlumni | null>;
  create(payload: any): Promise<MajorAlumni>;
  update(id: string, payload: any): Promise<MajorAlumni>;
  remove(id: string): Promise<void>;
}
