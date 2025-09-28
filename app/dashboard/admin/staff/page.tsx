"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { StaffForm } from "@/components/molecules/StaffForm/StaffForm";
import {
  useStaffList,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "@/lib/hooks/use-staff";

type Staff = {
  _id: string;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string | Date;
};

export default function AdminStaffPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    image: "",
    bio: "",
    education: "",
    experience: 0,
    certifications: [] as string[],
    isActive: true,
  });

  const { data, isLoading, error } = useStaffList({
    search,
    page: 1,
    limit: 50,
  });
  const staffList: Staff[] = (data as any)?.data || [];
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Kepala Sekolah & Tenaga Pendidik"
          subtitle="Kelola profil ringkas staf untuk halaman publik"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative border border-primary-600 rounded-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari staf..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary-950 text-white hover:bg-primary-900">
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Tambah Staf
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi staf
                    </DialogDescription>
                  </DialogHeader>
                  <StaffForm
                    formData={formData}
                    onInputChange={(field, value) =>
                      setFormData({ ...formData, [field]: value })
                    }
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await createMutation.mutateAsync(formData as any);
                      setIsAddOpen(false);
                      setFormData({
                        name: "",
                        position: "",
                        department: "",
                        email: "",
                        phone: "",
                        image: "",
                        bio: "",
                        education: "",
                        experience: 0,
                        certifications: [],
                        isActive: true,
                      });
                    }}
                    isLoading={createMutation.isPending}
                    submitText="Simpan"
                    onCancel={() => setIsAddOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <AdminTableCard
          title="Daftar Staf"
          description="Kelola profil ringkas staf"
        >
          {isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">
                {createMutation.isPending && "Menyimpan data..."}
                {updateMutation.isPending && "Memperbarui data..."}
                {deleteMutation.isPending && "Menghapus data..."}
                {isLoading && "Memuat data..."}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <span>Gagal memuat data staf</span>
            </div>
          ) : (
            <Table className="bg-white">
              <TableHeader>
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Nama</TableHead>
                  <TableHead className="text-white">Jabatan</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data staf
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((s) => (
                    <TableRow key={s._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.position}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => {
                                try {
                                  if (
                                    typeof document !== "undefined" &&
                                    document.activeElement instanceof
                                      HTMLElement
                                  ) {
                                    document.activeElement.blur();
                                  }
                                } catch {}
                                setIsAddOpen(false);
                                setEditingStaff(s);
                                setFormData({
                                  name: s.name,
                                  position: s.position,
                                  department: s.department || "",
                                  email: s.email || "",
                                  phone: s.phone || "",
                                  image: s.image || "",
                                  bio: s.bio || "",
                                  education: "",
                                  experience: 0,
                                  certifications: [],
                                  isActive: s.isActive,
                                });
                                setIsEditOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={async () => {
                                await deleteMutation.mutateAsync(s._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </AdminTableCard>
        <Dialog
          open={isEditOpen}
          onOpenChange={(open) => {
            if (open) {
              try {
                if (
                  typeof document !== "undefined" &&
                  document.activeElement instanceof HTMLElement
                ) {
                  document.activeElement.blur();
                }
              } catch {}
              setIsAddOpen(false);
            } else {
              setEditingStaff(null);
              setFormData({
                name: "",
                position: "",
                department: "",
                email: "",
                phone: "",
                image: "",
                bio: "",
                education: "",
                experience: 0,
                certifications: [],
                isActive: true,
              });
            }
            setIsEditOpen(open);
          }}
        >
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Edit Staf
              </DialogTitle>
              <DialogDescription>Perbarui informasi staf</DialogDescription>
            </DialogHeader>
            <StaffForm
              formData={formData as any}
              onInputChange={(field, value) =>
                setFormData({ ...formData, [field]: value })
              }
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingStaff) return;
                await updateMutation.mutateAsync({
                  id: editingStaff._id,
                  data: formData,
                });
                setIsEditOpen(false);
                setEditingStaff(null);
              }}
              isLoading={updateMutation.isPending}
              submitText="Simpan Perubahan"
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
