"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters } from "@/lib/types";

export const useSubjects = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["subjects", filters],
    queryFn: () => apiMethods.subjects.list(filters),
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.subjects.create,
    onSuccess: (response) => {
      queryClient.setQueryData(["subjects"], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, data: [response.data, ...(oldData.data || [])] };
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      addToast({
        type: "success",
        title: "Mata pelajaran berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan mata pelajaran",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.subjects.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["subjects"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).map((item: any) =>
            (item._id || item.id) === variables.id
              ? { ...item, ...response.data }
              : item
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      addToast({
        type: "success",
        title: "Mata pelajaran berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui mata pelajaran",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.subjects.delete,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["subjects"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).filter(
            (item: any) => (item._id || item.id) !== variables
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      addToast({
        type: "success",
        title: "Mata pelajaran berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus mata pelajaran",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
  });
};
