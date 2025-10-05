"use client";

import React, { useEffect, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Calendar, Edit, Trash2, Building2 } from "lucide-react";
import { AdminHeader } from "@/components/molecules/AdminPage/AdminHeader";
import { AdminTableCard } from "@/components/molecules/AdminTable/AdminTableCard";
import InternshipForm, {
  InternshipFormData,
} from "@/components/molecules/InternshipForm/InternshipForm";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useInternshipSchedules,
  useCreateInternshipSchedule,
  useUpdateInternshipSchedule,
  useDeleteInternshipSchedule,
} from "@/lib/hooks/use-activities";
import {
  useInternshipPartners,
  useCreateInternshipPartner,
  useUpdateInternshipPartner,
  useDeleteInternshipPartner,
} from "@/lib/hooks/use-activities";
// toast not needed here

export default function AdminInternshipPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [formData, setFormData] = useState<InternshipFormData>({
    program: "",
    period: "",
    notes: "",
  });
  // Partners state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [isAddCombinedOpen, setIsAddCombinedOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [partnerForm, setPartnerForm] = useState<{
    name: string;
    field: string;
  }>({ name: "", field: "" });
  const limit = 5;

  // Schedules hooks
  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    error: schedulesError,
  } = useInternshipSchedules({ search, page: currentPage, limit });
  const createScheduleMutation = useCreateInternshipSchedule();
  const updateScheduleMutation = useUpdateInternshipSchedule();
  const deleteScheduleMutation = useDeleteInternshipSchedule();

  // Partners hooks
  const {
    data: partnersData,
    isLoading: isPartnersLoading,
    error: partnersError,
  } = useInternshipPartners();
  const createPartnerMutation = useCreateInternshipPartner();
  const updatePartnerMutation = useUpdateInternshipPartner();
  const deletePartnerMutation = useDeleteInternshipPartner();

  const schedules = (schedulesData as any)?.data || [];
  const pagination = (schedulesData as any)?.pagination || {};
  const partners = (partnersData as any)?.data || [];

  const filteredSchedules = schedules.filter(
    (s: any) =>
      s.program?.toLowerCase().includes(search.toLowerCase()) ||
      s.period?.toLowerCase().includes(search.toLowerCase()) ||
      s.notes?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPartners = partners.filter(
    (p: any) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.field?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleInputChange = (field: keyof InternshipFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    setFormData({ program: "", period: "", notes: "" });
    setPartnerForm({ name: "", field: "" });
    setIsAddCombinedOpen(true);
  };

  const handleAddPartner = () => {
    setPartnerForm({ name: "", field: "" });
    setSelectedPartner(null);
    setIsAddPartnerOpen(true);
  };

  const handleEdit = (item: any) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (isAddDialogOpen) setIsAddDialogOpen(false);
    setFormData({
      program: item.program || "",
      period: item.period || "",
      notes: item.notes || "",
    });
    setSelectedSchedule(item);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
    setFormData({ program: "", period: "", notes: "" });
  };

  const closePartnerDialogs = () => {
    setIsAddPartnerOpen(false);
    setIsEditPartnerOpen(false);
    setSelectedPartner(null);
    setPartnerForm({ name: "", field: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSchedule) {
        await updateScheduleMutation.mutateAsync({
          id: selectedSchedule._id,
          data: formData,
        });
        setIsEditDialogOpen(false);
        setSelectedSchedule(null);
      } else {
        await createScheduleMutation.mutateAsync(formData);
        setIsAddDialogOpen(false);
      }
      setFormData({ program: "", period: "", notes: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPartner) {
        await updatePartnerMutation.mutateAsync({
          id: selectedPartner._id,
          data: partnerForm,
        });
        setIsEditPartnerOpen(false);
        setSelectedPartner(null);
      } else {
        await createPartnerMutation.mutateAsync(partnerForm);
        setIsAddPartnerOpen(false);
      }
      setPartnerForm({ name: "", field: "" });
    } catch (error) {
      console.error("Error submitting partner:", error);
    }
  };

  const handleEditPartner = (partner: any) => {
    setSelectedPartner(partner);
    setPartnerForm({ name: partner.name || "", field: partner.field || "" });
    setIsEditPartnerOpen(true);
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus mitra ini?")) {
      try {
        await deletePartnerMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteScheduleMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader
          title="Manajemen Jadwal Prakerin"
          subtitle="Kelola jadwal dan kegiatan prakerin untuk halaman publik"
          right={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari jadwal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="w-full sm:w-auto bg-primary-950 text-white hover:bg-primary-900"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Data (Mitra &/
                  Jadwal)
                </Button>
              </div>
            </div>
          }
        />

        {/* Partners */}
        <AdminTableCard
          title="Mitra DUDI"
          description="Kelola mitra dunia usaha dan industri"
        >
          <Table className="bg-white">
            <TableHeader>
              <TableRow className="bg-primary-900 hover:bg-primary-900">
                <TableHead className="text-white">Perusahaan</TableHead>
                <TableHead className="text-white">Bidang</TableHead>
                <TableHead className="w-20 text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPartnersLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Memuat mitra...
                  </TableCell>
                </TableRow>
              )}
              {partnersError && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-red-600"
                  >
                    Gagal memuat mitra
                  </TableCell>
                </TableRow>
              )}
              {!isPartnersLoading &&
                !partnersError &&
                filteredPartners.map((partner: any) => (
                  <TableRow key={partner._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {partner.name || "-"}
                    </TableCell>
                    <TableCell>{partner.field || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <DeleteConfirmation
                          onConfirm={() => handleDeletePartner(partner._id)}
                          itemName={partner.name}
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
                ))}
            </TableBody>
          </Table>
        </AdminTableCard>

        {/* Combined Add Dialog: Mitra &/ Jadwal */}
        <Dialog open={isAddCombinedOpen} onOpenChange={setIsAddCombinedOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Data Prakerin</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (partnerForm.name?.trim()) {
                    await createPartnerMutation.mutateAsync(partnerForm);
                  }
                  if (formData.program?.trim()) {
                    await createScheduleMutation.mutateAsync(formData);
                  }
                  setPartnerForm({ name: "", field: "" });
                  setFormData({ program: "", period: "", notes: "" });
                  setIsAddCombinedOpen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Mitra DUDI (opsional)
                  </div>
                  <Input
                    placeholder="Nama Perusahaan"
                    value={partnerForm.name}
                    onChange={(e) =>
                      setPartnerForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Bidang Usaha (mis. Software & Networking)"
                    value={partnerForm.field}
                    onChange={(e) =>
                      setPartnerForm((p) => ({ ...p, field: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Jadwal Prakerin (opsional)
                  </div>
                  <Input
                    placeholder="Program"
                    value={formData.program}
                    onChange={(e) =>
                      handleInputChange("program", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Periode (mis. Jan - Mar 2025)"
                    value={formData.period}
                    onChange={(e) =>
                      handleInputChange("period", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Keterangan (Batch)"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddCombinedOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createPartnerMutation.isPending ||
                    createScheduleMutation.isPending
                  }
                >
                  {createPartnerMutation.isPending ||
                  createScheduleMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Schedules */}
        <AdminTableCard title="" description="">
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
              {isSchedulesLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Memuat jadwal...
                  </TableCell>
                </TableRow>
              )}
              {schedulesError && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-red-600"
                  >
                    Gagal memuat jadwal
                  </TableCell>
                </TableRow>
              )}
              {!isSchedulesLoading &&
                !schedulesError &&
                filteredSchedules.map((schedule: any) => (
                  <TableRow key={schedule._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {schedule.program || "-"}
                    </TableCell>
                    <TableCell>{schedule.period || "-"}</TableCell>
                    <TableCell>{schedule.notes || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(schedule)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <DeleteConfirmation
                          onConfirm={() => handleDeleteSchedule(schedule._id)}
                          itemName={schedule.program}
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
                ))}
            </TableBody>
          </Table>
        </AdminTableCard>

        {/* Pagination */}
        {schedules.length > 0 && pagination?.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer ${
                        currentPage === page
                          ? "border-primary-600 text-primary-600 hover:bg-primary-50"
                          : ""
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={
                      currentPage >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Prakerin</DialogTitle>
            </DialogHeader>
            <InternshipForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={createScheduleMutation.isPending}
              submitText="Tambah"
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Jadwal Prakerin</DialogTitle>
            </DialogHeader>
            <InternshipForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={updateScheduleMutation.isPending}
              submitText="Perbarui"
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
