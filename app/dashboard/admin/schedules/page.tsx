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
  CalendarClock,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";

type Schedule = {
  id: number;
  day: string;
  time: string;
  subject: string;
  className: string;
  teacher: string;
};
const mockSchedules: Schedule[] = [
  {
    id: 1,
    day: "Senin",
    time: "07:00 - 08:30",
    subject: "Matematika",
    className: "X RPL 1",
    teacher: "Ibu Siti",
  },
];

export default function AdminSchedulesPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const filtered = mockSchedules.filter(
    (s) =>
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.className.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Jadwal Pelajaran"
          subtitle="Kelola jadwal pelajaran untuk publik"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari (mapel/kelas)..."
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
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5" />
                      Tambah Jadwal
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi jadwal pelajaran
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input placeholder="Hari" />
                      <Input placeholder="Waktu (07:00 - 08:30)" />
                      <Input placeholder="Ruang" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input placeholder="Mata Pelajaran" />
                      <Input placeholder="Kelas" />
                      <Input placeholder="Guru" />
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
          title="Daftar Jadwal Pelajaran"
          description="Kelola jadwal pelajaran"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-900 hover:bg-primary-900">
                <TableHead className="text-white">Hari</TableHead>
                <TableHead className="text-white">Waktu</TableHead>
                <TableHead className="text-white">Mapel</TableHead>
                <TableHead className="text-white">Kelas</TableHead>
                <TableHead className="text-white">Guru</TableHead>
                <TableHead className="w-20 text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/50">
                  <TableCell>{s.day}</TableCell>
                  <TableCell>{s.time}</TableCell>
                  <TableCell className="font-medium">{s.subject}</TableCell>
                  <TableCell>{s.className}</TableCell>
                  <TableCell>{s.teacher}</TableCell>
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
