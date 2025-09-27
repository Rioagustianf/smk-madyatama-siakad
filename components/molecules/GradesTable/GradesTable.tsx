import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GradeRow = {
  subject: string;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  grade: string;
};

interface GradesTableProps {
  rows: GradeRow[];
  className?: string;
}

export function GradesTable({ rows, className }: GradesTableProps) {
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary-950/90 hover:bg-primary-950/90">
            <TableHead className="text-white">Mata Pelajaran</TableHead>
            <TableHead className="text-white">Tugas</TableHead>
            <TableHead className="text-white">UTS</TableHead>
            <TableHead className="text-white">UAS</TableHead>
            <TableHead className="text-white">Total</TableHead>
            <TableHead className="text-white">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((g) => (
            <TableRow key={g.subject}>
              <TableCell>{g.subject}</TableCell>
              <TableCell>{g.assignments}</TableCell>
              <TableCell>{g.midterm}</TableCell>
              <TableCell>{g.final}</TableCell>
              <TableCell>{g.total}</TableCell>
              <TableCell>{g.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
