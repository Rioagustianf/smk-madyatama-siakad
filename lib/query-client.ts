import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  // Auth
  auth: {
    profile: ["auth", "profile"] as const,
    login: ["auth", "login"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Teachers
  teachers: {
    all: ["teachers"] as const,
    lists: () => [...queryKeys.teachers.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.teachers.lists(), filters] as const,
    details: () => [...queryKeys.teachers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.teachers.details(), id] as const,
  },

  // Students
  students: {
    all: ["students"] as const,
    lists: () => [...queryKeys.students.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
    grades: (id: string) =>
      [...queryKeys.students.detail(id), "grades"] as const,
  },

  // Courses
  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
  },

  // Subjects
  subjects: {
    all: ["subjects"] as const,
    lists: () => [...queryKeys.subjects.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.subjects.lists(), filters] as const,
    details: () => [...queryKeys.subjects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.subjects.details(), id] as const,
  },

  // Majors
  majors: {
    all: ["majors"] as const,
    lists: () => [...queryKeys.majors.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.majors.lists(), filters] as const,
    details: () => [...queryKeys.majors.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.majors.details(), id] as const,
  },

  // Schedules
  schedules: {
    all: ["schedules"] as const,
    lists: () => [...queryKeys.schedules.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.schedules.lists(), filters] as const,
    details: () => [...queryKeys.schedules.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.schedules.details(), id] as const,
    byStudent: (studentId: string) =>
      [...queryKeys.schedules.all, "student", studentId] as const,
    byTeacher: (teacherId: string) =>
      [...queryKeys.schedules.all, "teacher", teacherId] as const,
  },

  // Grades
  grades: {
    all: ["grades"] as const,
    lists: () => [...queryKeys.grades.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.grades.lists(), filters] as const,
    details: () => [...queryKeys.grades.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.grades.details(), id] as const,
    byStudent: (studentId: string) =>
      [...queryKeys.grades.all, "student", studentId] as const,
    byTeacher: (teacherId: string) =>
      [...queryKeys.grades.all, "teacher", teacherId] as const,
  },

  // Announcements
  announcements: {
    all: ["announcements"] as const,
    lists: () => [...queryKeys.announcements.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.announcements.lists(), filters] as const,
    details: () => [...queryKeys.announcements.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.announcements.details(), id] as const,
  },

  // Gallery
  gallery: {
    all: ["gallery"] as const,
    lists: () => [...queryKeys.gallery.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.gallery.lists(), filters] as const,
    details: () => [...queryKeys.gallery.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },

  // Activities
  activities: {
    all: ["activities"] as const,
    lists: () => [...queryKeys.activities.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.activities.lists(), filters] as const,
    details: () => [...queryKeys.activities.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.activities.details(), id] as const,
  },

  // Staff
  staff: {
    all: ["staff"] as const,
    lists: () => [...queryKeys.staff.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.staff.lists(), filters] as const,
    details: () => [...queryKeys.staff.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.staff.details(), id] as const,
  },

  // Internships
  internships: {
    all: ["internships"] as const,
    lists: () => [...queryKeys.internships.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.internships.lists(), filters] as const,
    details: () => [...queryKeys.internships.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.internships.details(), id] as const,
  },

  // Profile
  profile: {
    all: ["profile"] as const,
    school: () => [...queryKeys.profile.all, "school"] as const,
  },
};
