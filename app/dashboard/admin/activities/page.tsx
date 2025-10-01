"use client";

import React, { useMemo, useState } from "react";
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
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import { AchievementForm } from "@/components/molecules/AchievementForm/AchievementForm";
import { ExtracurricularForm } from "@/components/molecules/ExtracurricularForm/ExtracurricularForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
  useExtracurriculars,
  useCreateExtracurricular,
  useUpdateExtracurricular,
  useDeleteExtracurricular,
} from "@/lib/hooks/use-activities";

export default function AdminActivitiesPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "achievements" | "extracurriculars"
  >("achievements");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Achievement form state
  const [achTitle, setAchTitle] = useState("");
  const [achCategory, setAchCategory] = useState("");
  const [achYear, setAchYear] = useState("");
  const [achDesc, setAchDesc] = useState("");

  // Extracurricular form state
  const [exName, setExName] = useState("");
  const [exDesc, setExDesc] = useState("");

  // Queries
  const { data: achievementsData, isLoading: isAchLoading } = useAchievements(
    search ? { search } : undefined
  );
  const achievements = achievementsData?.data || [];

  const { data: extracurricularsData, isLoading: isExLoading } =
    useExtracurriculars(search ? { search } : undefined);
  const extracurriculars = extracurricularsData?.data || [];

  // Mutations
  const createAchievement = useCreateAchievement();
  const updateAchievement = useUpdateAchievement();
  const deleteAchievement = useDeleteAchievement();

  const createExtracurricular = useCreateExtracurricular();
  const updateExtracurricular = useUpdateExtracurricular();
  const deleteExtracurricular = useDeleteExtracurricular();

  const isBusy = useMemo(() => {
    return (
      createAchievement.isPending ||
      updateAchievement.isPending ||
      deleteAchievement.isPending ||
      createExtracurricular.isPending ||
      updateExtracurricular.isPending ||
      deleteExtracurricular.isPending
    );
  }, [
    createAchievement.isPending,
    updateAchievement.isPending,
    deleteAchievement.isPending,
    createExtracurricular.isPending,
    updateExtracurricular.isPending,
    deleteExtracurricular.isPending,
  ]);

  const resetForms = () => {
    setAchTitle("");
    setAchCategory("");
    setAchYear("");
    setAchDesc("");
    setExName("");
    setExDesc("");
    setSelectedId(null);
  };

  const openAdd = () => {
    resetForms();
    setIsEditOpen(false);
    setIsAddOpen(true);
  };

  const openEditAchievement = (item: any) => {
    setSelectedId(item._id);
    setAchTitle(item.title || "");
    setAchCategory(item.category || "");
    setAchYear(item.year || "");
    setAchDesc(item.description || "");
    setIsAddOpen(false);
    setIsEditOpen(true);
    setActiveTab("achievements");
  };

  const openEditExtracurricular = (item: any) => {
    setSelectedId(item._id);
    setExName(item.name || "");
    setExDesc(item.description || "");
    setIsAddOpen(false);
    setIsEditOpen(true);
    setActiveTab("extracurriculars");
  };

  const onSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "achievements") {
      await createAchievement.mutateAsync({
        title: achTitle,
        category: achCategory,
        year: achYear,
        description: achDesc,
      });
    } else {
      await createExtracurricular.mutateAsync({
        name: exName,
        description: exDesc,
      });
    }
    setIsAddOpen(false);
    resetForms();
  };

  const onSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    if (activeTab === "achievements") {
      await updateAchievement.mutateAsync({
        id: selectedId,
        data: {
          title: achTitle,
          category: achCategory,
          year: achYear,
          description: achDesc,
        },
      });
    } else {
      await updateExtracurricular.mutateAsync({
        id: selectedId,
        data: {
          name: exName,
          description: exDesc,
        },
      });
    }
    setIsEditOpen(false);
    resetForms();
  };

  const onDelete = async (
    item: any,
    category: "achievements" | "extracurriculars"
  ) => {
    if (category === "achievements") {
      await deleteAchievement.mutateAsync(item._id);
    } else {
      await deleteExtracurricular.mutateAsync(item._id);
    }
  };

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
                <Button className="gap-2" onClick={openAdd} disabled={isBusy}>
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
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as any)}
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="achievements">Prestasi</TabsTrigger>
                    <TabsTrigger value="extracurriculars">
                      Ekstrakurikuler
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {activeTab === "achievements" ? (
                  <AchievementForm
                    formData={{
                      title: achTitle,
                      category: achCategory,
                      year: achYear,
                      description: achDesc,
                    }}
                    onInputChange={(field, value) => {
                      if (field === "title") setAchTitle(value);
                      if (field === "category") setAchCategory(value);
                      if (field === "year") setAchYear(value);
                      if (field === "description") setAchDesc(value);
                    }}
                    onSubmit={onSubmitAdd}
                    isLoading={isBusy}
                    submitText="Simpan"
                    onCancel={() => setIsAddOpen(false)}
                  />
                ) : (
                  <ExtracurricularForm
                    formData={{ name: exName, description: exDesc }}
                    onInputChange={(field, value) => {
                      if (field === "name") setExName(value);
                      if (field === "description") setExDesc(value);
                    }}
                    onSubmit={onSubmitAdd}
                    isLoading={isBusy}
                    submitText="Simpan"
                    onCancel={() => setIsAddOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Kegiatan
                  </DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="achievements">Prestasi</TabsTrigger>
                    <TabsTrigger value="extracurriculars">
                      Ekstrakurikuler
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {activeTab === "achievements" ? (
                  <AchievementForm
                    formData={{
                      title: achTitle,
                      category: achCategory,
                      year: achYear,
                      description: achDesc,
                    }}
                    onInputChange={(field, value) => {
                      if (field === "title") setAchTitle(value);
                      if (field === "category") setAchCategory(value);
                      if (field === "year") setAchYear(value);
                      if (field === "description") setAchDesc(value);
                    }}
                    onSubmit={onSubmitEdit}
                    isLoading={isBusy}
                    submitText="Simpan Perubahan"
                    onCancel={() => setIsEditOpen(false)}
                  />
                ) : (
                  <ExtracurricularForm
                    formData={{ name: exName, description: exDesc }}
                    onInputChange={(field, value) => {
                      if (field === "name") setExName(value);
                      if (field === "description") setExDesc(value);
                    }}
                    onSubmit={onSubmitEdit}
                    isLoading={isBusy}
                    submitText="Simpan Perubahan"
                    onCancel={() => setIsEditOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="achievements">Prestasi</TabsTrigger>
            <TabsTrigger value="extracurriculars">Ekstrakurikuler</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <AdminTableCard
              title="Daftar Prestasi"
              description="Kelola data prestasi"
        >
          <div className="rounded-md border">
            <Table className="bg-white">
              <TableHeader className="rounded-md">
                <TableRow className="bg-primary-900 hover:bg-primary-900">
                  <TableHead className="text-white">Judul</TableHead>
                  <TableHead className="text-white">Kategori</TableHead>
                      <TableHead className="text-white">Tahun</TableHead>
                  <TableHead className="w-20 text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {isAchLoading ? (
                      <TableRow>
                        <TableCell colSpan={4}>Memuat...</TableCell>
                      </TableRow>
                    ) : achievements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          Belum ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      achievements.map((a: any) => (
                        <TableRow key={a._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {a.title}
                          </TableCell>
                          <TableCell>{a.category || "-"}</TableCell>
                          <TableCell>{a.year || "-"}</TableCell>
                    <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (
                                    document.activeElement instanceof
                                    HTMLElement
                                  ) {
                                    document.activeElement.blur();
                                  }
                                  openEditAchievement(a);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <DeleteConfirmation
                                onConfirm={() => onDelete(a, "achievements")}
                                itemName={a.title}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
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
              </div>
            </AdminTableCard>
          </TabsContent>

          <TabsContent value="extracurriculars">
            <AdminTableCard
              title="Daftar Ekstrakurikuler"
              description="Kelola data ekstrakurikuler"
            >
              <div className="rounded-md border">
                <Table className="bg-white">
                  <TableHeader className="rounded-md">
                    <TableRow className="bg-primary-900 hover:bg-primary-900">
                      <TableHead className="text-white">Nama</TableHead>
                      <TableHead className="text-white">Deskripsi</TableHead>
                      <TableHead className="w-20 text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isExLoading ? (
                      <TableRow>
                        <TableCell colSpan={3}>Memuat...</TableCell>
                      </TableRow>
                    ) : extracurriculars.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          Belum ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      extracurriculars.map((x: any) => (
                        <TableRow key={x._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {x.name}
                          </TableCell>
                          <TableCell className="max-w-[500px] truncate">
                            {x.description || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (
                                    document.activeElement instanceof
                                    HTMLElement
                                  ) {
                                    document.activeElement.blur();
                                  }
                                  openEditExtracurricular(x);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <DeleteConfirmation
                                onConfirm={() =>
                                  onDelete(x, "extracurriculars")
                                }
                                itemName={x.name}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
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
          </div>
        </AdminTableCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
