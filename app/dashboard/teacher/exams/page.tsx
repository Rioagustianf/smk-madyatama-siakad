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
import { Search, Loader2, Eye } from "lucide-react";
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

export default function TeacherExamsPage() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  const { data: user } = useAuthQuery();

  const { data: examsData, isLoading } = useExams({
    search,
    classId: filterClass !== "all" ? filterClass : undefined,
    subjectId: filterSubject !== "all" ? filterSubject : undefined,
  });

  const teacherId = user?.role === "teacher" ? user.id : undefined;

  const { data: subjectsData } = useSubjects({
    limit: 100,
    teacherId,
  });

  const { data: classesData } = useClasses({ limit: 100 });

  const exams = examsData?.data || [];
  const subjects = subjectsData?.data || [];
  const allClasses = classesData?.data || [];

  const teacherClasses = React.useMemo(() => {
    if (!user?.classes || !Array.isArray(user.classes)) return [];

    return allClasses.filter(
      (c: any) => user.classes.includes(c.name) || user.classes.includes(c.id),
    );
  }, [user?.classes, allClasses]);

  const classes = teacherClasses;
  const myExams = exams.filter((exam: any) => {
    const mySubjectIds = subjects.map((s: any) => s.id);
    return mySubjectIds.includes(exam.subjectId);
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Jadwal Ujian
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Lihat jadwal ujian siswa (hanya baca)
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari mapel atau kelas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <AdminTableCard
          title="Daftar Ujian"
          description="Jadwal ujian untuk mata pelajaran Anda"
        >
          <div className="p-4 flex gap-4 border-b">
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Mapel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mapel</SelectItem>
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
              ) : myExams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada jadwal ujian ditemukan untuk mata pelajaran Anda
                  </TableCell>
                </TableRow>
              ) : (
                myExams.map((exam: any) => (
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
