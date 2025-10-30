"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/ui/button";
import { Users, Activity } from "lucide-react";
import { useExtracurriculars } from "@/lib/hooks/use-activities";

export default function ExtracurricularPage() {
  const { data, isLoading, error } = useExtracurriculars();
  const extracurriculars = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Ekstrakurikuler"
        subtitle="Informasi kegiatan pengembangan minat dan bakat di SMK Madyatama"
        breadcrumbs={[{ label: "Ekstrakurikuler" }]}
        backgroundImage="/assets/bg-eskul.png"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Typography variant="h2" className="mb-4">
              Daftar Kegiatan
            </Typography>
            <Typography variant="body1" color="muted">
              Siswa dapat memilih kegiatan di luar pembelajaran untuk mengasah
              soft-skill dan karakter.
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && (
              <div className="col-span-3 text-center text-muted-foreground">
                Memuat data...
              </div>
            )}
            {error && (
              <div className="col-span-3 text-center text-red-600">
                Gagal memuat data
              </div>
            )}
            {!isLoading &&
              !error &&
              extracurriculars.length > 0 &&
              extracurriculars.map((item: any, index: number) => (
                <motion.div
                  key={item._id || item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-primary-100 shadow"
                >
                  <Typography variant="h5" className="mb-2">
                    {item.name || "-"}
                  </Typography>
                  <Typography variant="body2" color="muted">
                    {item.description || ""}
                  </Typography>
                </motion.div>
              ))}
            {!isLoading && !error && extracurriculars.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="col-span-3 text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-12 h-12 text-gray-400" />
                </div>
                <Typography variant="h4" color="muted" className="mb-4">
                  Belum ada ekstrakurikuler yang tersedia
                </Typography>
                <Typography variant="body1" color="muted" className="mb-8">
                  Kegiatan ekstrakurikuler akan ditampilkan di sini setelah data tersedia
                </Typography>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Halaman
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
