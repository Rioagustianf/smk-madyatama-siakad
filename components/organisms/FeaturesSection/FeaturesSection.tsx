"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { school } from "@/lib/school";
import { useMajors } from "@/lib/hooks/use-majors";
import { useAchievements } from "@/lib/hooks/use-activities";
import { useAnnouncements } from "@/lib/hooks/use-announcements";
import {
  GraduationCap,
  Users,
  Award,
  Camera,
  Calendar,
  BookOpen,
  Building2,
  Trophy,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Profil Sekolah",
    description:
      "Informasi lengkap tentang sejarah, visi misi, dan fasilitas sekolah",
    href: "/profile",
    color: "bg-blue-500",
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Program Kejuruan",
    description: "Program keahlian unggulan dengan kurikulum terkini",
    href: "/academic/majors",
    color: "bg-purple-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Ekstrakurikuler",
    description: "Berbagai kegiatan untuk mengembangkan bakat dan minat siswa",
    href: "/activities/extracurricular",
    color: "bg-green-500",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Prestasi",
    description: "Koleksi prestasi akademik dan non-akademik yang membanggakan",
    href: "/activities/achievements",
    color: "bg-yellow-500",
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Galeri",
    description: "Dokumentasi kegiatan dan momen bersejarah sekolah",
    href: "/gallery",
    color: "bg-pink-500",
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "DUDI & Prakerin",
    description: "Informasi praktik kerja industri dan kemitraan DUDI",
    href: "/activities/internship",
    color: "bg-indigo-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const FeaturesSection: React.FC = () => {
  const {
    data: majorsData,
    isLoading: isMajorsLoading,
    error: majorsError,
  } = useMajors();
  const majors: any[] = majorsData?.data || [];

  const {
    data: achData,
    isLoading: isAchLoading,
    error: achError,
  } = useAchievements({ limit: 5 });
  const achievements: any[] = achData?.data || [];

  const {
    data: annData,
    isLoading: isAnnLoading,
    error: annError,
  } = useAnnouncements({ limit: 5, isPublished: true });
  const announcements: any[] = annData?.data || [];

  const toSlug = (nameOrCode: string) =>
    (nameOrCode || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  return (
    <section id="fitur" className="section-padding bg-white relative">
      <div className="container-custom space-y-20">
        {/* About & Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2">
            <Typography variant="overline" color="primary" className="mb-4">
              TENTANG SEKOLAH
            </Typography>
            <Typography variant="h2" className="mb-4">
              {school.name}
            </Typography>
            <Typography
              variant="body1"
              color="muted"
              className="mb-6 max-w-3xl"
            >
              Berlokasi di {school.address.kecamatan}, {school.address.city} –{" "}
              {school.address.province}. Terakreditasi{" "}
              {school.accreditation.status} (Skor {school.accreditation.score}).
              Fokus pada pembelajaran vokasi yang relevan dengan kebutuhan
              industri.
            </Typography>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" asChild>
                <a href="/profile">Profil Sekolah</a>
              </Button>
              <Button
                asChild
                className="bg-primary-950 text-white hover:bg-primary-800"
              >
                <a href="/academic/majors">Program Keahlian</a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-primary-700/50 backdrop-blur-sm bg-white/50 p-5 flex flex-col justify-center items-center text-center">
              <Typography variant="overline" color="primary" className="mb-1">
                Akreditasi
              </Typography>
              <Typography variant="h3" className="mb-0">
                {school.accreditation.status}
              </Typography>
              <Typography variant="caption" color="muted">
                Skor {school.accreditation.score}
              </Typography>
            </div>
            <div className="rounded-xl border border-primary-700/50 backdrop-blur-sm bg-white/50 p-5 flex flex-col justify-center items-center text-center">
              <Typography variant="overline" color="primary" className="mb-1">
                Program
              </Typography>
              <Typography variant="h3" className="mb-0">
                {isMajorsLoading ? "…" : majors.length}
              </Typography>
              <Typography variant="caption" color="muted">
                Keahlian
              </Typography>
            </div>
            <div className="rounded-xl border border-primary-700/50 backdrop-blur-sm bg-white/50 p-5 flex flex-col justify-center items-center text-center">
              <Typography variant="overline" color="primary" className="mb-1">
                Lokasi
              </Typography>
              <Typography variant="subtitle2" className="mb-0">
                {school.address.city}
              </Typography>
              <Typography variant="caption" color="muted">
                {school.address.province}
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Programs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="mb-8 text-center">
            <Typography variant="overline" color="primary" className="mb-2">
              PROGRAM KEAHLIAN
            </Typography>
            <Typography variant="h3">Pilih Keahlian Masa Depanmu</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isMajorsLoading && (
              <div className="col-span-3 text-center text-muted-foreground">
                Memuat program keahlian…
              </div>
            )}
            {majorsError && (
              <div className="col-span-3 text-center text-red-600">
                Gagal memuat program keahlian
              </div>
            )}
            {!isMajorsLoading &&
              !majorsError &&
              majors.map((m) => (
                <motion.div
                  key={m._id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg border border-primary-700 shadow-primary-500 h-full">
                    <Typography
                      variant="h5"
                      className="mb-2 group-hover:text-primary-600 transition-colors"
                    >
                      {m.name}
                    </Typography>
                    <Typography variant="body2" color="muted" className="mb-4">
                      {(m.description || "").slice(0, 120)}
                      {(m.description || "").length > 120 ? "…" : ""}
                    </Typography>
                    <Button variant="ghost" size="sm" asChild>
                      <span className="flex items-center">
                        <a
                          href={`/academic/majors/${toSlug(m.code || m.name)}`}
                        >
                          Lihat Kurikulum
                        </a>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Facilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-6 text-center">
            <Typography variant="overline" color="primary" className="mb-2">
              FASILITAS
            </Typography>
            <Typography variant="h3">Sarana Belajar Unggulan</Typography>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {school.facilities.map((f, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-700 shadow-primary-500 text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Achievements & Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div>
            <Typography variant="overline" color="primary" className="mb-2">
              PRESTASI
            </Typography>
            <Typography variant="h3" className="mb-4">
              Kebanggaan Sekolah
            </Typography>
            <div className="space-y-4">
              {isAchLoading && (
                <div className="text-muted-foreground">Memuat prestasi…</div>
              )}
              {achError && (
                <div className="text-red-600">Gagal memuat prestasi</div>
              )}
              {!isAchLoading && !achError && achievements.length === 0 && (
                <div className="text-muted-foreground">
                  Belum ada data prestasi
                </div>
              )}
              {!isAchLoading &&
                !achError &&
                achievements.map((a: any, i: number) => (
                  <div
                    key={a._id || i}
                    className="rounded-xl border border-primary-700 shadow-primary-500 p-4"
                  >
                    <Typography variant="subtitle2" className="mb-1">
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {(a.category || "").trim()}
                      {a.category && a.year ? " • " : ""}
                      {(a.year || "").toString()}
                    </Typography>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <Typography variant="overline" color="primary" className="mb-2">
              PENGUMUMAN
            </Typography>
            <Typography variant="h3" className="mb-4">
              Informasi Terbaru
            </Typography>
            <div className="space-y-4">
              {isAnnLoading && (
                <div className="text-muted-foreground">Memuat pengumuman…</div>
              )}
              {annError && (
                <div className="text-red-600">Gagal memuat pengumuman</div>
              )}
              {!isAnnLoading && !annError && announcements.length === 0 && (
                <div className="text-muted-foreground">
                  Belum ada pengumuman
                </div>
              )}
              {!isAnnLoading &&
                !annError &&
                announcements.map((ann: any, i: number) => (
                  <div
                    key={ann._id || i}
                    className="rounded-xl border border-primary-700 shadow-primary-500 p-4"
                  >
                    <a
                      href={`/announcements/${ann._id}`}
                      className="underline decoration-primary-500 underline-offset-4"
                    >
                      <Typography variant="subtitle2" className="mb-1">
                        {ann.title}
                      </Typography>
                    </a>
                    <Typography variant="caption" color="muted">
                      {ann.category} •{" "}
                      {new Date(ann.createdAt).toLocaleDateString("id-ID")}
                    </Typography>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
