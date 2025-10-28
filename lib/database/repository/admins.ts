export type FindAdminsParams = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export interface AdminsRepository {
  findMany(params: FindAdminsParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


