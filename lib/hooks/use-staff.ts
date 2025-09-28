"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters } from "@/lib/types";

export const useStaffList = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["staff", filters],
    queryFn: () => apiMethods.staff.list(filters),
  });
};

export const useStaff = (id: string) => {
  return useQuery({
    queryKey: ["staff", "detail", id],
    queryFn: () => apiMethods.staff.get(id),
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.staff.create,
    onSuccess: (response) => {
      queryClient.setQueryData(["staff"], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, data: [response.data, ...(oldData.data || [])] };
      });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast({
        type: "success",
        title: "Staf berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan staf",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.staff.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["staff"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).map((s: any) =>
            (s as any)._id === variables.id
              ? { ...(s as any), ...response.data }
              : s
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast({
        type: "success",
        title: "Staf berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui staf",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.staff.delete,
    onSuccess: (_, id: string) => {
      queryClient.setQueryData(["staff"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).filter((s: any) => (s as any)._id !== id),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast({
        type: "success",
        title: "Staf berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus staf",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
  });
};
