import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

// Hook untuk mendapatkan daftar classes
export function useClasses(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["classes", filters],
    queryFn: () => apiMethods.classes.list(filters),
    select: (data) => data,
  });
}

// Hook untuk mendapatkan single class
export function useClass(id: string) {
  return useQuery({
    queryKey: ["class", id],
    queryFn: () => apiMethods.classes.get(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

// Hook untuk membuat class baru
export function useCreateClass() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiMethods.classes.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Kelas berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description: error.response?.data?.message || "Gagal menambahkan kelas",
      });
    },
  });
}

// Hook untuk update class
export function useUpdateClass() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.classes.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Kelas berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description: error.response?.data?.message || "Gagal memperbarui kelas",
      });
    },
  });
}

// Hook untuk delete class
export function useDeleteClass() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiMethods.classes.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Kelas berhasil dihapus",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description: error.response?.data?.message || "Gagal menghapus kelas",
      });
    },
  });
}
