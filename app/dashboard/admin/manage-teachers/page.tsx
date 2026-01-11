"use client";

import React, { useState } from "react";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@/lib/hooks/use-teachers";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";

interface TeacherFormData {
  name: string;
  username: string;
  nip: string;
  phone: string;
  education: string;
}

const initialFormData: TeacherFormData = {
  name: "",
  username: "",
  nip: "",
  phone: "",
  education: "",
};

// Helper to generate username from name
function nameToUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 20);
}

export default function ManageTeachersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<any>(null);
  const [formData, setFormData] = useState<TeacherFormData>(initialFormData);
  const [nipError, setNipError] = useState("");

  const { data, isLoading } = useTeachers({
    page,
    limit: 10,
    search,
    isActive: statusFilter === "" ? undefined : statusFilter === "true",
  });

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  const teachers = (data as any)?.data || [];
  const pagination = (data as any)?.pagination || { page: 1, totalPages: 1 };

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      username: teacher.username || "",
      nip: teacher.nip || "",
      phone: teacher.phone || "",
      education: teacher.education || "",
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (teacher: any) => {
    setDeletingTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNipError("");

    // Validate NIP: must be exactly 18 digits or empty
    if (formData.nip && !/^\d{18}$/.test(formData.nip)) {
      setNipError("NIP harus terdiri dari 18 digit angka");
      return;
    }

    if (editingTeacher) {
      await updateMutation.mutateAsync({
        id: editingTeacher.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditingTeacher(null);
  };

  const handleDelete = async () => {
    if (deletingTeacher) {
      await deleteMutation.mutateAsync(deletingTeacher.id);
      setIsDeleteOpen(false);
      setDeletingTeacher(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Guru</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus data guru</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary-950 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Guru
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-primary-600">
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama guru..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter || "__ALL__"}
              onValueChange={(v) => {
                setStatusFilter(v === "__ALL__" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="border border-primary-600">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Semua Status</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
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
              <TableHead className="text-white">NIP</TableHead>
              <TableHead className="text-white">Nama</TableHead>
              <TableHead className="text-white">Username</TableHead>
              <TableHead className="text-white">No. HP</TableHead>
              <TableHead className="text-white">Pendidikan</TableHead>
              <TableHead className="text-white">Status</TableHead>
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
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data guru
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher: any) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-mono">
                    {teacher.nip || "-"}
                  </TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.username}</TableCell>
                  <TableCell>{teacher.phone || "-"}</TableCell>
                  <TableCell>{teacher.education || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={teacher.isActive ? "default" : "secondary"}
                      className={
                        teacher.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {teacher.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(teacher)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOpenDelete(teacher)}
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
              {editingTeacher ? "Edit Guru" : "Tambah Guru Baru"}
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
                      username: !editingTeacher
                        ? nameToUsername(name)
                        : prev.username,
                    }));
                  }}
                  placeholder="Nama lengkap guru"
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
                  placeholder="Username untuk login"
                />
              </div>
              <div>
                <Label>NIP (18 digit)</Label>
                <Input
                  value={formData.nip}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 18);
                    setFormData({ ...formData, nip: value });
                    if (nipError) setNipError("");
                  }}
                  placeholder="Nomor Induk Pegawai (18 digit)"
                  maxLength={18}
                  className={nipError ? "border-red-500" : ""}
                />
                {nipError ? (
                  <p className="text-xs text-red-600 mt-1">{nipError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    NIP harus 18 digit (akan ditampilkan di rapor siswa)
                  </p>
                )}
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
                <Label>Pendidikan Terakhir</Label>
                <Input
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  placeholder="S1 Pendidikan Matematika"
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
                {editingTeacher ? "Simpan Perubahan" : "Tambah Guru"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Guru?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus guru{" "}
              <strong>{deletingTeacher?.name}</strong>? Tindakan ini tidak dapat
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
