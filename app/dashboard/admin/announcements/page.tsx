"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Search,
  Plus,
  Filter,
  Megaphone,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { apiMethods } from "@/lib/api-client";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/lib/hooks/use-announcements";
import { AnnouncementForm } from "@/components/molecules/AnnouncementForm/AnnouncementForm";
import { toast } from "sonner";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: "academic" | "general" | "exam" | "event";
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  publishedAt?: string | Date | null;
  createdBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function AdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category: "general" as const,
    priority: "medium" as const,
    isPublished: false,
  });
  const { data, isLoading, error } = useAnnouncements({
    search: searchTerm,
    category: category === "semua" ? undefined : category,
    page: 1,
    limit: 50,
  });
  const announcements: Announcement[] = (data as any)?.data || [];
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await updateMutation.mutateAsync({
          id: editingAnnouncement._id,
          data: formData,
        });
        setIsEditOpen(false);
        setEditingAnnouncement(null);
      } else {
        await createMutation.mutateAsync(formData as any);
        setIsAddOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("Gagal menyimpan pengumuman");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    try {
      if (
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur();
      }
    } catch {}
    setIsAddOpen(false);
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      excerpt: announcement.excerpt || "",
      image: announcement.image || "",
      category: announcement.category,
      priority: announcement.priority,
      isPublished: announcement.isPublished,
    });
    setIsEditOpen(true);
  };

  const handleEditDialogChange = (open: boolean) => {
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
      setEditingAnnouncement(null);
      resetForm();
    }
    setIsEditOpen(open);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast.error("Gagal menghapus pengumuman");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image: "",
      category: "general",
      priority: "medium",
      isPublished: false,
    });
  };

  const filtered = announcements.filter((a) => {
    const s = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const c = category === "semua" || a.category === category;
    return s && c;
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Kelola Pengumuman"
          subtitle="Kelola pengumuman untuk halaman publik"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative border border-primary-600 rounded-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {category === "semua" ? "Semua" : category}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategory("semua")}>
                    Semua
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("exam")}>
                    exam
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("general")}>
                    general
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("academic")}>
                    academic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                      <Megaphone className="h-5 w-5" />
                      Tambah Pengumuman
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi pengumuman
                    </DialogDescription>
                  </DialogHeader>
                  <AnnouncementForm
                    formData={formData}
                    onInputChange={(field, value) =>
                      setFormData({ ...formData, [field]: value })
                    }
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                    submitText="Simpan"
                    onCancel={() => {
                      setIsAddOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <AdminTableCard
          title="Daftar Pengumuman"
          description="Kelola semua pengumuman"
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
              <span>Gagal memuat data pengumuman</span>
            </div>
          ) : (
            <Table className="bg-white">
              <TableHeader className="rounded-md">
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Judul</TableHead>
                  <TableHead className="text-white">Kategori</TableHead>
                  <TableHead className="text-white">Tanggal</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada pengumuman ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.category}</TableCell>
                      <TableCell>
                        {new Date(a.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            a.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {a.isPublished ? "Dipublikasikan" : "Draft"}
                        </span>
                      </TableCell>
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
                              onClick={() => handleEdit(a)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDelete(a._id)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Edit Pengumuman
              </DialogTitle>
              <DialogDescription>
                Perbarui informasi pengumuman
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm
              formData={formData}
              onInputChange={(field, value) =>
                setFormData({ ...formData, [field]: value })
              }
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
              submitText="Simpan Perubahan"
              onCancel={() => {
                setIsEditOpen(false);
                setEditingAnnouncement(null);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
