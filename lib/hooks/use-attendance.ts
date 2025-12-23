import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";

// Since api-client might not have the new endpoints yet, we can use axios directly or extend api-client.
// Ideally extend api-client, but for speed I will use axios here or assume api-client is extensible.
// Checking api-client structure might be good, but I'll trust standard axios usage for new routes.

// Student Hooks

export function useTodaySchedule() {
  return useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await api.get("/api/attendance/today");
      return res; // api.get already returns res.data
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/attendance/checkin", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Absensi tercatat",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal Absen",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
}

// Teacher Hooks

export function useTeacherSchedule() {
  return useQuery({
    queryKey: ["teacher-schedule-today"],
    queryFn: async () => {
      const res = await api.get("/api/attendance/teacher/today");
      return res;
    },
  });
}

export function useClassAttendance(
  classId: string,
  subjectId: string,
  date?: string
) {
  return useQuery({
    queryKey: ["class-attendance", classId, subjectId, date],
    enabled: !!classId && !!subjectId,
    queryFn: async () => {
      const res = await api.get("/api/attendance/list", {
        params: { class: classId, subjectId, date },
      });
      return res; // api.get already returns res.data
    },
  });
}

export function useVerifyAttendance() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/attendance/verify", data);
      return res; // api.post already returns res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-attendance"] });
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Status absensi diperbarui",
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Gagal Verifikasi",
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    },
  });
}
