"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  Clock,
  User,
  Users,
  ArrowRight,
} from "lucide-react";
import { useExtracurriculars } from "@/lib/hooks/use-activities";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

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
              extracurriculars.map((item: any, index: number) => {
                const name = item.name || item.title || "Ekstrakurikuler";
                const slug = toSlug(name);
                return (
                  <motion.div
                    key={item.id || item._id || name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-primary-100 shadow hover:shadow-lg transition-shadow group"
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Activity className="w-16 h-16 text-primary-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <Typography variant="h5" className="mb-2">
                        {name}
                      </Typography>

                      {/* Schedule Info */}
                      {(item.scheduleDay || item.scheduleTime) && (
                        <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
                          {item.scheduleDay && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {item.scheduleDay}
                            </span>
                          )}
                          {item.scheduleTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {item.scheduleTime}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Coach/Trainer Info */}
                      {(item.coach || item.trainer) && (
                        <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
                          {item.coach && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {item.coach}
                            </span>
                          )}
                        </div>
                      )}

                      <Typography
                        variant="body2"
                        color="muted"
                        className="line-clamp-2 mb-4"
                      >
                        {item.description || ""}
                      </Typography>

                      <Link href={`/activities/extracurricular/${slug}`}>
                        <Button
                          variant="outline"
                          className="w-full bg-primary-950 text-white"
                        >
                          Lihat Detail
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
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
                  Kegiatan ekstrakurikuler akan ditampilkan di sini setelah data
                  tersedia
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
