"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { toast } from "sonner";

// Types
export interface Teacher {
  _id: string;
  name: string;
  username: string;
  phone?: string;
  education?: string;
  subjects: string[];
  classes: string[];
  isActive: boolean;
  role: "teacher";
  createdAt: string;
  updatedAt: string;
}

export interface TeacherFormData {
  name: string;
  username: string;
  phone?: string;
  education?: string;
  classes?: string[];
}

// Hooks
export function useTeachers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: () => apiMethods.teachers.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => apiMethods.teachers.get(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeacherFormData) => apiMethods.teachers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Guru berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan guru");
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeacherFormData }) =>
      apiMethods.teachers.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      toast.success("Guru berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui guru");
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiMethods.teachers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Guru berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus guru");
    },
  });
}
