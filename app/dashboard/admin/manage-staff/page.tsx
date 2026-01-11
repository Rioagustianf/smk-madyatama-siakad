"use client";

import React, { useState } from "react";
import {
  useStaffList,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "@/lib/hooks/use-staff";
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

interface StaffFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  position: string;
  department: string;
}

const initialFormData: StaffFormData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  position: "Staff Keuangan",
  department: "Keuangan",
};

// Helper to generate username from name
function nameToUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 20);
}

export default function ManageStaffPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [deletingStaff, setDeletingStaff] = useState<any>(null);
  const [formData, setFormData] = useState<StaffFormData>(initialFormData);

  // Filter specifically for finance role if needed, or just generic staff
  // For now we assume this page manages 'finance' staff as per user request
  // We can pass role="finance" to filter if API supports it (it does)
  const { data, isLoading } = useStaffList({
    page,
    limit: 10,
    search,
    isActive: statusFilter === "" ? undefined : statusFilter === "true",
    role: "finance",
  });

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  const staffList = (data as any)?.data || [];
  const pagination = (data as any)?.pagination || { page: 1, totalPages: 1 };

  const handleOpenCreate = () => {
    setEditingStaff(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff: any) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name || "",
      username: staff.username || "",
      email: staff.email || "",
      phone: staff.phone || "",
      position: staff.position || "Staff Keuangan",
      department: staff.department || "Keuangan",
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (staff: any) => {
    setDeletingStaff(staff);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role: "finance", // Enforce finance role
      isActive: true, // Default active
    };

    if (editingStaff) {
      await updateMutation.mutateAsync({
        id: editingStaff.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditingStaff(null);
  };

  const handleDelete = async () => {
    if (deletingStaff) {
      await deleteMutation.mutateAsync(deletingStaff.id);
      setIsDeleteOpen(false);
      setDeletingStaff(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kelola Staff Keuangan
          </h1>
          <p className="text-gray-600">
            Tambah, edit, dan hapus data staff keuangan
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary-950 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Staff
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
                placeholder="Cari nama staff..."
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
              <TableHead className="text-white">Nama</TableHead>
              <TableHead className="text-white">Username</TableHead>
              <TableHead className="text-white">Jabatan</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">No. HP</TableHead>
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
            ) : staffList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data staff keuangan
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((staff: any) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.username}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.email || "-"}</TableCell>
                  <TableCell>{staff.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={staff.isActive ? "default" : "secondary"}
                      className={
                        staff.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {staff.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(staff)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOpenDelete(staff)}
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
              {editingStaff ? "Edit Staff" : "Tambah Staff Baru"}
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
                      username: !editingStaff
                        ? nameToUsername(name)
                        : prev.username,
                    }));
                  }}
                  placeholder="Nama lengkap staff"
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
                <Label>Jabatan</Label>
                <Input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="Contoh: Staff Keuangan"
                />
              </div>
              <div>
                <Label>Departemen</Label>
                <Input
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Contoh: Keuangan"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@sekolah.id"
                />
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
                {editingStaff ? "Simpan Perubahan" : "Tambah Staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Staff?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus staff{" "}
              <strong>{deletingStaff?.name}</strong>? Tindakan ini tidak dapat
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
