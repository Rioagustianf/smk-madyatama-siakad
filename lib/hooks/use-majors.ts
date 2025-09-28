"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters } from "@/lib/types";

// Majors hooks
export const useMajors = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["majors", filters],
    queryFn: () => apiMethods.majors.list(filters),
  });
};

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
    onSuccess: (response) => {
      // Optimistic update - add new major to existing data
      queryClient.setQueryData(["majors"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [response.data, ...(oldData.data || [])],
        };
      });

      // Also invalidate to ensure data consistency
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
    onSuccess: (response, variables) => {
      // Optimistic update - update existing major in data
      queryClient.setQueryData(["majors"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).map((major: any) =>
            major._id === variables.id ? { ...major, ...response.data } : major
          ),
        };
      });

      // Also invalidate to ensure data consistency
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
    onSuccess: (_, variables) => {
      // Optimistic update - remove deleted major from data
      queryClient.setQueryData(["majors"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).filter(
            (major: any) => major._id !== variables
          ),
        };
      });

      // Also invalidate to ensure data consistency
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
