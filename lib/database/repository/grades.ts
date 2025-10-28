export type FindGradesParams = {
  studentId?: string;
  subjectId?: string;
  teacherId?: string;
  semester?: number;
  year?: number;
  page?: number;
  limit?: number;
};

export interface GradesRepository {
  findMany(params: FindGradesParams): Promise<{ data: any[]; total: number }>;
  findByStudent(studentId: string): Promise<any[]>;
  bulkUpsert(data: any[]): Promise<any>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}


