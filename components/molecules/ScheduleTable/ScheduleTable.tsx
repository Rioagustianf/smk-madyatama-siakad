import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ScheduleRow = {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
};

interface ScheduleTableProps {
  rows: ScheduleRow[];
  className?: string;
}

export function ScheduleTable({ rows, className }: ScheduleTableProps) {
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-950/90 hover:bg-primary-950/90">
            <TableHead className="text-white">Hari</TableHead>
            <TableHead className="text-white">Waktu</TableHead>
            <TableHead className="text-white">Mata Pelajaran</TableHead>
            <TableHead className="text-white">Pengajar</TableHead>
            <TableHead className="text-white">Ruang</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={`${r.day}-${i}`}>
              <TableCell>{r.day}</TableCell>
              <TableCell>{r.time}</TableCell>
              <TableCell>{r.subject}</TableCell>
              <TableCell>{r.teacher}</TableCell>
              <TableCell>{r.room}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
