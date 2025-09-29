"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DeleteConfirmation } from "../DeleteConfirmation/DeleteConfirmation";

interface Schedule {
  _id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  teacher: string;
}

// Legacy interface for backward compatibility
export interface ScheduleRow {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room?: string;
}

interface ScheduleTableProps {
  // New interface for admin with CRUD operations
  schedules?: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onDeleteConfirm?: () => void;

  // Legacy interface for student/teacher read-only view
  rows?: ScheduleRow[];

  // Additional props for customization
  readOnly?: boolean;
  showActions?: boolean;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function ScheduleTable({
  schedules,
  onEdit,
  onDelete,
  onDeleteConfirm,
  rows,
  readOnly = false,
  showActions = true,
}: ScheduleTableProps) {
  // Normalize data - convert legacy rows to new format if needed
  const normalizedSchedules =
    schedules ||
    (rows
      ? rows.map((row) => ({
          _id: `${row.day}-${row.time}-${row.subject}`,
          day: row.day,
          time: row.time,
          subject: row.subject,
          class: "",
          teacher: row.teacher,
        }))
      : []);

  // Group schedules by day
  const schedulesByDay = normalizedSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.day]) {
      acc[schedule.day] = [];
    }
    acc[schedule.day].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Sort schedules within each day by time
  Object.keys(schedulesByDay).forEach((day) => {
    schedulesByDay[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  // Get the maximum number of time slots across all days
  const maxSlots = Math.max(
    ...Object.values(schedulesByDay).map((daySchedules) => daySchedules.length)
  );

  // Create rows for the table
  const createTableRows = () => {
    const rows = [];

    // First row: Day headers
    const dayHeaderRow = [];
    for (let i = 0; i < 3; i++) {
      const day = DAYS[i];
      dayHeaderRow.push(
        <TableHead
          key={`${day}-header`}
          className="bg-orange-200 text-black font-bold text-center"
        >
          {day}
        </TableHead>
      );
      dayHeaderRow.push(
        <TableHead
          key={`${day}-jam`}
          className="bg-gray-200 text-black font-bold text-center"
        >
          JAM
        </TableHead>
      );
    }
    rows.push(<TableRow key="day-headers">{dayHeaderRow}</TableRow>);

    // Schedule rows
    for (let slot = 0; slot < maxSlots; slot++) {
      const scheduleRow = [];

      for (let dayIndex = 0; dayIndex < 3; dayIndex++) {
        const day = DAYS[dayIndex];
        const daySchedules = schedulesByDay[day] || [];
        const schedule = daySchedules[slot];

        if (schedule) {
          // Subject cell with class info and optional actions
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-subject`} className="text-left">
              <div className="font-medium">{schedule.subject}</div>
              {schedule.class && (
                <div className="text-xs text-gray-600">{schedule.class}</div>
              )}
              {!readOnly && showActions && (
                <div className="mt-1 flex items-center gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(schedule)}
                      className="h-7 px-2 text-primary-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule)}
                      className="h-7 px-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </TableCell>
          );
          // Time cell
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-time`} className="text-center">
              {schedule.time}
            </TableCell>
          );
        } else {
          // Empty cells
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-subject`} className="text-left">
              &nbsp;
            </TableCell>
          );
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-time`} className="text-center">
              &nbsp;
            </TableCell>
          );
        }
      }

      rows.push(<TableRow key={`schedule-${slot}`}>{scheduleRow}</TableRow>);
    }

    return rows;
  };

  // Create rows for the second set of days (Kamis, Jumat, Sabtu)
  const createSecondTableRows = () => {
    const rows = [];

    // First row: Day headers for second set
    const dayHeaderRow = [];
    for (let i = 3; i < 6; i++) {
      const day = DAYS[i];
      dayHeaderRow.push(
        <TableHead
          key={`${day}-header`}
          className="bg-orange-200 text-black font-bold text-center"
        >
          {day}
        </TableHead>
      );
      dayHeaderRow.push(
        <TableHead
          key={`${day}-jam`}
          className="bg-gray-200 text-black font-bold text-center"
        >
          JAM
        </TableHead>
      );
    }
    rows.push(<TableRow key="day-headers-2">{dayHeaderRow}</TableRow>);

    // Schedule rows for second set
    for (let slot = 0; slot < maxSlots; slot++) {
      const scheduleRow = [];

      for (let dayIndex = 3; dayIndex < 6; dayIndex++) {
        const day = DAYS[dayIndex];
        const daySchedules = schedulesByDay[day] || [];
        const schedule = daySchedules[slot];

        if (schedule) {
          // Subject cell with class info and optional actions
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-subject`} className="text-left">
              <div className="font-medium">{schedule.subject}</div>
              {schedule.class && (
                <div className="text-xs text-gray-600">{schedule.class}</div>
              )}
              {!readOnly && showActions && (
                <div className="mt-1 flex items-center gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(schedule)}
                      className="h-7 px-2 text-primary-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule)}
                      className="h-7 px-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </TableCell>
          );
          // Time cell
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-time`} className="text-center">
              {schedule.time}
            </TableCell>
          );
        } else {
          // Empty cells
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-subject`} className="text-left">
              &nbsp;
            </TableCell>
          );
          scheduleRow.push(
            <TableCell key={`${day}-${slot}-time`} className="text-center">
              &nbsp;
            </TableCell>
          );
        }
      }

      rows.push(<TableRow key={`schedule-2-${slot}`}>{scheduleRow}</TableRow>);
    }

    return rows;
  };

  return (
    <div className="space-y-6">
      {/* First table: Senin, Selasa, Rabu */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>{createTableRows().slice(0, 1)}</TableHeader>
          <TableBody>{createTableRows().slice(1)}</TableBody>
        </Table>
      </div>

      {/* Second table: Kamis, Jumat, Sabtu */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>{createSecondTableRows().slice(0, 1)}</TableHeader>
          <TableBody>{createSecondTableRows().slice(1)}</TableBody>
        </Table>
      </div>
    </div>
  );
}

export { ScheduleTable };
export default ScheduleTable;
