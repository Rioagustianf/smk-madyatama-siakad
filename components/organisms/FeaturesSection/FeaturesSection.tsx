"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { school } from "@/lib/school";
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
  return (
    <section id="fitur" className="section-padding bg-white">
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
                {school.programs.length}
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
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="mb-8 text-center">
            <Typography variant="overline" color="primary" className="mb-2">
              PROGRAM KEAHLIAN
            </Typography>
            <Typography variant="h3">Pilih Keahlian Masa Depanmu</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {school.programs.map((p) => (
              <motion.div
                key={p.slug}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg border border-primary-700 shadow-primary-500 h-full">
                  <Typography
                    variant="h5"
                    className="mb-2 group-hover:text-primary-600 transition-colors"
                  >
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="muted" className="mb-4">
                    Kurikulum aplikatif, praktik industri, dan pembimbing
                    berpengalaman.
                  </Typography>
                  <Button variant="ghost" size="sm" asChild>
                    <span className="flex items-center">
                      <a href={`/academic/majors#${p.slug}`}>Lihat Kurikulum</a>
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

        {/* Achievements & News */}
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
              {school.achievements.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-primary-700 shadow-primary-500 p-4"
                >
                  <Typography variant="subtitle2" className="mb-1">
                    {a.title}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    Tingkat {a.level} • Peringkat {a.rank}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Typography variant="overline" color="primary" className="mb-2">
              BERITA
            </Typography>
            <Typography variant="h3" className="mb-4">
              Kabar Terbaru
            </Typography>
            <div className="space-y-4">
              {school.news_samples.map((n, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-primary-700 shadow-primary-500 p-4"
                >
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-primary-500 underline-offset-4"
                  >
                    <Typography variant="subtitle2" className="mb-1">
                      {n.title}
                    </Typography>
                  </a>
                  <Typography variant="caption" color="muted">
                    {n.source} • {n.date}
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
