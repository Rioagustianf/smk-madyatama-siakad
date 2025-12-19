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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarRange,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { ActionButtons } from "@/components/molecules/ActionButtons/ActionButtons";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  useExams,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
} from "@/lib/hooks/use-exams";
import { useSubjects } from "@/lib/hooks/use-subjects";
import { useClasses } from "@/lib/hooks/use-classes";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/contexts/toast-context";
import { useAuthQuery } from "@/lib/hooks/use-auth";

const EXAM_TYPES = [
  { value: "midterm", label: "UTS (Ujian Tengah Semester)" },
  { value: "final", label: "UAS (Ujian Akhir Semester)" },
  { value: "assignment", label: "Tugas / Kuis" },
];

export default function TeacherExamsPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  const { addToast } = useToast();

  const { data: user } = useAuthQuery();

  const { data: examsData, isLoading } = useExams({
    search,
    classId: filterClass !== "all" ? filterClass : undefined,
    subjectId: filterSubject !== "all" ? filterSubject : undefined,
  });

  const teacherId = user?.role === "teacher" ? user.id : undefined;

  const { data: subjectsData } = useSubjects({
    limit: 100,
    teacherId,
  });

  const { data: classesData } = useClasses({ limit: 100 });

  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    subjectId: "",
    classId: "",
    room: "",
    type: "midterm",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      subjectId: "",
      classId: "",
      room: "",
      type: "midterm",
      description: "",
    });
    setSelectedExam(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.classId || !formData.date) {
      addToast({
        type: "error",
        title: "Validasi Gagal",
        description: "Mohon lengkapi data wajib",
      });
      return;
    }

    try {
      if (selectedExam) {
        await updateMutation.mutateAsync({
          id: selectedExam.id,
          data: formData,
        });
        setIsEditOpen(false);
      } else {
        await createMutation.mutateAsync(formData);
        setIsAddOpen(false);
      }
      resetForm();
    } catch (error) {}
  };

  const handleEdit = (exam: any) => {
    setSelectedExam(exam);
    setFormData({
      date: format(new Date(exam.date), "yyyy-MM-dd"),
      startTime: exam.startTime,
      endTime: exam.endTime,
      subjectId: exam.subjectId,
      classId: exam.classId,
      room: exam.room,
      type: exam.type,
      description: exam.description || "",
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Jadwal ujian berhasil dihapus",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Gagal",
        description: "Gagal menghapus jadwal ujian",
      });
    }
  };

  const exams = examsData?.data || [];
  const subjects = subjectsData?.data || [];
  const allClasses = classesData?.data || [];

  const teacherClasses = React.useMemo(() => {
    if (!user?.classes || !Array.isArray(user.classes)) return [];

    return allClasses.filter(
      (c: any) => user.classes.includes(c.name) || user.classes.includes(c.id)
    );
  }, [user?.classes, allClasses]);

  const classes = teacherClasses;
  const myExams = exams.filter((exam: any) => {
    const mySubjectIds = subjects.map((s: any) => s.id);
    return mySubjectIds.includes(exam.subjectId);
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Jadwal Ujian
            </h1>
            <p className="text-muted-foreground">Kelola jadwal ujian siswa</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari mapel atau kelas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Dialog
              open={isAddOpen}
              onOpenChange={(open) => {
                setIsAddOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary-950 text-white">
                  <Plus className="h-4 w-4" />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5" />
                    Tambah Jadwal Ujian
                  </DialogTitle>
                  <DialogDescription>
                    Masukkan informasi jadwal ujian baru
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tanggal</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis Ujian</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(val) =>
                          setFormData({ ...formData, type: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXAM_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Waktu Mulai</Label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Waktu Selesai</Label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mata Pelajaran</Label>
                      <Select
                        value={formData.subjectId}
                        onValueChange={(val) =>
                          setFormData({ ...formData, subjectId: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih mapel" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((s: any) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kelas</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(val) =>
                          setFormData({ ...formData, classId: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ruangan</Label>
                    <Input
                      placeholder="Contoh: Lab Komputer 1"
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                      disabled={isSubmitting}
                      className="border border-primary-600"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-950 text-white"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Simpan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <AdminTableCard
          title="Daftar Ujian"
          description="Kelola jadwal ujian siswa"
        >
          <div className="p-4 flex gap-4 border-b">
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Mapel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mapel</SelectItem>
                {subjects.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table className="bg-white">
            <TableHeader>
              <TableRow className="bg-primary-900 hover:bg-primary-900">
                <TableHead className="text-white">Tanggal & Waktu</TableHead>
                <TableHead className="text-white">Mapel</TableHead>
                <TableHead className="text-white">Kelas</TableHead>
                <TableHead className="text-white">Ruang</TableHead>
                <TableHead className="text-white">Tipe</TableHead>
                <TableHead className="w-20 text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : myExams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada jadwal ujian ditemukan untuk mata pelajaran Anda
                  </TableCell>
                </TableRow>
              ) : (
                myExams.map((exam: any) => (
                  <TableRow key={exam.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">
                        {format(new Date(exam.date), "EEEE, dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {exam.startTime} - {exam.endTime}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {exam.subject?.name}
                      <span className="block text-xs text-muted-foreground">
                        {exam.subject?.code}
                      </span>
                    </TableCell>
                    <TableCell>{exam.class?.name}</TableCell>
                    <TableCell>{exam.room}</TableCell>
                    <TableCell>
                      <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        {EXAM_TYPES.find((t) => t.value === exam.type)?.label ||
                          exam.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(exam)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmation
                          itemName={`${exam.subject?.name} - ${exam.class?.name}`}
                          onConfirm={() => handleDelete(exam.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AdminTableCard>
      </div>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Jadwal Ujian
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Jenis Ujian</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Waktu Mulai</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Waktu Selesai</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, subjectId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mapel" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, classId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ruangan</Label>
              <Input
                placeholder="Contoh: Lab Komputer 1"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
