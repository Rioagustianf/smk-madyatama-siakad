"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

export const useProfile = () => {
  return useQuery({ queryKey: ["profile"], queryFn: apiMethods.profile.get });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: apiMethods.profile.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      addToast({ type: "success", title: "Profil diperbarui" });
    },
    onError: (e: any) => {
      addToast({
        type: "error",
        title: "Gagal menyimpan profil",
        description: e?.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
};
