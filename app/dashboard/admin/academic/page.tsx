"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  Plus,
  GraduationCap,
  Edit,
  Loader2,
  Users,
} from "lucide-react";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { MajorForm } from "@/components/molecules/MajorForm/MajorForm";
import { ActionButtons } from "@/components/molecules/ActionButtons/ActionButtons";
import {
  useMajors,
  useCreateMajor,
  useUpdateMajor,
  useDeleteMajor,
} from "@/lib/hooks/use-majors";
import { useSearch, useModal } from "@/lib/hooks/use-utils";
import { Major } from "@/lib/types";
import { debugLog } from "@/lib/utils/debug";

export default function AdminAcademicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlumniDialogOpen, setIsAlumniDialogOpen] = useState(false);
  const [alumniStats, setAlumniStats] = useState<{
    totalAlumni: number | string;
    employedAlumni: number | string;
  }>({
    totalAlumni: 0,
    employedAlumni: 0,
  });
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

  // API hooks
  const {
    data: majorsData,
    isLoading,
    error,
  } = useMajors({
    search: searchQuery,
    page: 1,
    limit: 50,
  });

  const createMajorMutation = useCreateMajor();
  const updateMajorMutation = useUpdateMajor();
  const deleteMajorMutation = useDeleteMajor();

  const majors = (majorsData as any)?.data || [];

  // Handler functions
  const handleCreateMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        facilities: formData.facilities
          //@ts-ignore
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        careerProspects: formData.careerProspects
          //@ts-ignore
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await createMajorMutation.mutateAsync(payload as any);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleUpdateMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMajor) return;

    try {
      const majorId = selectedMajor.id || (selectedMajor as any)._id;
      const payload = {
        ...formData,
        facilities: formData.facilities
          //@ts-ignore
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        careerProspects: formData.careerProspects
          //@ts-ignore
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await updateMajorMutation.mutateAsync({
        id: majorId,
        data: payload as any,
      });
      // Reset form and close dialog
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
      setSelectedMajor(null);
      setIsEditDialogOpen(false);
    } catch (error) {}
  };

  const handleDeleteMajor = async (major: Major) => {
    try {
      const majorId = major.id || (major as any)._id;
      await deleteMajorMutation.mutateAsync(majorId as any);
    } catch (error) {}
  };

  const handleEditMajor = async (major: Major) => {
    await debugLog("Editing major clicked", major);
    setSelectedMajor(major);
    const newFormData = {
      name: major.name,
      code: major.code,
      description: major.description,
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
    };
    await debugLog("Setting form data to", newFormData);
    setFormData(newFormData);
    setIsEditDialogOpen(true);
  };

  const handleOpenAlumniDialog = (major: Major) => {
    setSelectedMajor(major);
    setAlumniStats({
      totalAlumni: Number((major as any).totalAlumni) || 0,
      employedAlumni: Number((major as any).employedAlumni) || 0,
    });
    setIsAlumniDialogOpen(true);
  };

  const handleUpdateAlumniStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMajor) return;

    try {
      const majorId = selectedMajor.id || (selectedMajor as any)._id;
      // Construct payload ensuring existing data persists
      const payload = {
        name: selectedMajor.name,
        code: selectedMajor.code,
        description: selectedMajor.description,
        image: selectedMajor.image || "",
        facilities: Array.isArray(selectedMajor.facilities)
          ? selectedMajor.facilities
          : [],
        careerProspects: Array.isArray(selectedMajor.careerProspects)
          ? selectedMajor.careerProspects
          : [],
        headName: (selectedMajor as any).headName || "",
        headPhoto: (selectedMajor as any).headPhoto || "",
        vision: (selectedMajor as any).vision || "",
        mission: (selectedMajor as any).mission || "",
        totalAlumni: Number(alumniStats.totalAlumni),
        employedAlumni: Number(alumniStats.employedAlumni),
      };

      await updateMajorMutation.mutateAsync({
        id: majorId,
        data: payload as any,
      });

      setIsAlumniDialogOpen(false);
      setSelectedMajor(null);
    } catch (error) {}
  };

  const handleEditDialogChange = async (open: boolean) => {
    await debugLog("Dialog state changing to", { open, selectedMajor });
    if (!open) {
      await debugLog("Dialog closing, resetting form");
      resetForm();
    }
    setIsEditDialogOpen(open);
  };

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
    setSelectedMajor(null);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Program Keahlian
            </h1>
            <p className="text-muted-foreground">
              Kelola daftar program keahlian
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative border border-primary-600 rounded-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari program..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary-950 text-white hover:bg-primary-900">
                  <Plus className="h-4 w-4" />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Tambah Program Keahlian
                  </DialogTitle>
                  <DialogDescription>
                    Masukkan informasi program keahlian
                  </DialogDescription>
                </DialogHeader>
                <MajorForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleCreateMajor}
                  isLoading={createMajorMutation.isPending}
                  submitText="Simpan"
                  onCancel={resetForm}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={isAlumniDialogOpen}
              onOpenChange={setIsAlumniDialogOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Statistik Alumni</DialogTitle>
                  <DialogDescription>
                    Perbarui data statistik alumni untuk jurusan{" "}
                    {selectedMajor?.name}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateAlumniStats} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Total Alumni
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={alumniStats.totalAlumni}
                        onChange={(e) =>
                          setAlumniStats((prev) => ({
                            ...prev,
                            totalAlumni:
                              e.target.value === ""
                                ? ""
                                : parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Alumni Bekerja
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={alumniStats.employedAlumni}
                        onChange={(e) =>
                          setAlumniStats((prev) => ({
                            ...prev,
                            employedAlumni:
                              e.target.value === ""
                                ? ""
                                : parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAlumniDialogOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateMajorMutation.isPending}
                      className="bg-primary-950 text-white"
                    >
                      {updateMajorMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Simpan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <AdminTableCard
          title="Daftar Program Keahlian"
          description="Kelola daftar program keahlian"
        >
          {isLoading ||
          createMajorMutation.isPending ||
          updateMajorMutation.isPending ||
          deleteMajorMutation.isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">
                {createMajorMutation.isPending && "Menyimpan data..."}
                {updateMajorMutation.isPending && "Memperbarui data..."}
                {deleteMajorMutation.isPending && "Menghapus data..."}
                {isLoading && "Memuat data..."}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <span>Gagal memuat data program keahlian</span>
            </div>
          ) : (
            <Table className="bg-white">
              <TableHeader className="rounded-md">
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Nama</TableHead>
                  <TableHead className="text-white">Kode</TableHead>
                  <TableHead className="text-white">Deskripsi</TableHead>
                  <TableHead className="text-white w-48">
                    Statistik Alumni
                  </TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {majors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data program keahlian
                    </TableCell>
                  </TableRow>
                ) : (
                  majors.map((major: Major) => (
                    <TableRow
                      key={major.id || (major as any)._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {major.name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {major.code}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {major.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-md border border-border">
                          <div className="flex flex-col text-xs">
                            <span className="font-medium text-primary">
                              Total: {(major as any).totalAlumni || 0}
                            </span>
                            <span className="text-green-600">
                              Kerja: {(major as any).employedAlumni || 0}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenAlumniDialog(major)}
                            className="h-6 w-6 hover:bg-white hover:shadow-sm"
                            title="Update Statistik"
                          >
                            <Edit className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => handleEditMajor(major)}
                          onDelete={() => handleDeleteMajor(major)}
                          itemName={major.name}
                          formData={formData}
                          onInputChange={handleInputChange}
                          onSubmit={handleUpdateMajor}
                          isLoading={updateMajorMutation.isPending}
                          onCancel={() => setIsEditDialogOpen(false)}
                          isEditDialogOpen={isEditDialogOpen}
                          onEditDialogChange={handleEditDialogChange}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </AdminTableCard>
      </div>
    </div>
  );
}
