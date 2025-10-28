export type FindGalleryParams = {
  search?: string;
  category?: string;
  type?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
};

export interface GalleryRepository {
  findMany(params: FindGalleryParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


