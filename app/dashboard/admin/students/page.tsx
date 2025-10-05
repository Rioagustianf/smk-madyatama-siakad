"use client";

import React from "react";
import { useStudents, useStudentsBulk } from "@/lib/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useClasses } from "@/lib/hooks/use-classes";

export default function AdminStudentsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [targetSemester, setTargetSemester] = React.useState<string>("");
  const [targetGrade, setTargetGrade] = React.useState<string>("");

  const [page, setPage] = React.useState(1);
  const [semesterFilter, setSemesterFilter] = React.useState<string>("");
  const [gradeFilter, setGradeFilter] = React.useState<string>("");
  const [classFilter, setClassFilter] = React.useState<string>("");
  const { data, isLoading } = useStudents({
    search,
    page,
    limit: 10,
    semester: semesterFilter,
    gradeLevel: gradeFilter,
    class: classFilter,
  });
  const { data: classesResp } = useClasses();
  const classesList = ((classesResp as any)?.data || []).map(
    (c: any) => c.name
  ) as string[];
  const bulkMutation = useStudentsBulk();
  const students = (data as any)?.data || [];
  const pagination = (data as any)?.pagination || { page: 1, totalPages: 1 };
  const promoteNext = async () => {
    await bulkMutation.mutateAsync({
      action: "promoteGrade",
      studentIds: selectedIds,
      payload: { increment: 1 },
    } as any);
    setSelectedIds([]);
  };

  const toggleSelect = (sid: string) => {
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s: any) => s.studentId));
    }
  };

  const doChangeSemester = async () => {
    if (!targetSemester) return;
    await bulkMutation.mutateAsync({
      action: "changeSemester",
      studentIds: selectedIds,
      payload: { semester: Number(targetSemester) },
    } as any);
    setSelectedIds([]);
  };

  const setSemester = async (semester: 1 | 2) => {
    await bulkMutation.mutateAsync({
      action: "changeSemester",
      studentIds: selectedIds,
      payload: { semester },
    } as any);
    setSelectedIds([]);
  };

  const setGradeLevel = async () => {
    if (!targetGrade) return;
    await bulkMutation.mutateAsync({
      action: "setGradeLevel",
      studentIds: selectedIds,
      payload: { gradeLevel: Number(targetGrade) },
    } as any);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto px-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Siswa</h1>
        <p className="text-gray-600">Kelola semester dan kenaikan kelas</p>
      </div>

      <Card className="border border-primary-600">
        <CardHeader>
          <CardTitle>Aksi Massal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:flex-wrap gap-3 items-start md:items-end">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm mb-1">Semester</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!selectedIds.length || bulkMutation.isPending}
                  onClick={() => setSemester(1)}
                >
                  Set Ganjil
                </Button>
                <Button
                  variant="outline"
                  disabled={!selectedIds.length || bulkMutation.isPending}
                  onClick={() => setSemester(2)}
                >
                  Set Genap
                </Button>
              </div>
            </div>

            <div className="w-56">
              <label className="block text-sm mb-1">Set Kelas</label>
              <Select value={targetGrade} onValueChange={setTargetGrade}>
                <SelectTrigger className="border border-primary-600">
                  <SelectValue placeholder="Pilih Tingkat (10/11/12)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Kelas 10</SelectItem>
                  <SelectItem value="11">Kelas 11</SelectItem>
                  <SelectItem value="12">Kelas 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={
                !selectedIds.length || !targetGrade || bulkMutation.isPending
              }
              onClick={setGradeLevel}
              className="bg-primary-950 text-white"
            >
              Terapkan Kelas
            </Button>
            <Button
              disabled={!selectedIds.length || bulkMutation.isPending}
              onClick={promoteNext}
            >
              Naikkan ke Kelas Berikutnya
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aksi Per Kelas removed */}
      <Card className="border border-primary-600">
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Cari siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Select
              value={classFilter || "__ALL__"}
              onValueChange={(v) => {
                const mapped = v === "__ALL__" ? "" : v;
                setPage(1);
                setClassFilter(mapped);
              }}
            >
              <SelectTrigger className="w-full border border-primary-600">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="__ALL__">Semua Kelas</SelectItem>
                {classesList.map((cn) => (
                  <SelectItem key={cn} value={cn}>
                    {cn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={semesterFilter || "__ALL__"}
              onValueChange={(v) => {
                setPage(1);
                setSemesterFilter(v === "__ALL__" ? "" : v);
              }}
            >
              <SelectTrigger className="w-full border border-primary-600">
                <SelectValue placeholder="Semua Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Semua Semester</SelectItem>
                <SelectItem value="1">Ganjil (1)</SelectItem>
                <SelectItem value="2">Genap (2)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Select
                value={gradeFilter || "__ALL__"}
                onValueChange={(v) => {
                  setPage(1);
                  setGradeFilter(v === "__ALL__" ? "" : v);
                }}
              >
                <SelectTrigger className="w-full border border-primary-600">
                  <SelectValue placeholder="Semua Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">Semua Tingkat</SelectItem>
                  <SelectItem value="10">Kelas 10</SelectItem>
                  <SelectItem value="11">Kelas 11</SelectItem>
                  <SelectItem value="12">Kelas 12</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="whitespace-nowrap"
                onClick={() => {
                  setSearch("");
                  setClassFilter("");
                  setSemesterFilter("");
                  setGradeFilter("");
                  setPage(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <UITableHeader className="bg-primary-900 text-white">
            <TableRow className="bg-primary-900 hover:bg-primary-900">
              <TableHead>
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === students.length &&
                    students.length > 0
                  }
                  onChange={selectAll}
                />
              </TableHead>
              <TableHead className="text-white">NISN</TableHead>
              <TableHead className="text-white">Nama</TableHead>
              <TableHead className="text-white">Kelas</TableHead>
              <TableHead className="text-white">Jurusan</TableHead>
              <TableHead className="text-white">Semester</TableHead>
              <TableHead className="text-white">Tingkat</TableHead>
            </TableRow>
          </UITableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>Memuat…</TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>Belum ada data</TableCell>
              </TableRow>
            ) : (
              students.map((s: any) => (
                <TableRow key={s._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.studentId)}
                      onChange={() => toggleSelect(s.studentId)}
                    />
                  </TableCell>
                  <TableCell>{s.studentId}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{s.major}</TableCell>
                  <TableCell>{s.semester ?? "-"}</TableCell>
                  <TableCell>{s.gradeLevel ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="p-3 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) setPage((p) => Math.max(1, p - 1));
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
                  for (let i = total - 4; i <= total; i++) pages.push(i);
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
      </div>
    </div>
  );
}
