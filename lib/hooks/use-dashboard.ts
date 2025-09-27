"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-client";
import { toast } from "sonner";

// Custom hook for getting student grades
export const useStudentGrades = (studentId?: string) => {
  return useQuery({
    queryKey: queryKeys.grades.lists(),
    queryFn: () => apiMethods.grades.list({ studentId }),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for getting student schedule
export const useStudentSchedule = (classId?: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.lists(),
    queryFn: () => apiMethods.schedules.list({ class: classId }),
    enabled: !!classId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for getting teacher classes
export const useTeacherClasses = (teacherId?: string) => {
  return useQuery({
    queryKey: queryKeys.teachers.detail(teacherId || ""),
    queryFn: () => apiMethods.teachers.get(teacherId!),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

// Custom hook for getting subjects
export const useSubjects = () => {
  return useQuery({
    queryKey: queryKeys.subjects.lists(),
    queryFn: () => apiMethods.subjects.list(),
    staleTime: 10 * 60 * 1000,
  });
};

// Custom hook for creating grades
export const useCreateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiMethods.grades.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all });
      toast.success("Berhasil", {
        description: "Nilai berhasil disimpan",
      });
    },
    onError: (error) => {
      toast.error("Gagal", {
        description: "Gagal menyimpan nilai",
      });
    },
  });
};

// Custom hook for updating grades
export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.grades.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all });
      toast.success("Berhasil", {
        description: "Nilai berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast.error("Gagal", {
        description: "Gagal memperbarui nilai",
      });
    },
  });
};

// Custom hook for getting announcements
export const useAnnouncements = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.announcements.list(filters || {}),
    queryFn: () => apiMethods.announcements.list(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Custom hook for getting gallery
export const useGallery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.gallery.list(filters || {}),
    queryFn: () => apiMethods.gallery.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};
