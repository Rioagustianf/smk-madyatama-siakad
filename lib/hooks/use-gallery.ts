"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { SearchFilters } from "@/lib/types";

export const useGalleryList = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["gallery", filters],
    queryFn: () => apiMethods.gallery.list(filters),
  });
};

export const useGalleryItem = (id: string) => {
  return useQuery({
    queryKey: ["gallery", "detail", id],
    queryFn: () => apiMethods.gallery.get(id),
    enabled: !!id,
  });
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.gallery.create,
    onSuccess: (response) => {
      queryClient.setQueryData(["gallery"], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, data: [response.data, ...(oldData.data || [])] };
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      addToast({
        type: "success",
        title: "Item galeri berhasil ditambahkan",
        description: "Data telah berhasil disimpan ke database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menambahkan item galeri",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.gallery.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["gallery"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).map((g: any) =>
            (g as any)._id === variables.id
              ? { ...(g as any), ...response.data }
              : g
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      addToast({
        type: "success",
        title: "Item galeri berhasil diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal memperbarui item galeri",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
      });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: apiMethods.gallery.delete,
    onSuccess: (_, id: string) => {
      queryClient.setQueryData(["gallery"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: (oldData.data || []).filter((g: any) => (g as any)._id !== id),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      addToast({
        type: "success",
        title: "Item galeri berhasil dihapus",
        description: "Data telah berhasil dihapus dari database.",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal menghapus item galeri",
        description:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      });
    },
  });
};
