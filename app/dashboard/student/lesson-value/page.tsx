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
  const studentId =
    (state.user as any)?._id ||
    (state.user as any)?.id ||
    (state.user as any)?.studentId;
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
            <TableHead className="text-white">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>Memuat…</TableCell>
            </TableRow>
          ) : grades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Belum ada nilai</TableCell>
            </TableRow>
          ) : (
            grades.map((g: any, idx: number) => (
              <TableRow key={g._id || g.id || idx}>
                <TableCell>
                  {g.subjectName || g.subject || g.subjectId}
                </TableCell>
                <TableCell>{g.assignments ?? "-"}</TableCell>
                <TableCell>{g.midterm ?? "-"}</TableCell>
                <TableCell>{g.final ?? "-"}</TableCell>
                <TableCell>{g.grade ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
