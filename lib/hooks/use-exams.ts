import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

// Hook untuk mendapatkan daftar ujian
export function useExams(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["exams", filters],
    queryFn: () => apiMethods.exams.list(filters),
    select: (data) => data,
  });
}

// Hook untuk mendapatkan single exam
export function useExam(id: string) {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: () => apiMethods.exams.get(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

// Hook untuk membuat exam baru
export function useCreateExam() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiMethods.exams.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal ujian berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message || "Gagal menambahkan jadwal ujian",
      });
    },
  });
}

// Hook untuk update exam
export function useUpdateExam() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.exams.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal ujian berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message || "Gagal memperbarui jadwal ujian",
      });
    },
  });
}

// Hook untuk delete exam
export function useDeleteExam() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiMethods.exams.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: response?.message || "Jadwal ujian berhasil dihapus",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Error",
        description:
          error.response?.data?.message || "Gagal menghapus jadwal ujian",
      });
    },
  });
}
