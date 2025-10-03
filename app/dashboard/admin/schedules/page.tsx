"use client";

import { useState, Fragment } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Calendar } from "lucide-react";
import {
  useSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from "@/lib/hooks/use-schedules";
import ScheduleForm from "@/components/molecules/ScheduleForm/ScheduleForm";
import { DeleteConfirmation } from "@/components/molecules/DeleteConfirmation/DeleteConfirmation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleTable from "@/components/molecules/ScheduleTable/ScheduleTable";

export interface ScheduleFormData {
  day: string;
  time: string;
  subject: string;
  class: string;
  teacher: string;
}

export default function AdminSchedulesPage() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [formData, setFormData] = useState<ScheduleFormData>({
    day: "",
    time: "",
    subject: "",
    class: "",
    teacher: "",
  });

  // Fetch data
  const { data: schedulesData, isLoading } = useSchedules({
    search,
  });

  const groupedData = (schedulesData as any)?.groupedData || [];

  // Mutations
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const handleAdd = () => {
    setFormData({
      day: "",
      time: "",
      subject: "",
      class: "",
      teacher: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Blur any focused element to prevent aria-hidden issues
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Close add dialog if open
    if (isAddDialogOpen) {
      setIsAddDialogOpen(false);
    }

    setFormData({
      day: item.day,
      time: item.time,
      subject: item.subject,
      class: item.class,
      teacher: item.teacher || "",
    });
    setSelectedSchedule(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedSchedule(item);
  };

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedSchedule) {
        // Update
        await updateScheduleMutation.mutateAsync({
          id: selectedSchedule._id,
          data: formData,
        });
        setIsEditDialogOpen(false);
        setSelectedSchedule(null);
      } else {
        // Create
        await createScheduleMutation.mutateAsync(formData);
        setIsAddDialogOpen(false);
      }

      // Reset form
      setFormData({
        day: "",
        time: "",
        subject: "",
        class: "",
        teacher: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedSchedule) {
      try {
        await deleteScheduleMutation.mutateAsync(selectedSchedule._id);
        setSelectedSchedule(null);
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
    setFormData({
      day: "",
      time: "",
      subject: "",
      class: "",
      teacher: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Jadwal</h1>
          <p className="text-gray-600">Kelola jadwal pelajaran sekolah</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari jadwal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64 border border-primary-600"
            />
          </div>
          <Button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-primary-950 text-white hover:bg-primary-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-primary-600 shadow-sm">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Memuat data...</span>
            </div>
          ) : groupedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 py-8">
              <Calendar className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Belum ada jadwal</p>
              <p className="text-sm">
                Klik tombol &quot;Tambah Jadwal&quot; untuk menambahkan jadwal
                pertama
              </p>
            </div>
          ) : (
            <Tabs defaultValue={groupedData[0]?.className} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedData.map((group: any) => (
                  <TabsTrigger
                    key={group.className}
                    value={group.className}
                    className="text-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {group.className}
                    <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                      {group.totalSchedules}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {groupedData.map((group: any) => (
                <TabsContent key={group.className} value={group.className}>
                  <ScheduleTable
                    schedules={group.schedules}
                    showActions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDeleteConfirm={handleDeleteConfirm}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent onInteractOutside={handleDialogClose}>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <ScheduleForm
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
        <DialogContent onInteractOutside={handleDialogClose}>
          <DialogHeader>
            <DialogTitle>Edit Jadwal</DialogTitle>
          </DialogHeader>
          <ScheduleForm
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
  );
}
