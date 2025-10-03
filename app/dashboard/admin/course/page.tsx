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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, BookOpen, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { ActionButtons } from "@/components/molecules/ActionButtons/ActionButtons";
import { SubjectForm } from "@/components/molecules/SubjectForm/SubjectForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "@/lib/hooks/use-subjects";
import { useTeachers } from "@/lib/hooks/use-teachers";

export default function AdminCoursePage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    teacherId: "",
  });

  const { data, isLoading, error } = useSubjects({
    search,
    page: currentPage,
    limit: 5,
  });
  const { data: teachersData } = useTeachers();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const subjects = (data as any)?.data || [];
  const pagination = (data as any)?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const teachers = (teachersData as any)?.data || [];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      teacherId: "",
    });
    setSelected(null);
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData as any);
    resetForm();
  };

  const handleEdit = (item: any) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelected(item);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || "",
      teacherId: item.teacherId || "",
    });
    setIsAddOpen(false);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await updateMutation.mutateAsync({
      id: selected._id || selected.id,
      data: formData,
    });
    resetForm();
  };

  const handleDelete = async (item: any) => {
    await deleteMutation.mutateAsync(item._id || item.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Mata Pelajaran"
          subtitle="Kelola data mapel"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari (nama/kode)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64 border border-primary-600 rounded-md"
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
                      <BookOpen className="h-5 w-5" />
                      Tambah Mapel
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi mata pelajaran
                    </DialogDescription>
                  </DialogHeader>
                  <SubjectForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleCreate}
                    isLoading={createMutation.isPending}
                    submitText="Simpan"
                    onCancel={resetForm}
                    teachers={teachers}
                  />
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <AdminTableCard
          title="Daftar Mata Pelajaran"
          description="Kelola data mapel"
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
              <span>Gagal memuat data mata pelajaran</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Nama</TableHead>
                  <TableHead className="text-white">Kode</TableHead>
                  <TableHead className="text-white">Guru</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data mata pelajaran
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((s: any) => (
                    <TableRow key={s._id || s.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.code}</TableCell>
                      <TableCell>{s.teacherName || "-"}</TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEdit(s)}
                          onDelete={() => handleDelete(s)}
                          itemName={s.name}
                          formData={formData as any}
                          onInputChange={handleInputChange}
                          onSubmit={handleUpdate}
                          isLoading={updateMutation.isPending}
                          onCancel={() => setIsEditOpen(false)}
                          isEditDialogOpen={isEditOpen}
                          onEditDialogChange={(open) => {
                            setIsEditOpen(open);
                            if (!open) resetForm();
                          }}
                          formType="subject"
                          teachers={teachers}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </AdminTableCard>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className={`cursor-pointer ${
                          currentPage === pageNum
                            ? "border-primary-600 text-primary-600 hover:bg-primary-50"
                            : "hover:bg-muted"
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
