"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, GraduationCap, Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import { MajorForm } from "@/components/molecules/MajorForm/MajorForm";
import {
  useMajors,
  useCreateMajor,
  useUpdateMajor,
  useDeleteMajor,
} from "@/lib/hooks/use-majors";
import { Major } from "@/lib/types";

interface Props {
  searchQuery?: string;
}

export function MajorsTab({ searchQuery = "" }: Props) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    image: "",
    facilities: "",
    careerProspects: "",
    headName: "",
    headPhoto: "",
    vision: "",
    mission: "",
  });

  const { data: majorsData, isLoading } = useMajors();
  const createMajorMutation = useCreateMajor();
  const updateMajorMutation = useUpdateMajor();
  const deleteMajorMutation = useDeleteMajor();

  const majors = (majorsData as any)?.data || [];

  const filteredMajors = useMemo(() => {
    if (!searchQuery) return majors;
    const query = searchQuery.toLowerCase();
    return majors.filter(
      (major: Major) =>
        major.name.toLowerCase().includes(query) ||
        major.code.toLowerCase().includes(query),
    );
  }, [majors, searchQuery]);

  const isBusy = useMemo(() => {
    return (
      createMajorMutation.isPending ||
      updateMajorMutation.isPending ||
      deleteMajorMutation.isPending
    );
  }, [
    createMajorMutation.isPending,
    updateMajorMutation.isPending,
    deleteMajorMutation.isPending,
  ]);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      image: "",
      facilities: "",
      careerProspects: "",
      headName: "",
      headPhoto: "",
      vision: "",
      mission: "",
    });
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMajorMutation.mutateAsync({
      ...formData,
      facilities: formData.facilities
        ? formData.facilities.split(",").map((f) => f.trim())
        : [],
      careerProspects: formData.careerProspects
        ? formData.careerProspects.split(",").map((c) => c.trim())
        : [],
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditMajor = (major: Major) => {
    setSelectedMajor(major);
    setFormData({
      name: major.name,
      code: major.code,
      description: major.description || "",
      image: major.image || "",
      facilities: Array.isArray(major.facilities)
        ? major.facilities.join(", ")
        : "",
      careerProspects: Array.isArray(major.careerProspects)
        ? major.careerProspects.join(", ")
        : "",
      headName: (major as any).headName || "",
      headPhoto: (major as any).headPhoto || "",
      vision: (major as any).vision || "",
      mission: (major as any).mission || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMajor) return;

    await updateMajorMutation.mutateAsync({
      id: selectedMajor.id || (selectedMajor as any)._id,
      data: {
        ...formData,
        facilities: formData.facilities
          ? formData.facilities.split(",").map((f) => f.trim())
          : [],
        careerProspects: formData.careerProspects
          ? formData.careerProspects.split(",").map((c) => c.trim())
          : [],
      },
    });
    setIsEditDialogOpen(false);
    resetForm();
    setSelectedMajor(null);
  };

  const handleDeleteMajor = async (major: Major) => {
    await deleteMajorMutation.mutateAsync(major.id);
  };

  return (
    <div className="space-y-4">
      {/* Header dengan tombol add */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Daftar Program Keahlian</h3>
          <p className="text-sm text-muted-foreground">
            Kelola program keahlian sekolah
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary-950 text-white"
              onClick={openAdd}
              disabled={isBusy}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Program Keahlian</DialogTitle>
              <DialogDescription>
                Tambahkan program keahlian baru
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(85vh-8rem)] overflow-y-auto pr-2">
              <MajorForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleAddMajor}
                isLoading={isBusy}
                submitText="Tambah Program Keahlian"
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader className="rounded-md">
            <TableRow className="bg-primary-900 hover:bg-primary-900">
              <TableHead className="text-white">Kode</TableHead>
              <TableHead className="text-white">Program Keahlian</TableHead>
              <TableHead className="text-white">Kepala Jurusan</TableHead>
              <TableHead className="w-20 text-white">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : filteredMajors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  {searchQuery
                    ? "Tidak ada hasil pencarian"
                    : "Belum ada data program keahlian"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMajors.map((major: Major) => (
                <TableRow key={major.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium font-mono text-xs text-gray-500">
                    {major.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {major.image ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                          <Image
                            src={major.image}
                            alt={major.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">
                        {major.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(major as any).headName ? (
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden border">
                          {(major as any).headPhoto ? (
                            <Image
                              src={(major as any).headPhoto}
                              alt={(major as any).headName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                {(major as any).headName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {(major as any).headName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMajor(major)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DeleteConfirmation
                        onConfirm={() => handleDeleteMajor(major)}
                        itemName={major.name}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Program Keahlian</DialogTitle>
            <DialogDescription>{selectedMajor?.name}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(85vh-8rem)] overflow-y-auto pr-2">
            <MajorForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleUpdateMajor}
              isLoading={isBusy}
              submitText="Simpan Perubahan"
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
