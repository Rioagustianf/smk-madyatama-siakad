"use client";

import React, { useState } from "react";
import { TeacherGradeForm } from "@/components/molecules/TeacherGradeForm/TeacherGradeForm";
import {
  GradesTable,
  type GradeRow,
} from "@/components/molecules/GradesTable/GradesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { Search, Plus, NotebookPen } from "lucide-react";

const mockGrades: GradeRow[] = [
  {
    subject: "Matematika",
    assignments: 85,
    midterm: 80,
    final: 90,
    total: 85,
    grade: "A",
  },
  {
    subject: "Bahasa Indonesia",
    assignments: 78,
    midterm: 82,
    final: 80,
    total: 80,
    grade: "B",
  },
];

export default function TeacherInputGradesPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const filtered = mockGrades.filter((g) =>
    g.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Input Nilai Siswa"
          subtitle="Kelola dan input nilai per mata pelajaran"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari mata pelajaran..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Input Nilai
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <NotebookPen className="h-5 w-5" />
                      Form Input Nilai
                    </DialogTitle>
                    <DialogDescription>Masukkan nilai siswa</DialogDescription>
                  </DialogHeader>
                  <TeacherGradeForm />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Tutup
                    </Button>
                    <Button type="submit">Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <AdminTableCard
          title="Rekap Nilai Terakhir"
          description="Daftar nilai terbaru (mock)"
        >
          <GradesTable rows={filtered} />
        </AdminTableCard>
      </div>
    </div>
  );
}
