export type FindSchedulesParams = {
  className?: string;
  teacher?: string;
  day?: string;
  classFilter?: string;
  teacherFilter?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export interface SchedulesRepository {
  findMany(params: FindSchedulesParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


