"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-client";
import { toast } from "sonner";

// Custom hook for authentication using TanStack Query
export const useAuthQuery = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: apiMethods.auth.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for login mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiMethods.auth.login,
    onSuccess: (data) => {
      // Store token in cookie
      document.cookie = `auth_token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;

      // Update auth query cache
      queryClient.setQueryData(queryKeys.auth.profile, data.user);

      // Show success toast
      toast.success("Login Berhasil", {
        description: `Selamat datang, ${data.user.name}!`,
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login Gagal", {
        description: "Username atau password salah",
      });
    },
  });
};

// Custom hook for logout mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiMethods.auth.logout,
    onSuccess: () => {
      // Clear token from cookie
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear auth query cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile });

      // Show success toast
      toast.success("Logout Berhasil", {
        description: "Anda telah berhasil logout",
      });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout Gagal", {
        description: "Terjadi kesalahan saat logout",
      });
    },
  });
};

// Custom hook for profile refresh
export const useProfileRefresh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiMethods.auth.getProfile,
    onSuccess: (data) => {
      // Update auth query cache
      queryClient.setQueryData(queryKeys.auth.profile, data);
    },
    onError: (error) => {
      console.error("Profile refresh failed:", error);
    },
  });
};
