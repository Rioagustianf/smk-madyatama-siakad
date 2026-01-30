"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Loader2, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";
import {
  useAllAlumni,
  useCreateAlumni,
  useUpdateAlumni,
  useDeleteAlumni,
  Alumni,
} from "@/lib/hooks/use-alumni";
import { useMajors } from "@/lib/hooks/use-majors";

interface Props {
  searchQuery?: string;
}

const MAX_TOTAL_ALUMNI = 3;

export function AlumniTab({ searchQuery = "" }: Props) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    workAt: "",
    majorId: "",
  });

  const { data: alumniData, isLoading: isLoadingAlumni } = useAllAlumni();
  const { data: majorsData, isLoading: isLoadingMajors } = useMajors();
  const createMutation = useCreateAlumni();
  const updateMutation = useUpdateAlumni();
  const deleteMutation = useDeleteAlumni();

  const alumniList = (alumniData as any)?.data || [];
  const majorsList = (majorsData as any)?.data || [];

  // Check if global limit reached
  const isGlobalLimitReached = useMemo(() => {
    return alumniList.length >= MAX_TOTAL_ALUMNI;
  }, [alumniList]);

  const filteredAlumni = useMemo(() => {
    if (!searchQuery) return alumniList;
    const query = searchQuery.toLowerCase();
    return alumniList.filter(
      (alumni: Alumni) =>
        alumni.name.toLowerCase().includes(query) ||
        alumni.workAt?.toLowerCase().includes(query) ||
        alumni.major?.name?.toLowerCase().includes(query),
    );
  }, [alumniList, searchQuery]);

  const isBusy = useMemo(() => {
    return (
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending
    );
  }, [
    createMutation.isPending,
    updateMutation.isPending,
    deleteMutation.isPending,
  ]);

  const resetForm = () => {
    setFormData({
      name: "",
      photo: "",
      workAt: "",
      majorId: "",
    });
  };

  const openAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.majorId) return;

    // Double check global limit before submitting
    if (alumniList.length >= MAX_TOTAL_ALUMNI) {
      return;
    }

    await createMutation.mutateAsync({
      majorId: formData.majorId,
      data: {
        name: formData.name,
        photo: formData.photo,
        workAt: formData.workAt,
      },
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditAlumni = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setFormData({
      name: alumni.name,
      photo: alumni.photo || "",
      workAt: alumni.workAt || "",
      majorId: alumni.majorId,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni) return;

    await updateMutation.mutateAsync({
      id: selectedAlumni.id,
      data: {
        name: formData.name,
        photo: formData.photo,
        workAt: formData.workAt,
      },
    });
    setIsEditDialogOpen(false);
    resetForm();
    setSelectedAlumni(null);
  };

  const handleDeleteAlumni = async (alumni: Alumni) => {
    await deleteMutation.mutateAsync(alumni.id);
  };

  return (
    <div className="space-y-4">
      {/* Header dengan tombol add */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Daftar Alumni</h3>
          <p className="text-sm text-muted-foreground">
            Kelola testimoni alumni (maks. 3 testimoni total untuk tampilan
            publik)
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary-950 text-white"
              onClick={openAdd}
              disabled={isBusy || isGlobalLimitReached}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Tambah Alumni</DialogTitle>
              <DialogDescription>
                Tambahkan testimoni alumni sukses (maks. 3 total)
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(85vh-8rem)] overflow-y-auto pr-2">
              <form onSubmit={handleAddAlumni} className="space-y-4">
                {isGlobalLimitReached && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sudah mencapai batas maksimal 3 testimoni alumni. Hapus
                      alumni yang ada terlebih dahulu untuk menambah yang baru.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Program Keahlian
                  </label>
                  <Select
                    value={formData.majorId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, majorId: value }))
                    }
                    required
                    disabled={isGlobalLimitReached}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program keahlian" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingMajors ? (
                        <SelectItem value="_loading" disabled>
                          Memuat...
                        </SelectItem>
                      ) : (
                        majorsList.map((major: any) => (
                          <SelectItem key={major.id} value={major.id}>
                            {major.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Alumni</label>
                  <Input
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    disabled={isGlobalLimitReached}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Pekerjaan / Tempat Kuliah
                  </label>
                  <Input
                    placeholder="Contoh: Software Engineer di Google"
                    value={formData.workAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workAt: e.target.value,
                      }))
                    }
                    required
                    disabled={isGlobalLimitReached}
                  />
                </div>

                <ImageUpload
                  value={formData.photo}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, photo: val }))
                  }
                  label="Foto Alumni"
                  placeholder="Upload foto alumni"
                  storagePath="alumni"
                  disabled={isGlobalLimitReached}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-950 text-white"
                    disabled={isBusy || isGlobalLimitReached}
                  >
                    {isBusy && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Tambah Alumni
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info total alumni */}
      {alumniList.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-900">
              <strong>
                {alumniList.length} dari {MAX_TOTAL_ALUMNI}
              </strong>{" "}
              testimoni alumni
              {isGlobalLimitReached && " (Batas maksimal tercapai)"}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader className="rounded-md">
            <TableRow className="bg-primary-900 hover:bg-primary-900">
              <TableHead className="text-white w-[60px]">No</TableHead>
              <TableHead className="text-white">Foto</TableHead>
              <TableHead className="text-white">Nama Alumni</TableHead>
              <TableHead className="text-white">Program Keahlian</TableHead>
              <TableHead className="text-white">Pekerjaan/Studi</TableHead>
              <TableHead className="w-20 text-white">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingAlumni ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : filteredAlumni.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  {searchQuery
                    ? "Tidak ada hasil pencarian"
                    : "Belum ada data alumni"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAlumni.map((alumni: Alumni, index: number) => (
                <TableRow key={alumni.id} className="hover:bg-muted/50">
                  <TableCell className="text-center font-medium text-gray-500">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {alumni.photo ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                        <Image
                          src={alumni.photo}
                          alt={alumni.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold border-2 border-gray-200">
                        {alumni.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {alumni.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {alumni.major?.name || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-primary-600 font-medium">
                    {alumni.workAt || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAlumni(alumni)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DeleteConfirmation
                        onConfirm={() => handleDeleteAlumni(alumni)}
                        itemName={alumni.name}
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
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Alumni</DialogTitle>
            <DialogDescription>{selectedAlumni?.name}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(85vh-8rem)] overflow-y-auto pr-2">
            <form onSubmit={handleUpdateAlumni} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Alumni</label>
                <Input
                  placeholder="Nama alumni"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Pekerjaan / Tempat Kuliah
                </label>
                <Input
                  placeholder="Pekerjaan/Kuliah"
                  value={formData.workAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workAt: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <ImageUpload
                value={formData.photo}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, photo: val }))
                }
                label="Foto Alumni"
                placeholder="Upload foto alumni"
                storagePath="alumni"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-950 text-white"
                  disabled={isBusy}
                >
                  {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
