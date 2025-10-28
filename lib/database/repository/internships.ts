export type FindPartnersParams = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export interface InternshipPartnersRepository {
  findMany(params: FindPartnersParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}

export type FindSchedulesParams = {
  partnerId?: string;
  class?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export interface InternshipSchedulesRepository {
  findMany(params: FindSchedulesParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


