"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

export function useCalendarEvents(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["calendar", filters],
    queryFn: () => apiMethods.calendar.list(filters),
  });
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: ["calendar", id],
    queryFn: () => apiMethods.calendar.get(id),
    enabled: !!id,
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (data: any) => apiMethods.calendar.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Event ditambahkan",
      });
    },
    onError: () => {
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menambahkan event",
      });
    },
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.calendar.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Event diperbarui",
      });
    },
    onError: () => {
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal memperbarui event",
      });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (id: string) => apiMethods.calendar.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Event dihapus",
      });
    },
    onError: () => {
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus event",
      });
    },
  });
}

export function useSeedHolidays() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (year?: number) => apiMethods.calendar.seed(year),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: `Berhasil menambahkan ${
          data.data?.length || 0
        } hari libur`,
      });
    },
    onError: () => {
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal mengimport hari libur",
      });
    },
  });
}
