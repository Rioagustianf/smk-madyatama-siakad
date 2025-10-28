export type FindStudentsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  major?: string;
  className?: string;
  gradeLevel?: number;
  semester?: number;
};

export interface StudentsRepository {
  findMany(params: FindStudentsParams): Promise<{ data: any[]; total: number }>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


