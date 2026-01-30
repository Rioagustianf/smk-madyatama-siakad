import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2, Edit2, X } from "lucide-react";
import {
  useAlumniByMajor,
  useCreateAlumni,
  useUpdateAlumni,
  useDeleteAlumni,
  Alumni,
} from "@/lib/hooks/use-alumni";
import Image from "next/image";

interface AlumniManagerProps {
  majorId: string | null;
  majorName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AlumniManager({
  majorId,
  majorName,
  isOpen,
  onClose,
}: AlumniManagerProps) {
  const { data: alumniData, isLoading } = useAlumniByMajor(majorId);
  const createMutation = useCreateAlumni();
  const updateMutation = useUpdateAlumni();
  const deleteMutation = useDeleteAlumni();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    workAt: "",
  });

  const alumniList = (alumniData as any)?.data || [];

  const resetForm = () => {
    setFormData({ name: "", photo: "", workAt: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (alumni: Alumni) => {
    setFormData({
      name: alumni.name,
      photo: alumni.photo || "",
      workAt: alumni.workAt || "",
    });
    setEditingId(alumni.id);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!majorId) return;

    try {
      if (isEditing && editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync({
          majorId,
          data: formData,
        });
      }
      resetForm();
    } catch (error) {
      // handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data alumni ini?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Kelola Alumni - {majorName}</DialogTitle>
          <DialogDescription>
            Tambahkan testimoni dan profil alumni sukses
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Form Section */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-3 text-sm">
              {isEditing ? "Edit Alumni" : "Tambah Alumni Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Nama Alumni"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-white"
                    required
                  />
                  <Input
                    placeholder="Pekerjaan / Kuliah (cth: CEO di Google)"
                    value={formData.workAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workAt: e.target.value,
                      }))
                    }
                    className="bg-white"
                    required
                  />
                </div>
                <div>
                  <ImageUpload
                    value={formData.photo}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, photo: val }))
                    }
                    label="Foto"
                    placeholder="Upload Foto"
                    storagePath="alumni"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                    size="sm"
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-950 text-white"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isEditing ? (
                    <Edit2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? "Simpan Perubahan" : "Tambah Alumni"}
                </Button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Daftar Alumni</h3>
            {isLoading ? (
              <div className="text-center py-4">Memuat data...</div>
            ) : alumniList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                Belum ada data alumni
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alumniList.map((alumni: Alumni) => (
                      <TableRow key={alumni.id}>
                        <TableCell>
                          {alumni.photo ? (
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                              <Image
                                src={alumni.photo}
                                alt={alumni.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              No Img
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {alumni.name}
                        </TableCell>
                        <TableCell>{alumni.workAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(alumni)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(alumni.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
