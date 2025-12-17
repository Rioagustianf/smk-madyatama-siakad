import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarFilterProps {
  filterType: string;
  onFilterChange: (value: string) => void;
}

export function CalendarFilter({
  filterType,
  onFilterChange,
}: CalendarFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm">Filter:</Label>
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px] border border-primary-600 rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="EVENT">Event</SelectItem>
          <SelectItem value="HOLIDAY">Libur</SelectItem>
          <SelectItem value="ADMISSION">Penerimaan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
