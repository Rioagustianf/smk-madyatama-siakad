import {
  ScheduleTable,
  type ScheduleRow,
} from "@/components/molecules/ScheduleTable/ScheduleTable";

type ScheduleRow = {
  day: string;
  time: string;
  subject: string;
  teacher: string;
};

const mockSchedule: ScheduleRow[] = [
  {
    day: "Senin",
    time: "07:00 - 08:30",
    subject: "Matematika",
    teacher: "Ibu Siti",
  },
  {
    day: "Senin",
    time: "08:30 - 10:00",
    subject: "Bahasa Indonesia",
    teacher: "Pak Ahmad",
  },
  {
    day: "Selasa",
    time: "07:00 - 09:30",
    subject: "Produktif RPL",
    teacher: "Pak Dedi",
  },
];

export default function StudentSchedulePage() {
  return (
    <div className="rounded-xl border border-primary-900 bg-white p-5">
      <h1 className="text-xl font-semibold mb-3">Jadwal Pelajaran</h1>
      <ScheduleTable rows={mockSchedule} />
    </div>
  );
}
