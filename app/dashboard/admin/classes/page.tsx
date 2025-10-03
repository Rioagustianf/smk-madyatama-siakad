"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from "@/lib/hooks/use-classes";
import { useMajors } from "@/lib/hooks/use-majors";
import { useTeachers } from "@/lib/hooks/use-teachers";
import ClassForm from "@/components/molecules/ClassForm/ClassForm";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface ClassFormData {
  name: string;
  majorId?: string;
  homeroomTeacherId?: string;
  isActive?: boolean;
}

export default function AdminClassesPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    majorId: "",
    homeroomTeacherId: "",
    isActive: true,
  });

  const limit = 5;

  // Fetch data
  const { data: classesData, isLoading } = useClasses({
    search,
    page: currentPage,
    limit,
  });
  const { data: majorsData } = useMajors();
  const { data: teachersData } = useTeachers();

  const classes = (classesData as any)?.data || [];
  const pagination = (classesData as any)?.pagination || {};
  const majors = (majorsData as any)?.data || [];
  const teachers = (teachersData as any)?.data || [];

  // Mutations
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();

  // Reset current page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleAdd = () => {
    setFormData({
      name: "",
      majorId: "",
      homeroomTeacherId: "",
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Blur any focused element to prevent aria-hidden issues
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Close add dialog if open
    if (isAddDialogOpen) {
      setIsAddDialogOpen(false);
    }

    setFormData({
      name: item.name,
      majorId: item.majorId || "",
      homeroomTeacherId: item.homeroomTeacherId || "",
      isActive: item.isActive ?? true,
    });
    setSelectedClass(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedClass(item);
  };

  const handleInputChange = (field: keyof ClassFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedClass) {
        // Update
        await updateClassMutation.mutateAsync({
          id: selectedClass._id,
          data: formData,
        });
        setIsEditDialogOpen(false);
        setSelectedClass(null);
      } else {
        // Create
        await createClassMutation.mutateAsync(formData);
        setIsAddDialogOpen(false);
      }

      // Reset form
      setFormData({
        name: "",
        majorId: "",
        homeroomTeacherId: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedClass) {
      try {
        await deleteClassMutation.mutateAsync(selectedClass._id);
        setSelectedClass(null);
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedClass(null);
    setFormData({
      name: "",
      majorId: "",
      homeroomTeacherId: "",
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
          <p className="text-gray-600">Kelola data kelas dan wali kelas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64 border border-primary-600"
            />
          </div>
          <Button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-primary-950 text-white hover:bg-primary-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kelas
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-primary-600 shadow-sm">
        <div className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Nama Kelas</TableHead>
                  <TableHead className="text-white">Jurusan</TableHead>
                  <TableHead className="text-white">Wali Kelas</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-500">
                          Memuat data...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-lg font-medium">
                          Belum ada data kelas
                        </p>
                        <p className="text-sm">
                          Klik tombol &quot;Tambah Kelas&quot; untuk menambahkan
                          kelas pertama
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((c: any) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.majorName || "-"}</TableCell>
                      <TableCell>{c.homeroomTeacherName || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            c.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.isActive ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(c)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <DeleteConfirmation
                            onConfirm={handleDeleteConfirm}
                            itemName={c.name}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(c)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {classes.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? "border-primary-600 text-primary-600 hover:bg-primary-50"
                            : ""
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage >= pagination.totalPages
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent onInteractOutside={handleDialogClose}>
          <DialogHeader>
            <DialogTitle>Tambah Kelas Baru</DialogTitle>
          </DialogHeader>
          <ClassForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={createClassMutation.isPending}
            submitText="Tambah"
            onCancel={handleDialogClose}
            majors={majors}
            teachers={teachers}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent onInteractOutside={handleDialogClose}>
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
          </DialogHeader>
          <ClassForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={updateClassMutation.isPending}
            submitText="Perbarui"
            onCancel={handleDialogClose}
            majors={majors}
            teachers={teachers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
