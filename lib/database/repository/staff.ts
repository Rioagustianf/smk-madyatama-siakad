export type FindStaffParams = {
  search?: string;
  department?: string;
  position?: string;
  role?: string;
  excludeRole?: string; // Exclude specific role
  level?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export interface StaffRepository {
  findMany(params: FindStaffParams): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(payload: any): Promise<any>;
  update(id: string, payload: any): Promise<any>;
  remove(id: string): Promise<void>;
}
