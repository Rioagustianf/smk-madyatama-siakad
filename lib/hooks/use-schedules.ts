import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

// Hook untuk mendapatkan daftar schedules
export function useSchedules(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["schedules", filters],
    queryFn: () => apiMethods.schedules.list(filters),
    select: (data) => data,
  });
}

// Hook untuk mendapatkan single schedule
export function useSchedule(id: string) {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => apiMethods.schedules.get(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

// Hook untuk membuat schedule baru
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiMethods.schedules.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message || "Gagal menambahkan jadwal",
      });
    },
  });
}

// Hook untuk update schedule
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.schedules.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message || "Gagal memperbarui jadwal",
      });
    },
  });
}

// Hook untuk delete schedule
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiMethods.schedules.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal berhasil dihapus",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description: error.response?.data?.message || "Gagal menghapus jadwal",
      });
    },
  });
}
