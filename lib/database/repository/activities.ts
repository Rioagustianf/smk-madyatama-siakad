export type FindActivitiesParams = {
  search?: string;
  category?: string;
  kind?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
};

export interface ActivitiesRepository {
  findMany(params: FindActivitiesParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


