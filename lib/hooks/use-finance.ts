import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

export function useBills(params?: any) {
  return useQuery({
    queryKey: ["bills", params],
    queryFn: async () => {
      const res = await api.get("/api/finance/bills", { params });
      return res; // api.get returns res.data
    },
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/finance/bills", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Tagihan berhasil dibuat",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
}

export function usePayBill() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/finance/pay", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Pembayaran berhasil dicatat",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (billId: string) => {
      const res = await api.delete(`/api/finance/bills?id=${billId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Tagihan berhasil dihapus",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
}
