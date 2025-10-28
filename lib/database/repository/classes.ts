export type FindClassesParams = {
  search?: string;
  majorId?: string;
  homeroomTeacherId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export interface ClassesRepository {
  findMany(params: FindClassesParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


