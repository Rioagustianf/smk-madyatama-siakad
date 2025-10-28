export type FindAnnouncementsParams = {
  search?: string;
  category?: string;
  priority?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
};

export interface AnnouncementsRepository {
  findMany(params: FindAnnouncementsParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


