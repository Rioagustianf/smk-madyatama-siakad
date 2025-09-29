"use client";

import React, { useState } from "react";
import { ScheduleTable } from "@/components/molecules/ScheduleTable/ScheduleTable";
import { useSchedules } from "@/lib/hooks/use-schedules";
import { useAuth } from "@/lib/contexts/auth-context";
import { Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function TeacherSchedulePage() {
  const { state } = useAuth();
  const user = state.user as Teacher;
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  // Fetch schedules - either all schedules or only teacher's schedules
  const {
    data: schedulesData,
    isLoading,
    error,
  } = useSchedules(showAllSchedules ? {} : { teacher: user?.name });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-primary-100 bg-white p-5">
        <h1 className="text-xl font-semibold mb-3">Jadwal Mengajar</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-primary-100 bg-white p-5">
        <h1 className="text-xl font-semibold mb-3">Jadwal Mengajar</h1>
        <div className="text-center py-8 text-red-600">
          Gagal memuat jadwal mengajar
        </div>
      </div>
    );
  }

  const schedules = schedulesData?.data || [];

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-semibold">Jadwal Mengajar</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllSchedules(!showAllSchedules)}
        >
          {showAllSchedules ? "Lihat Jadwal Saya" : "Lihat Semua Jadwal"}
        </Button>
      </div>

      {schedules.length > 0 ? (
        <ScheduleTable
          schedules={schedules}
          readOnly={true}
          showActions={false}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          {showAllSchedules
            ? "Belum ada jadwal pelajaran"
            : "Belum ada jadwal mengajar untuk Anda"}
        </div>
      )}
    </div>
  );
}
