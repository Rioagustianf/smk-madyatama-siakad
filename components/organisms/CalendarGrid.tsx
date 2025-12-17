import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { CalendarDayCell } from "../molecules/Calendar/CalendarDayCell";
import { AcademicEvent } from "@/lib/types";

interface CalendarGridProps {
  currentMonth: Date;
  events: AcademicEvent[];
  onEventClick?: (event: AcademicEvent) => void;
}

const DAYS_OF_WEEK = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export function CalendarGrid({
  currentMonth,
  events,
  onEventClick,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check >= start && check <= end;
    });
  };

  const isToday = (date: Date) => {
    return format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
      {/* Day Headers */}
      {DAYS_OF_WEEK.map((day) => (
        <div
          key={day}
          className="bg-muted p-3 text-center text-sm font-semibold"
        >
          {day}
        </div>
      ))}

      {/* Padding Days */}
      {paddingDays.map((_, index) => (
        <div key={`pad-${index}`} className="bg-muted min-h-[120px] p-2" />
      ))}

      {/* Calendar Days */}
      {calendarDays.map((day) => (
        <CalendarDayCell
          key={day.toISOString()}
          day={day}
          events={getEventsForDate(day)}
          isToday={isToday(day)}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}
