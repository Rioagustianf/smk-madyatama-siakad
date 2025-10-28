export type FindMajorsParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export interface MajorsRepository {
  findMany(params: FindMajorsParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


