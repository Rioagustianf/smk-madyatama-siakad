"use client";

import React from "react";
import { roundNumber } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth-context";
import { useStudentGrades } from "@/lib/hooks/use-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GradeItem = any;

export default function StudentGradesPage() {
  const { state } = useAuth();
  const studentId = (state.user as any)?.studentId || (state.user as any)?.id;
  const { data, isLoading } = useStudentGrades(studentId);
  const grades: GradeItem[] = ((data as any)?.data || []) as any[];

  return (
    <div className="rounded-xl border border-primary-900 bg-white p-5">
      <h1 className="text-xl font-semibold mb-3">Nilai Saya</h1>
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Memuat…</TableCell>
            </TableRow>
          ) : grades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Belum ada nilai</TableCell>
            </TableRow>
          ) : (
            grades.map((g: any, idx: number) => (
              <TableRow key={g._id || idx}>
                <TableCell>
                  {g.subjectName || g.subject || g.subjectId}
                </TableCell>
                <TableCell>{g.assignments ?? "-"}</TableCell>
                <TableCell>{g.midterm ?? "-"}</TableCell>
                <TableCell>{g.final ?? "-"}</TableCell>
                <TableCell>
                  {g.total != null ? roundNumber(g.total, 2) : "-"}
                </TableCell>
                <TableCell>{g.grade ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
