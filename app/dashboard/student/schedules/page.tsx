"use client";

import { ScheduleTable } from "@/components/molecules/ScheduleTable/ScheduleTable";
import { useSchedules } from "@/lib/hooks/use-schedules";
import { useAuth } from "@/lib/contexts/auth-context";
import { Student } from "@/lib/types";

export default function StudentSchedulePage() {
  const { state } = useAuth();
  const user = state.user as Student;

  // Fetch schedules for the student's class
  const {
    data: schedulesData,
    isLoading,
    error,
  } = useSchedules({
    class: user?.class,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-primary-900 bg-white p-5">
        <h1 className="text-xl font-semibold mb-3">Jadwal Pelajaran</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-primary-900 bg-white p-5">
        <h1 className="text-xl font-semibold mb-3">Jadwal Pelajaran</h1>
        <div className="text-center py-8 text-red-600">
          Gagal memuat jadwal pelajaran
        </div>
      </div>
    );
  }

  const schedules = schedulesData?.data || [];

  return (
    <div className="rounded-xl border border-primary-900 bg-white p-5">
      <h1 className="text-xl font-semibold mb-3">Jadwal Pelajaran</h1>
      {schedules.length > 0 ? (
        <ScheduleTable
          schedules={schedules}
          readOnly={true}
          showActions={false}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Belum ada jadwal pelajaran untuk kelas {user?.class}
        </div>
      )}
    </div>
  );
}
