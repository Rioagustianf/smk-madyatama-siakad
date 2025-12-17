"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Download } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
  useSeedHolidays,
} from "@/lib/hooks/use-calendar";
import { CalendarGrid } from "@/components/organisms/CalendarGrid";
import { CalendarNavigation } from "@/components/molecules/Calendar/CalendarNavigation";
import { CalendarFilter } from "@/components/molecules/Calendar/CalendarFilter";
import { EventFormDialog } from "@/components/molecules/Calendar/EventFormDialog";
import { AcademicEvent } from "@/lib/types";

export default function AdminCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("all");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("EVENT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hooks
  const { data: eventsData, isLoading } = useCalendarEvents({
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth() + 1,
  });

  const createMutation = useCreateCalendarEvent();
  const updateMutation = useUpdateCalendarEvent();
  const deleteMutation = useDeleteCalendarEvent();
  const seedMutation = useSeedHolidays();

  const allEvents: AcademicEvent[] = eventsData?.data || [];

  // Filter events
  const filteredEvents =
    filterType === "all"
      ? allEvents
      : allEvents.filter((e) => e.type === filterType);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("EVENT");
    setStartDate("");
    setEndDate("");
    setSelectedEvent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleEventClick = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setType(event.type);
    setStartDate(event.startDate.split("T")[0]);
    setEndDate(event.endDate.split("T")[0]);
    setIsEditOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title, description, type, startDate, endDate },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          resetForm();
        },
      }
    );
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    updateMutation.mutate(
      {
        id: selectedEvent.id,
        data: { title, description, type, startDate, endDate },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          resetForm();
        },
      }
    );
  };

  const handleDelete = () => {
    if (selectedEvent && confirm(`Hapus event "${selectedEvent.title}"?`)) {
      deleteMutation.mutate(selectedEvent.id);
      setIsEditOpen(false);
    }
  };

  const isBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    seedMutation.isPending;

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="border border-primary-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Kalender Akademik</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tahun Ajaran {currentMonth.getFullYear()}/
                  {currentMonth.getFullYear() + 1} - Semester Genap
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="border border-primary-600 rounded-lg"
                      size="sm"
                      disabled={isBusy}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Import Hari Libur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Hari Libur Nasional</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Pilih tahun untuk mengimport hari libur nasional dari
                        API Nager.Date
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => seedMutation.mutate(2024)}
                          disabled={isBusy}
                          variant="outline"
                          className="flex-1"
                        >
                          2024
                        </Button>
                        <Button
                          onClick={() => seedMutation.mutate(2025)}
                          disabled={isBusy}
                          variant="outline"
                          className="flex-1"
                        >
                          2025
                        </Button>
                        <Button
                          onClick={() => seedMutation.mutate(2026)}
                          disabled={isBusy}
                          variant="outline"
                          className="flex-1"
                        >
                          2026
                        </Button>
                      </div>
                      <Button
                        onClick={async () => {
                          for (const year of [2024, 2025, 2026]) {
                            await seedMutation.mutateAsync(year);
                          }
                        }}
                        disabled={isBusy}
                        className="w-full"
                      >
                        Import Semua (2024-2026)
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  className="bg-primary-950 text-white rounded-lg"
                  size="sm"
                  onClick={handleAdd}
                  disabled={isBusy}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kegiatan
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation & Filters */}
        <Card className="rounded-lg border border-primary-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <CalendarNavigation
                currentMonth={currentMonth}
                onPreviousMonth={() =>
                  setCurrentMonth(subMonths(currentMonth, 1))
                }
                onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
                onToday={() => setCurrentMonth(new Date())}
              />
              <CalendarFilter
                filterType={filterType}
                onFilterChange={setFilterType}
              />
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-6 border border-primary-600 rounded-lg">
            <CalendarGrid
              currentMonth={currentMonth}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6 border border-primary-600 rounded-lg">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium">Keterangan:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
                <span className="text-sm">Event</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                <span className="text-sm">Hari Libur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                <span className="text-sm">Penerimaan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Event Dialog */}
        <EventFormDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          mode="add"
          title={title}
          description={description}
          type={type}
          startDate={startDate}
          endDate={endDate}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onTypeChange={setType}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleSubmitAdd}
          isLoading={isBusy}
        />

        {/* Edit Event Dialog */}
        <EventFormDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          mode="edit"
          title={title}
          description={description}
          type={type}
          startDate={startDate}
          endDate={endDate}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onTypeChange={setType}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleSubmitEdit}
          onDelete={handleDelete}
          isLoading={isBusy}
        />
      </div>
    </div>
  );
}
