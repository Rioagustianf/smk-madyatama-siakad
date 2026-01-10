"use client";

import React from "react";
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

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { StudentReportDocument } from "@/components/reports/StudentReportDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading PDF...</p>,
  }
);

export default function StudentGradesPage() {
  const { state } = useAuth();
  const studentId =
    (state.user as any)?._id ||
    (state.user as any)?.id ||
    (state.user as any)?.studentId;

  const { data: apiResponse, isLoading } = useStudentGrades(studentId);
  const responseData = apiResponse as any;
  const grades: GradeItem[] = (responseData?.data || []) as any[];
  const homeroomTeacher = responseData?.homeroomTeacher || "";
  const headmaster = responseData?.headmaster || "";

  return (
    <div className="rounded-xl border border-primary-900 bg-white p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Nilai Saya</h1>

        {/* Tombol Cetak PDF dengan Loading State */}
        {!isLoading && grades.length > 0 && (
          <PDFDownloadLink
            document={
              <StudentReportDocument
                studentName={(state.user as any)?.name || "Siswa"}
                nisn={
                  (state.user as any)?.nisn ||
                  responseData?.data?.[0]?.studentId ||
                  ""
                }
                className={(state.user as any)?.class || "12 TKJ 1"}
                semester="1 (Ganjil)"
                grades={grades}
                homeroomTeacher={homeroomTeacher}
                headmaster={headmaster}
              />
            }
            fileName={`Rapor_${(state.user as any)?.name || "Siswa"}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button
                disabled={loading}
                className="bg-primary-950 text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyiapkan PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

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
