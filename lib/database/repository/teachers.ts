export type FindTeachersParams = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};
export interface TeachersRepository {
  findMany(params: FindTeachersParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}
