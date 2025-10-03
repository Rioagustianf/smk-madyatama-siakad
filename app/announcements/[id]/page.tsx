"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { Calendar, Loader2 } from "lucide-react";
import { useAnnouncement } from "@/lib/hooks/use-announcements";

const categoryLabels = {
  academic: "Akademik",
  general: "Umum",
  exam: "Ujian",
  event: "Acara",
};

const priorityLabels = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useAnnouncement(id || "");
  const announcement = data?.data;

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Memuat Pengumuman..."
          subtitle="Mengambil detail pengumuman"
          breadcrumbs={[
            { label: "Pengumuman", href: "/announcements" },
            { label: "Detail" },
          ]}
        />
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <Typography variant="body1" color="muted">
                Memuat pengumuman...
              </Typography>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div>
        <PageHeader
          title="Pengumuman Tidak Ditemukan"
          subtitle="Pengumuman yang Anda cari tidak dapat ditemukan"
          breadcrumbs={[
            { label: "Pengumuman", href: "/announcements" },
            { label: "Detail" },
          ]}
        />
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center py-20">
              <Typography variant="h4" className="mb-3">
                Pengumuman tidak ditemukan
              </Typography>
              <Typography variant="body1" color="muted" className="mb-6">
                Pengumuman yang Anda cari mungkin sudah dihapus atau tidak
                tersedia.
              </Typography>
              <Button variant="outline" asChild>
                <a href="/announcements">Kembali ke daftar</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <PageHeader
        title={announcement.title}
        subtitle="Informasi lengkap pengumuman terbaru"
        breadcrumbs={[
          { label: "Pengumuman", href: "/announcements" },
          { label: announcement.title },
        ]}
        backgroundImage={announcement.image}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          {announcement && (
            <article className="mx-auto w-full max-w-3xl">
              {announcement.image && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                  <Image
                    src={announcement.image}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <Typography variant="h1" className="mb-3">
                {announcement.title}
              </Typography>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {formatDate(
                      announcement.publishedAt || announcement.createdAt
                    )}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${
                    announcement.category === "academic"
                      ? "bg-blue-100 text-blue-700"
                      : announcement.category === "exam"
                      ? "bg-purple-100 text-purple-700"
                      : announcement.category === "event"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {
                    categoryLabels[
                      announcement.category as keyof typeof categoryLabels
                    ]
                  }
                </span>
                {announcement.priority && (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      announcement.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : announcement.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {
                      priorityLabels[
                        announcement.priority as keyof typeof priorityLabels
                      ]
                    }
                  </span>
                )}
              </div>

              {announcement.excerpt && (
                <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                  <Typography
                    variant="body1"
                    className="font-medium text-gray-700"
                  >
                    {announcement.excerpt}
                  </Typography>
                </div>
              )}

              <div className="prose max-w-none">
                <Typography
                  variant="body1"
                  color="muted"
                  className="leading-relaxed whitespace-pre-line"
                >
                  {announcement.content}
                </Typography>
              </div>

              <div className="mt-12 pt-6 border-t flex">
                <Button variant="outline" asChild>
                  <a href="/announcements">Kembali ke daftar</a>
                </Button>
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
