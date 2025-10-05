"use client";

import React, { useMemo } from "react";
import { Typography } from "@/components/atoms/Typography/Typography";
import { useMajors } from "@/lib/hooks/use-majors";
import { useTeachers } from "@/lib/hooks/use-teachers";
import { useGalleryList } from "@/lib/hooks/use-gallery";
import { useAnnouncements } from "@/lib/hooks/use-announcements";

export default function AdminDashboardPage() {
  const { data: majorsResp } = useMajors({ page: 1, limit: 1 } as any);
  const { data: teachersResp } = useTeachers({ page: 1, limit: 1 } as any);
  const { data: galleryResp } = useGalleryList({ page: 1, limit: 1 } as any);
  const { data: annResp } = useAnnouncements({ page: 1, limit: 5 } as any);

  const majorsTotal =
    ((majorsResp as any)?.pagination?.total ??
      ((majorsResp as any)?.data || []).length) ||
    0;
  const teachersTotal =
    ((teachersResp as any)?.pagination?.total ??
      ((teachersResp as any)?.data || []).length) ||
    0;
  const galleryTotal =
    ((galleryResp as any)?.pagination?.total ??
      ((galleryResp as any)?.data || []).length) ||
    0;
  const announcements = useMemo(() => (annResp as any)?.data || [], [annResp]);

  return (
    <div className="space-y-6 p-4">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-primary-700 p-5 bg-primary-950">
          <Typography variant="subtitle2" className="mb-1 text-white">
            Program Keahlian
          </Typography>
          <Typography variant="h3" className="mb-1 text-white">
            {majorsTotal}
          </Typography>
          <Typography variant="caption" color="muted">
            Total jurusan aktif
          </Typography>
        </div>
        <div className="rounded-xl border border-primary-700 p-5 bg-primary-950">
          <Typography variant="subtitle2" className="mb-1 text-white">
            Tenaga Pendidik
          </Typography>
          <Typography variant="h3" className="mb-1 text-white">
            {teachersTotal}
          </Typography>
          <Typography variant="caption" color="muted" className="text-white">
            Guru & staff terdaftar
          </Typography>
        </div>
        <div className="rounded-xl border border-primary-700 p-5 bg-primary-950">
          <Typography variant="subtitle2" className="mb-1 text-white">
            Item Galeri
          </Typography>
          <Typography variant="h3" className="mb-1 text-white">
            {galleryTotal}
          </Typography>
          <Typography variant="caption" color="muted" className="text-white">
            Foto/Video dipublikasikan
          </Typography>
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="rounded-xl border border-primary-700 bg-white p-5">
        <Typography variant="subtitle2" className="mb-2">
          Pengumuman Terbaru
        </Typography>
        {announcements.length === 0 ? (
          <Typography variant="body2" color="muted">
            Belum ada pengumuman.
          </Typography>
        ) : (
          <div className="divide-y">
            {announcements.slice(0, 5).map((a: any) => (
              <div key={a._id || a.id} className="py-3">
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle2">
                    {a.title || "(Tanpa judul)"}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString("id-ID")
                      : "-"}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  color="muted"
                  className="line-clamp-2"
                >
                  {a.content || a.description || ""}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/dashboard/admin/announcements",
            title: "Kelola Pengumuman",
            desc: "Tambah/edit pengumuman",
          },
          {
            href: "/dashboard/admin/galeri",
            title: "Kelola Galeri",
            desc: "Upload foto atau video",
          },
          {
            href: "/dashboard/admin/staff",
            title: "Kelola Staff",
            desc: "Guru & tenaga pendidik",
          },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-xl border border-primary-700 p-5 bg-white hover:border-primary-300"
          >
            <Typography variant="subtitle2" className="mb-1">
              {l.title}
            </Typography>
            <Typography variant="body2" color="muted">
              {l.desc}
            </Typography>
          </a>
        ))}
      </div>
    </div>
  );
}
