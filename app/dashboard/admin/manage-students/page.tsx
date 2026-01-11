"use client";

import React, { useState } from "react";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/lib/hooks/use-api";
import { useClasses } from "@/lib/hooks/use-classes";
import { useMajors } from "@/lib/hooks/use-majors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";

interface StudentFormData {
  name: string;
  studentId: string;
  username: string;
  class: string;
  major: string;
  phone: string;
  parentName: string;
  gradeLevel: number;
  semester: number;
  year: number;
}

const initialFormData: StudentFormData = {
  name: "",
  studentId: "",
  username: "",
  class: "",
  major: "",
  phone: "",
  parentName: "",
  gradeLevel: 10,
  semester: 1,
  year: new Date().getFullYear(),
};

// Helper to generate username from name
function nameToUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 20);
}

export default function ManageStudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [deletingStudent, setDeletingStudent] = useState<any>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  const { data, isLoading } = useStudents({
    page,
    limit: 10,
    search,
    class: classFilter,
    major: majorFilter,
  });
  const { data: classesData } = useClasses();
  const { data: majorsData } = useMajors();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const students = (data as any)?.data || [];
  const pagination = (data as any)?.pagination || { page: 1, totalPages: 1 };
  const classes = ((classesData as any)?.data || []).map((c: any) => c.name);
  const majors = ((majorsData as any)?.data || []).map((m: any) => m.name);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      studentId: student.studentId || "",
      username: student.username || "",
      class: student.class || "",
      major: student.major || "",
      phone: student.phone || "",
      parentName: student.parentName || "",
      gradeLevel: student.gradeLevel || 10,
      semester: student.semester || 1,
      year: student.year || new Date().getFullYear(),
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (student: any) => {
    setDeletingStudent(student);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role: "student",
      isActive: true,
    };

    if (editingStudent) {
      await updateMutation.mutateAsync({
        _id: editingStudent.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditingStudent(null);
  };

  const handleDelete = async () => {
    if (deletingStudent) {
      await deleteMutation.mutateAsync(deletingStudent.id);
      setIsDeleteOpen(false);
      setDeletingStudent(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Siswa</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus data siswa</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary-950 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-primary-600">
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari siswa..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={classFilter || "__ALL__"}
              onValueChange={(v) => {
                setClassFilter(v === "__ALL__" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="border border-primary-600">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="__ALL__">Semua Kelas</SelectItem>
                {classes.map((c: string) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={majorFilter || "__ALL__"}
              onValueChange={(v) => {
                setMajorFilter(v === "__ALL__" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="border border-primary-600">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Semua Jurusan</SelectItem>
                {majors.map((m: string) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setClassFilter("");
                setMajorFilter("");
                setPage(1);
              }}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-primary-900">
            <TableRow className="bg-primary-900 hover:bg-primary-900">
              <TableHead className="text-white">NISN</TableHead>
              <TableHead className="text-white">Nama</TableHead>
              <TableHead className="text-white">Kelas</TableHead>
              <TableHead className="text-white">Jurusan</TableHead>
              <TableHead className="text-white">No. HP</TableHead>
              <TableHead className="text-white">Wali</TableHead>
              <TableHead className="text-white text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data siswa
                </TableCell>
              </TableRow>
            ) : (
              students.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">
                    {student.studentId}
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.phone || "-"}</TableCell>
                  <TableCell>{student.parentName || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(student)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOpenDelete(student)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-3 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((p) => p - 1);
                  }}
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => i + 1
              ).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(n);
                    }}
                    isActive={page === n}
                    className="cursor-pointer"
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pagination.totalPages) setPage((p) => p + 1);
                  }}
                  className={
                    page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Edit Siswa" : "Tambah Siswa Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nama Lengkap *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      username: !editingStudent
                        ? nameToUsername(name)
                        : prev.username,
                    }));
                  }}
                  placeholder="Nama lengkap siswa"
                />
              </div>
              <div>
                <Label>Username *</Label>
                <Input
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Username login"
                />
              </div>
              <div>
                <Label>NISN *</Label>
                <Input
                  required
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentId: e.target.value,
                    })
                  }
                  placeholder="Nomor Induk Siswa"
                />
              </div>
              <div>
                <Label>Kelas *</Label>
                <Select
                  value={formData.class}
                  onValueChange={(v) => setFormData({ ...formData, class: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {classes.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jurusan *</Label>
                <Select
                  value={formData.major}
                  onValueChange={(v) => setFormData({ ...formData, major: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((m: string) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tingkat</Label>
                <Select
                  value={String(formData.gradeLevel)}
                  onValueChange={(v) =>
                    setFormData({ ...formData, gradeLevel: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Kelas 10</SelectItem>
                    <SelectItem value="11">Kelas 11</SelectItem>
                    <SelectItem value="12">Kelas 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Semester</Label>
                <Select
                  value={String(formData.semester)}
                  onValueChange={(v) =>
                    setFormData({ ...formData, semester: Number(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ganjil (1)</SelectItem>
                    <SelectItem value="2">Genap (2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>No. HP / WA</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <Label>Nama Orang Tua / Wali</Label>
                <Input
                  value={formData.parentName}
                  onChange={(e) =>
                    setFormData({ ...formData, parentName: e.target.value })
                  }
                  placeholder="Nama wali"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-950 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingStudent ? "Simpan Perubahan" : "Tambah Siswa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus siswa{" "}
              <strong>{deletingStudent?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
