import { ExamSchedule, Prisma } from "@prisma/client";

export interface CreateExamScheduleParams {
  subjectId: string;
  classId: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  description?: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface UpdateExamScheduleParams {
  subjectId?: string;
  classId?: string;
  type?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  room?: string;
  description?: string;
  isActive?: boolean;
}

export interface FindExamSchedulesParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  subjectId?: string;
  type?: string;
  teacherId?: string; // To filter exams by teacher's subjects
  startDate?: Date;
  endDate?: Date;
}

export interface ExamSchedulesRepository {
  findMany(
    params: FindExamSchedulesParams
  ): Promise<{ data: ExamSchedule[]; total: number }>;
  findById(id: string): Promise<ExamSchedule | null>;
  create(data: CreateExamScheduleParams): Promise<ExamSchedule>;
  update(id: string, data: UpdateExamScheduleParams): Promise<ExamSchedule>;
  remove(id: string): Promise<void>;
}
