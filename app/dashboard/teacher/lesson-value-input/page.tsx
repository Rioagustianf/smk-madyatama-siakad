"use client";

import React, { useMemo, useState } from "react";
import { TeacherGradeForm } from "@/components/molecules/TeacherGradeForm/TeacherGradeForm";
// import { GradesTable, type GradeRow } from "@/components/molecules/GradesTable/GradesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { Search, Plus, NotebookPen } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAuth } from "@/lib/contexts/auth-context";
import { useBulkGrades, useSchedules, useStudents } from "@/lib/hooks/use-api";
import { useSubjects } from "@/lib/hooks/use-subjects";
import { useClasses } from "@/lib/hooks/use-classes";
import { Spinner } from "@/components/ui/spinner";
import { calculateLetterGrade } from "@/lib/utils";

// Mock data removed

export default function TeacherInputGradesPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  // const filtered = mockGrades.filter((g) => g.subject.toLowerCase().includes(search.toLowerCase()));

  // Wali Kelas mode (bulk per kelas)
  const { state } = useAuth();
  const teacher: any = state.user || {};
  // initial hint from profile (may be stale) - no longer used for guard
  const isHomeroomProfile = false;
  const { data: classesResp, isLoading: isClassesLoading } = useClasses();
  const allClasses = useMemo(
    () => ((classesResp as any)?.data || []) as any[],
    [classesResp]
  );
  const classOptions: string[] = useMemo(
    () => allClasses.map((c: any) => c.name),
    [allClasses]
  );
  const [className, setClassName] = useState<string>("");
  const [semester, setSemester] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { data: studentsResp } = useStudents({
    class: className,
    page,
    limit: 10,
  });
  const students = ((studentsResp as any)?.data || []) as any[];
  const pagination = (studentsResp as any)?.pagination || {
    page: 1,
    totalPages: 1,
  };
  const { data: schedulesResp } = useSchedules({
    class: className,
    limit: 200,
  });
  // Load master subjects as fallback
  const { data: subjectsResp } = useSubjects();
  const masterSubjects = ((subjectsResp as any)?.data || []) as any[];
  const subjects = useMemo(() => {
    // Try to build from schedules first
    const fromSchedules = new Map<
      string,
      { subjectId: string; subject: string }
    >();
    const schedList = ((schedulesResp as any)?.data || []) as any[];
    schedList.forEach((s: any) => {
      const name = String(s.subject || "").trim();
      if (!name) return;
      if (!fromSchedules.has(name)) {
        const found = masterSubjects.find(
          (m: any) => String(m.name).toLowerCase() === name.toLowerCase()
        );
        fromSchedules.set(name, {
          subjectId: String(found?._id || name),
          subject: found?.name || name,
        });
      }
    });
    const built = Array.from(fromSchedules.values());
    if (built.length > 0) return built;
    // Fallback to all master subjects if schedules did not yield any
    return masterSubjects.map((m: any) => ({
      subjectId: String(m._id || m.id || m.name),
      subject: m.name,
    }));
  }, [schedulesResp, subjectsResp]);
  const bulkMutation = useBulkGrades();

  // Robust homeroom check against classes collection (wali kelas = homeroomTeacherId)
  const teacherId = teacher?.id || teacher?._id;
  // Determine homeroom strictly by matching classes.homeroomTeacherId === teacherId
  const isHomeroom = useMemo(() => {
    if (!teacherId) return false;
    return allClasses.some(
      (c: any) => String(c.homeroomTeacherId) === String(teacherId)
    );
  }, [allClasses, teacherId]);

  const handleCellChange = (studentId: string, field: string, value: any) => {
    setRows((prev) => {
      const next = [...prev];
      const idx = next.findIndex((r) => r.studentId === studentId);
      if (idx === -1) {
        next.push({
          studentId,
          assignments: 0,
          midterm: 0,
          final: 0,
          grade: "A",
        });
      }
      const i = idx === -1 ? next.length - 1 : idx;
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleSubmitBulk = async () => {
    const payload = rows.flatMap((r) =>
      subjectIds.map((sid) => ({
        ...r,
        subjectId: sid,
        semester,
        year,
        teacherId: teacher?.id || teacher?._id || teacher?.teacherId,
      }))
    );
    if (payload.length === 0) return;
    await bulkMutation.mutateAsync(payload as any);
    setRows([]);
  };

  if (isClassesLoading) {
    return (
      <div className="h-screen w-full flex items-center bg-muted/30 p-6">
        <div className="mx-auto max-w-7xl space-y-6 flex items-center gap-2">
          <Spinner className="size-4" />
          Memuat data...
        </div>
      </div>
    );
  }

  if (!isHomeroom) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminHeader
            title="Akses Dibatasi"
            subtitle="Hanya wali kelas yang dapat menginput nilai"
          />
          <Card>
            <CardHeader>
              <CardTitle>Akses Dibatasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hanya wali kelas yang dapat menginput nilai pada sistem ini.
                Silakan hubungi admin apabila Anda adalah wali kelas namun belum
                memiliki akses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Input Nilai Siswa"
          subtitle="Kelola dan input nilai per mata pelajaran"
        />

        {
          <Tabs defaultValue="wali-kelas" className="w-full">
            <TabsList className="grid grid-cols-1 w-full max-w-md">
              <TabsTrigger value="wali-kelas">Wali Kelas</TabsTrigger>
            </TabsList>
            {/* Wali Kelas - bulk semua mapel */}
            <TabsContent value="wali-kelas" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Input Nilai</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Select
                      value={className || "__NONE__"}
                      onValueChange={(v) =>
                        setClassName(v === "__NONE__" ? "" : v)
                      }
                    >
                      <SelectTrigger className="border border-primary-600">
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-auto">
                        <SelectItem value="__NONE__">Pilih Kelas</SelectItem>
                        {classOptions.map((cn) => (
                          <SelectItem key={cn} value={cn}>
                            {cn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={String(semester)}
                      onValueChange={(v) => setSemester(parseInt(v, 10))}
                    >
                      <SelectTrigger className="border border-primary-600">
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ganjil (1)</SelectItem>
                        <SelectItem value="2">Genap (2)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) =>
                        setYear(
                          parseInt(
                            e.target.value || String(new Date().getFullYear()),
                            10
                          )
                        )
                      }
                      placeholder="Tahun"
                    />
                    <Select
                      onValueChange={(v) =>
                        setSubjectIds((prev) =>
                          prev.includes(v) ? prev : [...prev, v]
                        )
                      }
                    >
                      <SelectTrigger className="border border-primary-600">
                        <SelectValue placeholder="Tambah Mapel dari Jadwal" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s: any) => (
                          <SelectItem key={s.subjectId} value={s.subjectId}>
                            {s.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <UITableHeader className="bg-primary-900 text-white">
                        <TableRow className="bg-primary-950 hover:bg-primary-950">
                          <TableHead className="text-white">NISN</TableHead>
                          <TableHead className="text-white">Nama</TableHead>
                          <TableHead className="text-white">Tugas</TableHead>
                          <TableHead className="text-white">UTS</TableHead>
                          <TableHead className="text-white">UAS</TableHead>
                          <TableHead className="text-white">Grade</TableHead>
                        </TableRow>
                      </UITableHeader>
                      <TableBody>
                        {students.map((st: any) => (
                          <TableRow key={st._id}>
                            <TableCell>{st.studentId}</TableCell>
                            <TableCell>{st.name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="w-24"
                                onChange={(e) =>
                                  handleCellChange(
                                    st.studentId,
                                    "assignments",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="w-24"
                                onChange={(e) =>
                                  handleCellChange(
                                    st.studentId,
                                    "midterm",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="w-24"
                                onChange={(e) =>
                                  handleCellChange(
                                    st.studentId,
                                    "final",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const row =
                                  rows.find(
                                    (r: any) => r.studentId === st.studentId
                                  ) || {};
                                const a = Number(row.assignments || 0);
                                const m = Number(row.midterm || 0);
                                const f = Number(row.final || 0);
                                const g = calculateLetterGrade((a + m + f) / 3);
                                return (
                                  <div className="px-3 py-1 w-24 text-center rounded border border-primary-600 bg-primary-50">
                                    {g}
                                  </div>
                                );
                              })()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="p-3 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (pagination.page > 1)
                                setPage((p) => Math.max(1, p - 1));
                            }}
                            className={
                              pagination.page <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {(() => {
                          const total = Number(pagination.totalPages || 1);
                          const current = Number(pagination.page || 1);
                          const pages: number[] = [];
                          if (total <= 5) {
                            for (let i = 1; i <= total; i++) pages.push(i);
                          } else if (current <= 3) {
                            for (let i = 1; i <= 5; i++) pages.push(i);
                          } else if (current >= total - 2) {
                            for (let i = total - 4; i <= total; i++)
                              pages.push(i);
                          } else {
                            for (let i = current - 2; i <= current + 2; i++)
                              pages.push(i);
                          }
                          return (
                            <>
                              {pages.map((n) => (
                                <PaginationItem key={n}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPage(n);
                                    }}
                                    isActive={current === n}
                                    className={
                                      current === n
                                        ? "border-primary-600 text-primary-600 hover:bg-primary-50 cursor-pointer"
                                        : "cursor-pointer"
                                    }
                                  >
                                    {n}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              {total > 5 && current < total - 2 && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                            </>
                          );
                        })()}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (pagination.page < pagination.totalPages)
                                setPage((p) => p + 1);
                            }}
                            className={
                              pagination.page >= pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                  <Button
                    className="bg-primary-950 text-white"
                    onClick={handleSubmitBulk}
                    disabled={!className || subjectIds.length === 0}
                  >
                    Simpan Nilai Massal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        }
      </div>
    </div>
  );
}
