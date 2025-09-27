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
import {} from "@/components/ui/card";
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
} from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";

const mockAnnouncements = [
  {
    id: 1,
    title: "Jadwal UTS Ganjil",
    category: "exam",
    date: "2025-01-15",
    status: "Publish",
  },
  {
    id: 2,
    title: "Libur Semester",
    category: "general",
    date: "2025-01-20",
    status: "Draft",
  },
];

export default function AdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const filtered = mockAnnouncements.filter((a) => {
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
              <div className="relative">
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
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      Tambah Pengumuman
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi pengumuman
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <Input placeholder="Judul" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Kategori (exam/general/academic)" />
                      <Input placeholder="Tanggal (YYYY-MM-DD)" />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button type="submit">Simpan</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <AdminTableCard
          title="Daftar Pengumuman"
          description="Kelola semua pengumuman"
        >
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
              {filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{a.category}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
              ))}
            </TableBody>
          </Table>
        </AdminTableCard>
      </div>
    </div>
  );
}
