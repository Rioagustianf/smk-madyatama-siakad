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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Filter, Megaphone, Edit, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
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

const categoryLabels = {
  academic: "Akademik",
  general: "Umum",
  exam: "Ujian",
  event: "Acara",
};

const priorityLabels = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export default function AdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] =
    useState<Announcement | null>(null);

  const { data, isLoading } = useAnnouncements({
    search: searchTerm,
    category: category === "semua" ? undefined : category,
    page: 1,
    limit: 50,
  });
  const announcements: Announcement[] = (data as any)?.data || [];
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const handleAdd = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsAddOpen(false);
      toast.success("Pengumuman berhasil ditambahkan");
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Gagal menambahkan pengumuman");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setEditingAnnouncement(announcement);
    setIsEditOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    if (!editingAnnouncement) return;

    try {
      await updateMutation.mutateAsync({
        id: editingAnnouncement._id,
        data: formData,
      });
      setIsEditOpen(false);
      setEditingAnnouncement(null);
      toast.success("Pengumuman berhasil diperbarui");
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("Gagal memperbarui pengumuman");
    }
  };

  const handleDelete = (announcement: Announcement) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setDeletingAnnouncement(announcement);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingAnnouncement) return;

    try {
      await deleteMutation.mutateAsync(deletingAnnouncement._id);
      setIsDeleteOpen(false);
      setDeletingAnnouncement(null);
      toast.success("Pengumuman berhasil dihapus");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Gagal menghapus pengumuman");
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                  <Button
                    variant="outline"
                    className="gap-2 border-primary-600"
                  >
                    <Filter className="h-4 w-4" />
                    {category === "semua"
                      ? "Semua"
                      : categoryLabels[category as keyof typeof categoryLabels]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategory("semua")}>
                    Semua
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("academic")}>
                    Akademik
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("general")}>
                    Umum
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("exam")}>
                    Ujian
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCategory("event")}>
                    Acara
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="gap-2 bg-primary-950 text-white"
              >
                <Plus className="h-4 w-4" />
                Tambah Pengumuman
              </Button>
            </div>
          }
        />

        <AdminTableCard
          title="Daftar Pengumuman"
          description="Kelola semua pengumuman sekolah"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Belum ada pengumuman
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => (
                  <TableRow key={announcement._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {announcement.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md ${
                          announcement.category === "academic"
                            ? "bg-blue-100 text-blue-700"
                            : announcement.category === "exam"
                            ? "bg-purple-100 text-purple-700"
                            : announcement.category === "event"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {categoryLabels[announcement.category]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          announcement.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : announcement.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {priorityLabels[announcement.priority]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          announcement.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {announcement.isPublished ? "Dipublikasi" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(
                        announcement.publishedAt || announcement.createdAt
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(announcement);
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          title="Edit pengumuman"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(announcement);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Hapus pengumuman"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AdminTableCard>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                Tambah Pengumuman Baru
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Buat pengumuman baru yang akan ditampilkan di halaman publik
              </p>
            </DialogHeader>
            <div className="py-4">
              <AnnouncementForm
                onSubmit={handleAdd}
                isLoading={createMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                Edit Pengumuman
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Perbarui informasi pengumuman yang sudah ada
              </p>
            </DialogHeader>
            <div className="py-4">
              {editingAnnouncement && (
                <AnnouncementForm
                  initialData={{
                    title: editingAnnouncement.title,
                    excerpt: editingAnnouncement.excerpt || "",
                    content: editingAnnouncement.content,
                    category: editingAnnouncement.category,
                    priority: editingAnnouncement.priority,
                    image: editingAnnouncement.image || "",
                    publishedAt: editingAnnouncement.publishedAt
                      ? new Date(editingAnnouncement.publishedAt).toISOString()
                      : new Date().toISOString(),
                    isPublished: editingAnnouncement.isPublished,
                  }}
                  onSubmit={handleUpdate}
                  isLoading={updateMutation.isPending}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Pengumuman</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus pengumuman "
                {deletingAnnouncement?.title}"? Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
