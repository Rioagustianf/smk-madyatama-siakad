"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import {
  useInternshipSchedules,
  useInternshipPartners,
} from "@/lib/hooks/use-activities";

export default function InternshipPage() {
  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    error: schedulesError,
  } = useInternshipSchedules();
  const {
    data: partnersData,
    isLoading: isPartnersLoading,
    error: partnersError,
  } = useInternshipPartners();
  const schedules = schedulesData?.data || [];
  const partners = partnersData?.data || [];

  return (
    <div>
      <PageHeader
        title="Jadwal Prakerin"
        subtitle="Informasi jadwal dan kegiatan program prakerin"
        breadcrumbs={[{ label: "Jadwal Prakerin" }]}
        backgroundImage="/assets/p5.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Partners */}
            <div className="flex flex-col shadow-md">
              <Typography variant="h3" className="mb-4">
                Mitra DUDI
              </Typography>
              <div className="rounded-2xl border border-primary-100 bg-white h-full overflow-hidden">
                <div className="p-4">
                  {isPartnersLoading && (
                    <div className="text-muted-foreground">Memuat mitra...</div>
                  )}
                  {partnersError && (
                    <div className="text-red-600">Gagal memuat mitra</div>
                  )}
                  {!isPartnersLoading &&
                    !partnersError &&
                    partners.length === 0 && (
                      <div className="text-muted-foreground">
                        Belum ada data mitra.
                      </div>
                    )}
                  {!isPartnersLoading &&
                    !partnersError &&
                    partners.map((p: any, i: number) => (
                      <motion.div
                        key={p._id || p.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="rounded-xl border border-primary-100 p-4 mb-3 last:mb-0"
                      >
                        <Typography variant="subtitle2">
                          {p.name || "-"}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          {p.field || ""}
                        </Typography>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex flex-col shadow-md">
              <Typography variant="h3" className="mb-4">
                Jadwal Prakerin
              </Typography>
              <div className="rounded-2xl border border-primary-100 overflow-hidden bg-white h-full">
                <div className="grid grid-cols-3 bg-primary-50 text-primary-700 font-medium">
                  <div className="p-3">Program</div>
                  <div className="p-3">Periode</div>
                  <div className="p-3">Keterangan</div>
                </div>
                {isSchedulesLoading && (
                  <div className="p-3 text-center text-muted-foreground">
                    Memuat jadwal...
                  </div>
                )}
                {schedulesError && (
                  <div className="p-3 text-center text-red-600">
                    Gagal memuat jadwal
                  </div>
                )}
                {!isSchedulesLoading &&
                  !schedulesError &&
                  schedules.length === 0 && (
                    <div className="p-3 text-center text-muted-foreground">
                      Belum ada data jadwal.
                    </div>
                  )}
                {!isSchedulesLoading &&
                  !schedulesError &&
                  schedules.map((s: any, i: number) => (
                    <motion.div
                      key={s._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`grid grid-cols-3 ${
                        i % 2 ? "bg-white" : "bg-primary-50/30"
                      }`}
                    >
                      <div className="p-3">
                        <Typography variant="body2">
                          {s.program || "-"}
                        </Typography>
                      </div>
                      <div className="p-3">
                        <Typography variant="body2">
                          {s.period || "-"}
                        </Typography>
                      </div>
                      <div className="p-3">
                        <Typography variant="body2" color="muted">
                          {s.notes || ""}
                        </Typography>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
