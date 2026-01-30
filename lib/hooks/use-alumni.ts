import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export interface Alumni {
  id: string;
  name: string;
  photo?: string;
  workAt?: string;
  majorId: string;
  major?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Fetch all alumni (for admin table)
export function useAllAlumni() {
  return useQuery({
    queryKey: ["alumni", "all"],
    queryFn: () => api.get("/api/academic/alumni"),
  });
}

// Fetch all alumni for a major
export function useAlumniByMajor(majorId: string | null) {
  return useQuery({
    queryKey: ["alumni", majorId],
    queryFn: () => {
      if (!majorId) return { data: [] };
      return api.get(`/api/academic/majors/${majorId}/alumni`);
    },
    enabled: !!majorId,
  });
}

// Create Alumni
export function useCreateAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      majorId,
      data,
    }: {
      majorId: string;
      data: Partial<Alumni>;
    }) => api.post(`/api/academic/majors/${majorId}/alumni`, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific major's alumni and all alumni
      queryClient.invalidateQueries({
        queryKey: ["alumni", variables.majorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["alumni", "all"],
      });
      toast.success("Data alumni berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan data alumni",
      );
    },
  });
}

// Update Alumni
export function useUpdateAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Alumni> }) =>
      api.put(`/api/academic/alumni/${id}`, data),
    onSuccess: (data) => {
      // Invalidate queries. We might need traversing up to find majorId if not returned,
      // but usually we pass majorId purely for invalidation or fetch it from response.
      // Assuming response data has majorId or we refresh all alumni lists.
      // Better to invalidate all 'alumni' keys or generic.
      // Safer: invalidate all alumni queries.
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      toast.success("Data alumni berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui data alumni",
      );
    },
  });
}

// Delete Alumni
export function useDeleteAlumni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/academic/alumni/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      toast.success("Data alumni berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal menghapus data alumni",
      );
    },
  });
}
