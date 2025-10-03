"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import {
  useInternshipPartners,
  useInternshipSchedules,
} from "@/lib/hooks/use-activities";

export default function InternshipPage() {
  const {
    data: partnersData,
    isLoading: isPartnersLoading,
    error: partnersError,
  } = useInternshipPartners();
  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    error: schedulesError,
  } = useInternshipSchedules();
  const partners = partnersData?.data || [];
  const schedules = schedulesData?.data || [];

  return (
    <div>
      <PageHeader
        title="DUDI & Prakerin"
        subtitle="Kemitraan dunia usaha dan industri serta jadwal program prakerin"
        breadcrumbs={[{ label: "DUDI & Prakerin" }]}
        backgroundImage="/assets/p5.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Partners */}
            <div>
              <Typography variant="h3" className="mb-4">
                Mitra DUDI
              </Typography>
              <div className="space-y-4">
                {isPartnersLoading && (
                  <div className="text-muted-foreground">Memuat mitra...</div>
                )}
                {partnersError && (
                  <div className="text-red-600">Gagal memuat mitra</div>
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
                      className="rounded-xl border border-primary-100 p-4"
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

            {/* Schedule */}
            <div>
              <Typography variant="h3" className="mb-4">
                Jadwal Prakerin
              </Typography>
              <div className="rounded-2xl border border-primary-100 overflow-hidden">
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
                  schedules.map((s: any, i: number) => (
                    <div
                      key={i}
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
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
