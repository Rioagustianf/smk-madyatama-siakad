"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useExams } from "@/lib/hooks/use-exams";
import { useSubjects } from "@/lib/hooks/use-subjects";
import { useClasses } from "@/lib/hooks/use-classes";
import { useAuthQuery } from "@/lib/hooks/use-auth";

const EXAM_TYPES = [
  { value: "midterm", label: "UTS (Ujian Tengah Semester)" },
  { value: "final", label: "UAS (Ujian Akhir Semester)" },
  { value: "assignment", label: "Tugas / Kuis" },
];

export default function StudentExamsPage() {
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  const { data: user } = useAuthQuery();
  const { data: classesData } = useClasses({ limit: 100 });

  // Find the class ID that matches the student's class name
  const studentClassId = React.useMemo(() => {
    if (!user || user.role !== "student" || !classesData?.data)
      return undefined;
    const studentClass = classesData.data.find(
      (c: any) => c.name === user.class
    );
    return studentClass?.id;
  }, [user, classesData]);

  const { data: examsData, isLoading } = useExams({
    search,
    subjectId: filterSubject !== "all" ? filterSubject : undefined,
    classId: studentClassId, // Filter by student's class
  });

  const { data: subjectsData } = useSubjects({ limit: 100 });
  const subjects = subjectsData?.data || [];
  const exams = examsData?.data || [];

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Jadwal Ujian
            </h1>
            <p className="text-muted-foreground">Lihat jadwal ujian Anda</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari mapel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <AdminTableCard
          title="Daftar Jadwal Ujian"
          description="Informasi jadwal ujian yang akan datang"
        >
          <div className="p-4 flex gap-4 border-b">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                {subjects.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table className="bg-white">
            <TableHeader>
              <TableRow className="bg-primary-900 hover:bg-primary-900">
                <TableHead className="text-white">Tanggal & Waktu</TableHead>
                <TableHead className="text-white">Mapel</TableHead>
                <TableHead className="text-white">Kelas</TableHead>
                <TableHead className="text-white">Ruang</TableHead>
                <TableHead className="text-white">Tipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : exams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada jadwal ujian ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam: any) => (
                  <TableRow key={exam.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">
                        {format(new Date(exam.date), "EEEE, dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {exam.startTime} - {exam.endTime}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {exam.subject?.name}
                      <span className="block text-xs text-muted-foreground">
                        {exam.subject?.code}
                      </span>
                    </TableCell>
                    <TableCell>{exam.class?.name}</TableCell>
                    <TableCell>{exam.room}</TableCell>
                    <TableCell>
                      <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        {EXAM_TYPES.find((t) => t.value === exam.type)?.label ||
                          exam.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AdminTableCard>
      </div>
    </div>
  );
}
