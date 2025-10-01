"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

// Achievements
export function useAchievements(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["achievements", filters],
    queryFn: () => apiMethods.activities.achievements.list(filters),
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (data: any) => apiMethods.activities.achievements.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Prestasi ditambahkan",
      });
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.activities.achievements.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Prestasi diperbarui",
      });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (id: string) => apiMethods.activities.achievements.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Prestasi dihapus",
      });
    },
  });
}

// Extracurriculars
export function useExtracurriculars(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["extracurriculars", filters],
    queryFn: () => apiMethods.activities.extracurricular.list(filters),
  });
}

export function useCreateExtracurricular() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (data: any) =>
      apiMethods.activities.extracurricular.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Ekstrakurikuler ditambahkan",
      });
    },
  });
}

export function useUpdateExtracurricular() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.activities.extracurricular.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Ekstrakurikuler diperbarui",
      });
    },
  });
}

export function useDeleteExtracurricular() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      apiMethods.activities.extracurricular.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Ekstrakurikuler dihapus",
      });
    },
  });
}

// Internship - partners
export function useInternshipPartners(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["internship-partners", filters],
    queryFn: () => apiMethods.activities.internship.partners.list(filters),
  });
}

export function useCreateInternshipPartner() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (data: any) =>
      apiMethods.activities.internship.partners.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-partners"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Mitra ditambahkan",
      });
    },
  });
}

export function useUpdateInternshipPartner() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.activities.internship.partners.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-partners"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Mitra diperbarui",
      });
    },
  });
}

export function useDeleteInternshipPartner() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      apiMethods.activities.internship.partners.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-partners"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Mitra dihapus",
      });
    },
  });
}

// Internship - schedules
export function useInternshipSchedules(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ["internship-schedules", filters],
    queryFn: () => apiMethods.activities.internship.schedules.list(filters),
  });
}

export function useCreateInternshipSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (data: any) =>
      apiMethods.activities.internship.schedules.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-schedules"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Jadwal ditambahkan",
      });
    },
  });
}

export function useUpdateInternshipSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiMethods.activities.internship.schedules.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-schedules"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Jadwal diperbarui",
      });
    },
  });
}

export function useDeleteInternshipSchedule() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      apiMethods.activities.internship.schedules.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-schedules"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Jadwal dihapus",
      });
    },
  });
}
