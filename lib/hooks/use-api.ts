"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters, PaginatedResponse } from "@/lib/types";

// Generic CRUD hooks
export const useListQuery = <T>(
  key: readonly string[],
  apiMethod: (filters?: Record<string, any>) => Promise<PaginatedResponse<T>>,
  filters?: SearchFilters,
  options?: any
) => {
  return useQuery({
    queryKey: [...key, filters],
    queryFn: () => apiMethod(filters),
    ...options,
  });
};

export const useDetailQuery = <T>(
  key: readonly string[],
  apiMethod: (id: string) => Promise<T>,
  id: string,
  options?: any
) => {
  return useQuery({
    queryKey: [...key, id],
    queryFn: () => apiMethod(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateMutation = <T, D>(
  key: readonly string[],
  apiMethod: (data: D) => Promise<T>,
  options?: any
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethod,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key });
      addToast({
        type: "success",
        title: "Data berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan data",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
    ...options,
  });
};

export const useUpdateMutation = <T, D>(
  key: readonly string[],
  apiMethod: (_id: string, data: D) => Promise<T>,
  options?: any
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ _id, data }: { _id: string; data: D }) =>
      apiMethod(_id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: [...key, variables._id] });
      addToast({
        type: "success",
        title: "Data berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui data",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
    ...options,
  });
};

export const useDeleteMutation = <T>(
  key: readonly string[],
  apiMethod: (id: string) => Promise<T>,
  options?: any
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      addToast({
        type: "success",
        title: "Data berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus data",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
    ...options,
  });
};

// Specific hooks for each resource

// Auth hooks
export const useAuthProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: apiMethods.auth.getProfile,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.auth.login,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.profile, data.user);
      addToast({
        type: "success",
        title: "Login berhasil",
        description: `Selamat datang, ${data.user.name}!`,
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Login gagal",
        description:
          error?.response?.data?.message || "Email atau password salah.",
      });
    },
  });
};

// Teachers hooks
export const useTeachers = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.teachers.lists(),
    apiMethods.teachers.list,
    filters
  );
};

export const useTeacher = (id: string) => {
  return useDetailQuery(
    queryKeys.teachers.details(),
    apiMethods.teachers.get,
    id
  );
};

export const useCreateTeacher = () => {
  return useCreateMutation(queryKeys.teachers.all, apiMethods.teachers.create);
};

export const useUpdateTeacher = () => {
  return useUpdateMutation(queryKeys.teachers.all, apiMethods.teachers.update);
};

export const useDeleteTeacher = () => {
  return useDeleteMutation(queryKeys.teachers.all, apiMethods.teachers.delete);
};

// Students hooks
export const useStudents = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.students.lists(),
    apiMethods.students.list,
    filters
  );
};

export const useStudent = (id: string) => {
  return useDetailQuery(
    queryKeys.students.details(),
    (id: string) =>
      apiMethods.students.list({ id }).then((r: any) => r?.data?.[0] ?? null),
    id
  );
};

export const useStudentGrades = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.students.grades(studentId),
    queryFn: () => apiMethods.grades.byStudent(studentId),
    enabled: !!studentId,
  });
};

export const useCreateStudent = () => {
  return useCreateMutation(queryKeys.students.all, apiMethods.students.create);
};

export const useUpdateStudent = () => {
  return useUpdateMutation(queryKeys.students.all, apiMethods.students.update);
};

export const useDeleteStudent = () => {
  return useDeleteMutation(queryKeys.students.all, apiMethods.students.delete);
};

export const useStudentsBulk = () => {
  return useCreateMutation(queryKeys.students.all, apiMethods.students.bulk);
};

// Courses hooks
export const useCourses = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.courses.lists(),
    apiMethods.courses.list,
    filters
  );
};

export const useCourse = (id: string) => {
  return useDetailQuery(
    queryKeys.courses.details(),
    (id: string) =>
      apiMethods.courses.list({ id }).then((r: any) => r?.data?.[0] ?? null),
    id
  );
};

export const useCreateCourse = () => {
  return useCreateMutation(queryKeys.courses.all, apiMethods.courses.create);
};

export const useUpdateCourse = () => {
  return useUpdateMutation(queryKeys.courses.all, apiMethods.courses.update);
};

export const useDeleteCourse = () => {
  return useDeleteMutation(queryKeys.courses.all, apiMethods.courses.delete);
};

// Majors hooks - moved to use-majors.ts

export const useMajor = (id: string) => {
  return useQuery({
    queryKey: ["majors", "detail", id],
    queryFn: () => apiMethods.majors.get(id),
    enabled: !!id,
  });
};

export const useCreateMajor = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.majors.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      addToast({
        type: "success",
        title: "Program keahlian berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan program keahlian",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });
};

export const useUpdateMajor = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.majors.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      addToast({
        type: "success",
        title: "Program keahlian berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui program keahlian",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
  });
};

export const useDeleteMajor = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.majors.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      addToast({
        type: "success",
        title: "Program keahlian berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus program keahlian",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
  });
};

// Subjects hooks
export const useSubjects = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.subjects.lists(),
    apiMethods.subjects.list,
    filters
  );
};

export const useSubject = (id: string) => {
  return useDetailQuery(
    queryKeys.subjects.details(),
    (id: string) =>
      apiMethods.subjects.list({ id }).then((r: any) => r?.data?.[0] ?? null),
    id
  );
};

export const useCreateSubject = () => {
  return useCreateMutation(queryKeys.subjects.all, apiMethods.subjects.create);
};

export const useUpdateSubject = () => {
  return useUpdateMutation(queryKeys.subjects.all, apiMethods.subjects.update);
};

export const useDeleteSubject = () => {
  return useDeleteMutation(queryKeys.subjects.all, apiMethods.subjects.delete);
};

// Schedules hooks
export const useSchedules = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.schedules.lists(),
    apiMethods.schedules.list,
    filters
  );
};

export const useSchedule = (id: string) => {
  return useDetailQuery(
    queryKeys.schedules.details(),
    apiMethods.schedules.get,
    id
  );
};

export const useStudentSchedules = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.byStudent(studentId),
    queryFn: () => apiMethods.schedules.list({ studentId }),
    enabled: !!studentId,
  });
};

export const useTeacherSchedules = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.byTeacher(teacherId),
    queryFn: () => apiMethods.schedules.list({ teacherId }),
    enabled: !!teacherId,
  });
};

export const useCreateSchedule = () => {
  return useCreateMutation(
    queryKeys.schedules.all,
    apiMethods.schedules.create
  );
};

export const useUpdateSchedule = () => {
  return useUpdateMutation(
    queryKeys.schedules.all,
    apiMethods.schedules.update
  );
};

export const useDeleteSchedule = () => {
  return useDeleteMutation(
    queryKeys.schedules.all,
    apiMethods.schedules.delete
  );
};

// Grades hooks
export const useGrades = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.grades.lists(),
    apiMethods.grades.list,
    filters
  );
};

export const useGrade = (id: string) => {
  return useDetailQuery(
    queryKeys.grades.details(),
    (id: string) =>
      apiMethods.grades.list({ id }).then((r: any) => r?.data?.[0] ?? null),
    id
  );
};

export const useCreateGrade = () => {
  return useCreateMutation(queryKeys.grades.all, apiMethods.grades.create);
};

export const useUpdateGrade = () => {
  return useUpdateMutation(queryKeys.grades.all, apiMethods.grades.update);
};

export const useDeleteGrade = () => {
  return useDeleteMutation(queryKeys.grades.all, apiMethods.grades.delete);
};

export const useBulkGrades = () => {
  return useCreateMutation(queryKeys.grades.all, apiMethods.grades.bulk);
};

// Announcements hooks
export const useAnnouncements = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.announcements.lists(),
    apiMethods.announcements.list,
    filters
  );
};

export const useAnnouncement = (id: string) => {
  return useDetailQuery(
    queryKeys.announcements.details(),
    apiMethods.announcements.get,
    id
  );
};

export const useCreateAnnouncement = () => {
  return useCreateMutation(
    queryKeys.announcements.all,
    apiMethods.announcements.create
  );
};

export const useUpdateAnnouncement = () => {
  return useUpdateMutation(
    queryKeys.announcements.all,
    apiMethods.announcements.update
  );
};

export const useDeleteAnnouncement = () => {
  return useDeleteMutation(
    queryKeys.announcements.all,
    apiMethods.announcements.delete
  );
};

// Gallery hooks
export const useGallery = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.gallery.lists(),
    apiMethods.gallery.list,
    filters
  );
};

export const useGalleryItem = (id: string) => {
  return useDetailQuery(
    queryKeys.gallery.details(),
    apiMethods.gallery.get,
    id
  );
};

export const useCreateGalleryItem = () => {
  return useCreateMutation(queryKeys.gallery.all, apiMethods.gallery.create);
};

export const useUpdateGalleryItem = () => {
  return useUpdateMutation(queryKeys.gallery.all, apiMethods.gallery.update);
};

export const useDeleteGalleryItem = () => {
  return useDeleteMutation(queryKeys.gallery.all, apiMethods.gallery.delete);
};

// Activities hooks
export const useActivities = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.activities.lists(),
    apiMethods.activities.list,
    filters
  );
};

export const useActivity = (id: string) => {
  return useDetailQuery(
    queryKeys.activities.details(),
    apiMethods.activities.get,
    id
  );
};

export const useCreateActivity = () => {
  return useCreateMutation(
    queryKeys.activities.all,
    apiMethods.activities.create
  );
};

export const useUpdateActivity = () => {
  return useUpdateMutation(
    queryKeys.activities.all,
    apiMethods.activities.update
  );
};

export const useDeleteActivity = () => {
  return useDeleteMutation(
    queryKeys.activities.all,
    apiMethods.activities.delete
  );
};

// Staff hooks
export const useStaff = (filters?: SearchFilters) => {
  return useListQuery(queryKeys.staff.lists(), apiMethods.staff.list, filters);
};

export const useStaffMember = (id: string) => {
  return useDetailQuery(queryKeys.staff.details(), apiMethods.staff.get, id);
};

export const useCreateStaff = () => {
  return useCreateMutation(queryKeys.staff.all, apiMethods.staff.create);
};

export const useUpdateStaff = () => {
  return useUpdateMutation(queryKeys.staff.all, apiMethods.staff.update);
};

export const useDeleteStaff = () => {
  return useDeleteMutation(queryKeys.staff.all, apiMethods.staff.delete);
};

// Internships hooks
export const useInternships = (filters?: SearchFilters) => {
  return useListQuery(
    queryKeys.internships.lists(),
    apiMethods.internships.list,
    filters
  );
};

export const useInternship = (id: string) => {
  return useDetailQuery(
    queryKeys.internships.details(),
    (id: string) =>
      apiMethods.internships
        .list({ id })
        .then((r: any) => r?.data?.[0] ?? null),
    id
  );
};

export const useCreateInternship = () => {
  return useCreateMutation(
    queryKeys.internships.all,
    apiMethods.internships.create
  );
};

export const useUpdateInternship = () => {
  return useUpdateMutation(
    queryKeys.internships.all,
    apiMethods.internships.update
  );
};

export const useDeleteInternship = () => {
  return useDeleteMutation(
    queryKeys.internships.all,
    apiMethods.internships.delete
  );
};

// Profile hooks
export const useSchoolProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile.school(),
    queryFn: apiMethods.profile.get,
  });
};

export const useUpdateSchoolProfile = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.profile.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      addToast({
        type: "success",
        title: "Profil sekolah berhasil diperbarui",
        description: "Perubahan profil sekolah telah disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui profil",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui profil.",
      });
    },
  });
};
