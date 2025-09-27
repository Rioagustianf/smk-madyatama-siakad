"use client";

import React from "react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { Calendar } from "lucide-react";

// Temporary mock data; will be replaced with server data (MongoDB)
const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Jadwal Ujian Tengah Semester Ganjil 2024/2025",
    content:
      "Pelaksanaan UTS akan dimulai tanggal 1 Maret 2025. Harap mempersiapkan diri dan membawa kartu ujian.",
    image:
      "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg",
    category: "exam" as const,
    priority: "high" as const,
    publishedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Libur Semester Ganjil dan Jadwal Masuk",
    content:
      "Libur semester dimulai 20 Desember 2024. Masuk kembali 6 Januari 2025.",
    image: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
    category: "general" as const,
    priority: "medium" as const,
    publishedAt: new Date("2024-01-12"),
  },
];

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const announcement = useMemo(
    () => MOCK_ANNOUNCEMENTS.find((a) => a.id === String(id)),
    [id]
  );

  return (
    <div>
      <PageHeader
        title={announcement?.title || "Detail Pengumuman"}
        subtitle="Informasi lengkap pengumuman terbaru"
        breadcrumbs={[
          { label: "Pengumuman", href: "/announcements" },
          { label: announcement?.title || "Detail" },
        ]}
        backgroundImage={announcement?.image}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          {announcement ? (
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                {announcement.image && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <Image
                      src={announcement.image}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Typography variant="h2" className="mb-2">
                  {announcement.title}
                </Typography>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {announcement.publishedAt.toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="prose max-w-none">
                  <Typography
                    variant="body1"
                    color="muted"
                    className="leading-relaxed"
                  >
                    {announcement.content}
                  </Typography>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-primary-100 p-5 sticky top-28">
                  <Typography variant="subtitle2" className="mb-2">
                    Tindakan
                  </Typography>
                  <div className="flex gap-3">
                    <Button variant="outline" asChild>
                      <a href="/announcements">Kembali</a>
                    </Button>
                    <Button
                      variant="default"
                      className="bg-primary-700 hover:bg-primary-600 text-white"
                    >
                      Simpan PDF
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="text-center py-20">
              <Typography variant="h4" className="mb-3">
                Pengumuman tidak ditemukan
              </Typography>
              <Button variant="outline" asChild>
                <a href="/announcements">Kembali ke daftar</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return MOCK_ANNOUNCEMENTS.map((a) => ({ id: a.id }));
}
