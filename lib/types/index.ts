// User types
export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "teacher" | "student";
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Student specific types
export interface Student extends User {
  studentId: string;
  class: string;
  major: string;
  year: number;
  parentContact?: string;
  address?: string;
}

// Teacher specific types
export interface Teacher extends User {
  subjects: string[];
  classes: string[];
  education?: string;
}

// Admin specific types
export interface Admin extends User {
  permissions: string[];
}

// Academic types
export interface Major {
  id: string;
  name: string;
  code: string;
  description: string;
  image?: string;
  subjects: string[];
  facilities: string[];
  careerProspects: string[];
  totalStudents: number;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  majorId: string;
  teacherId: string;
  semester: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course types (alias for Subject)
export interface Course extends Subject {}

// Staff types
export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
  education?: string;
  experience?: number;
  certifications?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  semester: number;
  year: number;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  grade: "A" | "B" | "C" | "D" | "E";
  createdAt: Date;
  updatedAt: Date;
}

// Content types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: "academic" | "general" | "exam" | "event";
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  publishedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: "academic" | "sports" | "arts" | "competition";
  level:
    | "school"
    | "district"
    | "city"
    | "province"
    | "national"
    | "international";
  date: Date;
  participants: string[];
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Extracurricular {
  id: string;
  name: string;
  description: string;
  image?: string;
  instructor: string;
  schedule: string;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  requirements?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// School profile types
export interface SchoolProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  history: string;
  vision: string;
  mission: string[];
  principalName: string;
  principalImage?: string;
  principalMessage?: string;
  facilities: Facility[];
  updatedAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  isActive: boolean;
}

// Schedule types
export interface Schedule {
  id: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  startTime: string;
  endTime: string;
  room: string;
  semester: number;
  year: number;
  isActive: boolean;
}

export interface ExamSchedule {
  id: string;
  subjectId: string;
  classId: string;
  type: "midterm" | "final" | "assignment";
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Internship types
export interface Internship {
  id: string;
  companyName: string;
  address: string;
  contact: string;
  description: string;
  positions: string[];
  requirements: string[];
  duration: string;
  studentCapacity: number;
  currentStudents: number;
  coordinatorName: string;
  coordinatorContact: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternshipApplication {
  id: string;
  studentId: string;
  internshipId: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  notes?: string;
}

// Form types for admin dashboard
export interface CreateTeacherForm {
  name: string;
  email: string;
  teacherId: string;
  subjects: string[];
  classes: string[];
  expertise?: string;
  education?: string;
  experience?: number;
  certifications?: string[];
}

export interface CreateCourseForm {
  name: string;
  code: string;
  description?: string;
  credits: number;
  majorId: string;
  teacherId: string;
  semester: number;
}

export interface CreateScheduleForm {
  subjectId: string;
  teacherId: string;
  classId: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  startTime: string;
  endTime: string;
  room: string;
  semester: number;
  year: number;
}

export interface CreateGradeForm {
  studentId: string;
  subjectId: string;
  semester: number;
  year: number;
  assignments: number;
  midterm: number;
  final: number;
}

// Table row types for components
export interface GradeRow {
  subject: string;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  grade: "A" | "B" | "C" | "D" | "E";
}

export interface ScheduleRow {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface SearchFilters {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
