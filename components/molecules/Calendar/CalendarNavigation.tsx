import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface CalendarNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          className="border border-primary-600 rounded-lg"
          size="icon"
          onClick={onPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold min-w-[200px] text-center">
          {format(currentMonth, "MMMM yyyy", { locale: localeId })}
        </h2>
        <Button
          className="border border-primary-600 rounded-lg"
          size="icon"
          onClick={onNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        className="border border-primary-600 rounded-lg"
        variant="outline"
        size="sm"
        onClick={onToday}
      >
        Hari Ini
      </Button>
    </div>
  );
}
