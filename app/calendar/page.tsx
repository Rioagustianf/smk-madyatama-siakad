"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { addMonths, subMonths } from "date-fns";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { CalendarGrid } from "@/components/organisms/CalendarGrid";
import { CalendarNavigation } from "@/components/molecules/Calendar/CalendarNavigation";
import { CalendarFilter } from "@/components/molecules/Calendar/CalendarFilter";
import { EventDetailModal } from "@/components/molecules/Calendar/EventDetailModal";
import { useCalendarEvents } from "@/lib/hooks/use-calendar";
import { AcademicEvent } from "@/lib/types";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/atoms/Typography/Typography";

export default function PublicCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch only published events
  const { data: eventsData, isLoading } = useCalendarEvents({
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth() + 1,
    isPublished: true,
  });

  const allEvents: AcademicEvent[] = eventsData?.data || [];

  // Filter events client-side based on user selection
  const filteredEvents =
    filterType === "all"
      ? allEvents
      : allEvents.filter((e) => e.type === filterType);

  const handleEventClick = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Kalender Akademik"
        subtitle="Jadwal kegiatan akademik dan acara penting SMK Madyatama"
        breadcrumbs={[{ label: "Kalender Akademik" }]}
        backgroundImage="/assets/bg-pengumuman.jpeg"
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Controls: Navigation & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                  <div className="w-full lg:w-auto">
                    <CalendarNavigation
                      currentMonth={currentMonth}
                      onPreviousMonth={() =>
                        setCurrentMonth(subMonths(currentMonth, 1))
                      }
                      onNextMonth={() =>
                        setCurrentMonth(addMonths(currentMonth, 1))
                      }
                      onToday={() => setCurrentMonth(new Date())}
                    />
                  </div>

                  <div className="w-full lg:w-auto flex justify-end">
                    <CalendarFilter
                      filterType={filterType}
                      onFilterChange={setFilterType}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-600" />
                    <p>Memuat kalender...</p>
                  </div>
                ) : (
                  <>
                    <CalendarGrid
                      currentMonth={currentMonth}
                      events={filteredEvents}
                      onEventClick={handleEventClick}
                    />

                    {/* Public Legend */}
                    <div className="mt-8 pt-6 border-t flex flex-wrap gap-6 justify-center lg:justify-start">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600">
                          Event Kegiatan
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm text-gray-600">
                          Hari Libur
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-600">
                          Penerimaan Siswa
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info / Empty State Helper */}
          {!isLoading && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <Typography variant="h5" className="mb-2 text-gray-600">
                Tidak ada kegiatan
              </Typography>
              <Typography variant="body2" color="muted">
                Tidak ada kegiatan yang ditemukan untuk filter atau bulan yang
                dipilih.
              </Typography>
            </motion.div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
