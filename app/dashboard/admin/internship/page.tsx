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
import { Card } from "@/components/ui/card";
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
  Briefcase,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";

type Internship = {
  id: number;
  program: string;
  period: string;
  notes: string;
};
const mockInternships: Internship[] = [
  {
    id: 1,
    program: "Prakerin RPL - PT Teknologi",
    period: "Mei - Juli 2025",
    notes: "Batch 1",
  },
];

export default function AdminInternshipPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const filtered = mockInternships.filter((i) =>
    i.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="DUDI & Prakerin"
          subtitle="Kelola informasi magang untuk halaman publik"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari program..."
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
                      <Briefcase className="h-5 w-5" />
                      Tambah Program Prakerin
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan informasi program prakerin
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <Input placeholder="Nama Program" required />
                    <Input placeholder="Periode (mis. Mei - Juli 2025)" />
                    <Input placeholder="Keterangan" />
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
          title="Daftar Program Prakerin"
          description="Kelola informasi DUDI & Prakerin"
        >
          <Table className="bg-white">
            <TableHeader>
              <TableRow className="bg-primary-900 hover:bg-primary-900">
                <TableHead className="text-white">Program</TableHead>
                <TableHead className="text-white">Periode</TableHead>
                <TableHead className="text-white">Keterangan</TableHead>
                <TableHead className="w-20 text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{i.program}</TableCell>
                  <TableCell>{i.period}</TableCell>
                  <TableCell>{i.notes}</TableCell>
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
