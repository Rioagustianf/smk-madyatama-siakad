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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Trophy,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";

type Activity = {
  id: number;
  title: string;
  category: "ekstrakurikuler" | "prestasi";
};
const mockActivities: Activity[] = [
  { id: 1, title: "Juara 1 Lomba Web", category: "prestasi" },
  { id: 2, title: "Klub Robotik", category: "ekstrakurikuler" },
];

export default function AdminActivitiesPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const filtered = mockActivities.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Prestasi & Ekstrakurikuler
            </h1>
            <p className="text-muted-foreground">
              Kelola kegiatan dan prestasi
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
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
                    <Trophy className="h-5 w-5" />
                    Tambah Kegiatan
                  </DialogTitle>
                  <DialogDescription>
                    Masukkan informasi kegiatan
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <Input placeholder="Judul" required />
                  <Input placeholder="Kategori (ekstrakurikuler/prestasi)" />
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
        </div>

        <AdminTableCard
          title="Daftar Kegiatan"
          description="Kelola daftar kegiatan"
        >
          <div className="rounded-md border">
            <Table className="bg-white">
              <TableHeader className="rounded-md">
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Judul</TableHead>
                  <TableHead className="text-white">Kategori</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>{a.category}</TableCell>
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
          </div>
        </AdminTableCard>
      </div>
    </div>
  );
}
