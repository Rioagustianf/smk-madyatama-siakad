"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, ImageIcon, Filter, Loader2 } from "lucide-react";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { ActionButtons } from "@/components/molecules/ActionButtons/ActionButtons";
import {
  GalleryForm,
  GalleryFormData,
} from "@/components/molecules/GalleryForm/GalleryForm";
import {
  useGalleryList,
  useCreateGallery,
  useUpdateGallery,
  useDeleteGallery,
} from "@/lib/hooks/use-gallery";
import Image from "next/image";

export default function AdminGaleriPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: "",
    description: "",
    type: "image",
    url: "",
    thumbnail: "",
    category: "kegiatan",
    tags: [],
    isPublished: true,
  });

  // API hooks
  const {
    data: galleryResp,
    isLoading,
    error,
  } = useGalleryList({
    search: searchTerm,
    category: selectedCategory === "semua" ? undefined : selectedCategory,
    limit: 100,
    page: 1,
  } as any);
  const createMutation = useCreateGallery();
  const updateMutation = useUpdateGallery();
  const deleteMutation = useDeleteGallery();

  const gallery = useMemo(
    () => (galleryResp as any)?.data || [],
    [galleryResp]
  );

  const handleInputChange = (field: keyof GalleryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "image",
      url: "",
      thumbnail: "",
      category: "kegiatan",
      tags: [],
      isPublished: true,
    });
    setSelectedItem(null);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData as any);
      resetForm();
    } catch {}
  };

  const openEdit = async (item: any) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "image",
      url: item.url || item.imageUrl || "",
      thumbnail: item.thumbnail || "",
      category: item.category || "kegiatan",
      tags: Array.isArray(item.tags) ? item.tags : [],
      isPublished:
        typeof item.isPublished === "boolean" ? item.isPublished : true,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem?._id && !selectedItem?.id) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedItem._id || selectedItem.id,
        data: formData as any,
      });
      resetForm();
    } catch {}
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteMutation.mutateAsync(item._id || item.id);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* <CHANGE> Improved header with better typography and spacing */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Kelola Galeri
            </h1>
            <p className="text-muted-foreground">
              Kelola foto dan dokumentasi kegiatan sekolah
            </p>
          </div>

          {/* <CHANGE> Enhanced search and filter controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border border-primary-600"
                >
                  <Filter className="h-4 w-4" />
                  {selectedCategory === "semua"
                    ? "Semua Kategori"
                    : selectedCategory === "kegiatan"
                    ? "Kegiatan"
                    : "Umum"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory("semua")}>
                  Semua Kategori
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("kegiatan")}
                >
                  Kegiatan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory("umum")}>
                  Umum
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary-950 text-white hover:bg-primary-900">
                  <Plus className="h-4 w-4" />
                  Tambah Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Tambah Foto Baru
                  </DialogTitle>
                  <DialogDescription>
                    Tambahkan foto baru ke galeri sekolah
                  </DialogDescription>
                </DialogHeader>
                <GalleryForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleCreate}
                  isLoading={createMutation.isPending}
                  submitText="Simpan"
                  onCancel={resetForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Foto</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gallery.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Foto Kegiatan
              </CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  gallery.filter((item: any) => item.category === "kegiatan")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Dokumentasi kegiatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Foto Umum</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gallery.filter((item: any) => item.category === "umum").length}
              </div>
              <p className="text-xs text-muted-foreground">Fasilitas & umum</p>
            </CardContent>
          </Card>
        </div>

        <AdminTableCard
          title="Daftar Galeri"
          description="Kelola semua foto dalam galeri sekolah"
        >
          {isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              Gagal memuat data galeri
            </div>
          ) : (
            <Table className="bg-white">
              <TableHeader className="rounded-md">
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="w-20 text-white">Preview</TableHead>
                  <TableHead className="text-white">Judul</TableHead>
                  <TableHead className="text-white">Kategori</TableHead>
                  <TableHead className="text-white">Deskripsi</TableHead>
                  <TableHead className="text-white">Tanggal</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gallery.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada foto dalam galeri
                    </TableCell>
                  </TableRow>
                ) : (
                  gallery.map((item: any) => (
                    <TableRow
                      key={item._id || item.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                          <Image
                            src={
                              item.url || item.imageUrl || "/placeholder.svg"
                            }
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.category === "kegiatan"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.category === "kegiatan" ? "Kegiatan" : "Umum"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {item.description || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => openEdit(item)}
                          onDelete={() => handleDelete(item)}
                          itemName={item.title}
                          formData={formData}
                          onInputChange={handleInputChange as any}
                          onSubmit={handleUpdate}
                          isLoading={updateMutation.isPending}
                          onCancel={() => setIsEditDialogOpen(false)}
                          isEditDialogOpen={isEditDialogOpen}
                          onEditDialogChange={(open) => {
                            if (!open) resetForm();
                            setIsEditDialogOpen(open);
                          }}
                          formType="gallery"
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
