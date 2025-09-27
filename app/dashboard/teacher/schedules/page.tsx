import React from "react";
import {
  ScheduleTable,
  type ScheduleRow,
} from "@/components/molecules/ScheduleTable/ScheduleTable";

const mockSchedule: ScheduleRow[] = [
  {
    day: "Senin",
    time: "07:00 - 08:30",
    subject: "Matematika",
    teacher: "Ibu Siti",
    room: "A1",
  },
  {
    day: "Senin",
    time: "08:30 - 10:00",
    subject: "Bahasa Indonesia",
    teacher: "Pak Ahmad",
    room: "A1",
  },
];

export default function TeacherSchedulePage() {
  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5">
      <h1 className="text-xl font-semibold mb-3">Jadwal Mengajar</h1>
      <ScheduleTable rows={mockSchedule} />
    </div>
  );
}
