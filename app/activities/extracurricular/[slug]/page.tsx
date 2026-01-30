"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  Clock,
  User,
  Users,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { useExtracurriculars } from "@/lib/hooks/use-activities";

function fromSlug(slug: string): string {
  return slug.replace(/-/g, " ");
}

export default function ExtracurricularDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || "").toLowerCase();
  const { data, isLoading, error } = useExtracurriculars();
  const extracurriculars = data?.data || [];

  const item = useMemo(() => {
    const normalized = fromSlug(slug);
    return extracurriculars.find((e: any) => {
      const name = (e.name || e.title || "").toLowerCase();
      return name === normalized;
    });
  }, [extracurriculars, slug]);

  return (
    <div>
      <PageHeader
        title={item?.name || item?.title || "Ekstrakurikuler"}
        subtitle={
          item?.scheduleDay
            ? `Latihan: ${item.scheduleDay}`
            : "Detail kegiatan ekstrakurikuler"
        }
        breadcrumbs={[
          { label: "Aktivitas", href: "/activities" },
          { label: "Ekstrakurikuler", href: "/activities/extracurricular" },
          { label: item?.name || item?.title || "Detail" },
        ]}
        backgroundImage={item?.image || undefined}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              Memuat detail ekstrakurikuler...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              Gagal memuat data
            </div>
          ) : item ? (
            <div className="flex flex-col gap-10">
              {/* Image & Title Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                  <Link href="/activities/extracurricular">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-primary-950 text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali ke Daftar
                    </Button>
                  </Link>

                  <div className="flex gap-3">
                    <Link href="/activities/achievements">
                      <Button
                        variant="ghost"
                        className="border border-primary-600"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Lihat Prestasi
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-100 to-primary-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Activity className="w-32 h-32 text-primary-400" />
                    </div>
                  )}
                </div>

                <div>
                  <Typography variant="h2" className="mb-2">
                    {item.name || item.title}
                  </Typography>
                </div>
              </div>

              {/* Info Grid (Schedule & Personnel) */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Schedule */}
                <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100">
                  <Typography
                    variant="h6"
                    className="mb-4 flex items-center gap-2 text-primary-800"
                  >
                    <Calendar className="w-5 h-5" />
                    Jadwal Latihan
                  </Typography>
                  <div className="space-y-4">
                    {item.scheduleDay && (
                      <div>
                        <Typography
                          variant="caption"
                          color="muted"
                          className="block mb-1"
                        >
                          Hari
                        </Typography>
                        <div className="flex items-center gap-2 font-medium">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                          {item.scheduleDay}
                        </div>
                      </div>
                    )}
                    {item.scheduleTime && (
                      <div>
                        <Typography
                          variant="caption"
                          color="muted"
                          className="block mb-1"
                        >
                          Waktu
                        </Typography>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="w-4 h-4 text-primary-500" />
                          {item.scheduleTime}
                        </div>
                      </div>
                    )}
                    {!item.scheduleDay && !item.scheduleTime && (
                      <Typography
                        variant="body2"
                        color="muted"
                        className="italic"
                      >
                        Informasi jadwal belum tersedia
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Personnel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 md:col-span-2">
                  <Typography
                    variant="h6"
                    className="mb-4 flex items-center gap-2"
                  >
                    <Users className="w-5 h-5 text-gray-700" />
                    Pengurus & Pelatih
                  </Typography>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Typography variant="subtitle2" className="mb-1">
                          Pembina
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {item.coach || "-"}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <Typography variant="subtitle2" className="mb-1">
                          Pelatih
                        </Typography>
                        <Typography variant="body1" className="font-medium">
                          {item.trainer || "-"}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="prose prose-lg max-w-none bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <Typography variant="h6" className="mb-4">
                    Tentang Kegiatan
                  </Typography>
                  <Typography
                    variant="body1"
                    color="muted"
                    className="whitespace-pre-wrap leading-relaxed"
                  >
                    {item.description}
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-gray-400" />
              </div>
              <Typography variant="h4" className="mb-3">
                Ekstrakurikuler tidak ditemukan
              </Typography>
              <Link href="/activities/extracurricular">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
