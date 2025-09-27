"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  ImageIcon,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Filter,
  Upload,
} from "lucide-react";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";

// <CHANGE> Added mock data for better demonstration
const mockGalleryData = [
  {
    id: 1,
    title: "Dokumentasi Upacara Bendera",
    category: "kegiatan",
    imageUrl: "/placeholder.svg?key=vefmd",
    description: "Upacara bendera rutin setiap hari Senin",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Kegiatan Ekstrakurikuler",
    category: "kegiatan",
    imageUrl: "/placeholder.svg?key=zgrjs",
    description: "Berbagai kegiatan ekstrakurikuler siswa",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "Fasilitas Perpustakaan",
    category: "umum",
    imageUrl: "/placeholder.svg?key=w8gq4",
    description: "Fasilitas perpustakaan yang nyaman untuk belajar",
    createdAt: "2024-01-08",
  },
];

export default function AdminGaleriPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "kegiatan",
    description: "",
  });

  // <CHANGE> Added filtering logic
  const filteredData = mockGalleryData.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsAddDialogOpen(false);
    setFormData({
      title: "",
      imageUrl: "",
      category: "kegiatan",
      description: "",
    });
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
                <Button variant="outline" className="gap-2">
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
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Tambah Foto Baru
                  </DialogTitle>
                  <DialogDescription>
                    Tambahkan foto baru ke galeri sekolah
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Foto</Label>
                    <Input
                      id="title"
                      placeholder="Masukkan judul foto"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL Gambar</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        required
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {formData.category === "kegiatan"
                            ? "Kegiatan"
                            : "Umum"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem
                          onClick={() =>
                            setFormData({ ...formData, category: "kegiatan" })
                          }
                        >
                          Kegiatan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setFormData({ ...formData, category: "umum" })
                          }
                        >
                          Umum
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Deskripsi singkat tentang foto"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit">Simpan Foto</Button>
                  </DialogFooter>
                </form>
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
              <div className="text-2xl font-bold">{mockGalleryData.length}</div>
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
                  mockGalleryData.filter((item) => item.category === "kegiatan")
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
                {
                  mockGalleryData.filter((item) => item.category === "umum")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Fasilitas & umum</p>
            </CardContent>
          </Card>
        </div>

        <AdminTableCard
          title="Daftar Galeri"
          description="Kelola semua foto dalam galeri sekolah"
        >
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm || selectedCategory !== "semua"
                      ? "Tidak ada foto yang sesuai dengan filter"
                      : "Belum ada foto dalam galeri"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.category === "kegiatan" ? "default" : "secondary"
                        }
                      >
                        {item.category === "kegiatan" ? "Kegiatan" : "Umum"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {item.description || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
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
        </AdminTableCard>
      </div>
    </div>
  );
}
