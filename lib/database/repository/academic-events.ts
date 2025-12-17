export type FindAcademicEventsParams = {
  search?: string;
  type?: string;
  year?: number;
  month?: number;
  isPublished?: boolean;
  page?: number;
  limit?: number;
};

export interface AcademicEventsRepository {
  findMany(
    params: FindAcademicEventsParams
  ): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}
