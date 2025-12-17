import { format } from "date-fns";
import { EventCard } from "./EventCard";
import { AcademicEvent } from "@/lib/types";

interface CalendarDayCellProps {
  day: Date;
  events: AcademicEvent[];
  isToday?: boolean;
  onEventClick?: (event: AcademicEvent) => void;
}

export function CalendarDayCell({
  day,
  events,
  isToday,
  onEventClick,
}: CalendarDayCellProps) {
  return (
    <div
      className={`bg-background min-h-[120px] p-2 border-t rounded-md ${
        isToday ? "ring-2 ring-primary-950" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-medium ${
            isToday
              ? "bg-primary-300 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
              : ""
          }`}
        >
          {format(day, "d")}
        </span>
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            type={event.type}
            onClick={() => onEventClick?.(event)}
          />
        ))}
        {events.length > 3 && (
          <div className="text-xs text-muted-foreground pl-1.5">
            +{events.length - 3} lainnya
          </div>
        )}
      </div>
    </div>
  );
}
