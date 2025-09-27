"use client";

import React from "react";
import { Typography } from "@/components/atoms/Typography/Typography";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6 p-4 md:grid-cols-3">
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Academic
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Program keahlian.
        </Typography>
        <a
          href="/dashboard/admin/academic"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Activities
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Prestasi & Ekstrakurikuler.
        </Typography>
        <a
          href="/dashboard/admin/activities"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Announcements
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Kelola pengumuman.
        </Typography>
        <a
          href="/dashboard/admin/announcements"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Gallery
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Kelola galeri foto.
        </Typography>
        <a
          href="/dashboard/admin/galeri"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Profile
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Profil sekolah.
        </Typography>
        <a
          href="/dashboard/admin/profile"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Staff
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Guru & tenaga pendidik.
        </Typography>
        <a
          href="/dashboard/admin/staff"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
      <div className="rounded-xl border border-primary-100 p-5 bg-white">
        <Typography variant="subtitle2" className="mb-1">
          Exams
        </Typography>
        <Typography variant="body2" color="muted" className="mb-3">
          Jadwal ujian.
        </Typography>
        <a
          href="/dashboard/admin/exams"
          className="text-primary-700 font-medium"
        >
          Buka
        </a>
      </div>
    </div>
  );
}
