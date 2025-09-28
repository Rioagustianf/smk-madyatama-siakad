"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters, Announcement } from "@/lib/types";

export const useAnnouncements = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["announcements", filters],
    queryFn: () => apiMethods.announcements.list(filters),
  });
};

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: ["announcements", "detail", id],
    queryFn: () => apiMethods.announcements.get(id),
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.announcements.create,
    onSuccess: (response) => {
      queryClient.setQueryData(["announcements"], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, data: [response.data, ...(oldData.data || [])] };
      });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });

      addToast({
        type: "success",
        title: "Pengumuman berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan pengumuman",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.announcements.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["announcements"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).map((a: Announcement) =>
            (a as any)._id === variables.id
              ? { ...(a as any), ...response.data }
              : a
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });

      addToast({
        type: "success",
        title: "Pengumuman berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui pengumuman",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.announcements.delete,
    onSuccess: (_, id: string) => {
      queryClient.setQueryData(["announcements"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).filter((a: any) => (a as any)._id !== id),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });

      addToast({
        type: "success",
        title: "Pengumuman berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus pengumuman",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
  });
};
