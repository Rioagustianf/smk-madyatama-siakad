"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import {
  Users,
  Award,
  BookOpen,
  Building2,
  Target,
  Eye,
  Heart,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { school } from "@/lib/school";

const facilities = [
  {
    name: "Laboratorium Komputer",
    description: "Lab komputer modern dengan 40 unit PC terbaru",
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    name: "Workshop Praktik",
    description: "Ruang praktik dengan peralatan industri standar",
    image:
      "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    name: "Perpustakaan Digital",
    description: "Koleksi buku digital dan fisik lebih dari 5000 judul",
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    name: "Aula Serbaguna",
    description: "Ruang pertemuan dan acara dengan kapasitas 500 orang",
    image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    icon: <Users className="w-6 h-6" />,
  },
];

const stats = [
  {
    number: "1200+",
    label: "Total Siswa",
    icon: <Users className="w-8 h-8" />,
  },
  {
    number: "85+",
    label: "Tenaga Pendidik",
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    number: "4",
    label: "Program Keahlian",
    icon: <Award className="w-8 h-8" />,
  },
  {
    number: "25+",
    label: "Tahun Berpengalaman",
    icon: <Star className="w-8 h-8" />,
  },
];

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profil Sekolah"
        subtitle={`Mengenal lebih dekat ${school.name}: sejarah, visi misi, struktur organisasi, dan fasilitas unggulan`}
        breadcrumbs={[{ label: "Profil Sekolah" }]}
        backgroundImage="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg"
      />

      {/* Sejarah Sekolah */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="overline" color="primary" className="mb-4">
                SEJARAH SEKOLAH
              </Typography>
              <Typography variant="h2" className="mb-6">
                Perjalanan {school.name} Menuju Keunggulan
              </Typography>
              <Typography
                variant="body1"
                color="muted"
                className="mb-6 leading-relaxed"
              >
                SMK Madyatama didirikan pada tahun 1998 dengan visi menjadi
                lembaga pendidikan kejuruan terdepan yang menghasilkan lulusan
                berkualitas dan siap kerja. Berawal dari sebuah sekolah dengan 3
                program keahlian, kini berkembang menjadi institusi yang diakui
                dan dipercaya masyarakat.
              </Typography>
              <Typography
                variant="body1"
                color="muted"
                className="mb-8 leading-relaxed"
              >
                Dengan komitmen terhadap inovasi dan kualitas pendidikan, SMK
                Madyatama terus mengembangkan kurikulum yang relevan dengan
                kebutuhan industri dan teknologi terkini.
              </Typography>
              <Button variant="gradient" size="lg">
                Pelajari Lebih Lanjut
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg"
                  alt="Sejarah SMK SIAKAD"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Typography variant="h4" color="white" className="mb-2">
                    25+ Tahun
                  </Typography>
                  <Typography variant="body2" className="text-white/80">
                    Mengabdi untuk Pendidikan
                  </Typography>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="overline" color="primary" className="mb-4">
              VISI & MISI
            </Typography>
            <Typography variant="h2" className="mb-6">
              Landasan Filosofi Kami
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-primary-600" />
                </div>
                <Typography variant="h3" color="primary">
                  Visi
                </Typography>
              </div>
              <Typography
                variant="body1"
                color="muted"
                className="leading-relaxed"
              >
                Menjadi Sekolah Menengah Kejuruan yang unggul, inovatif, dan
                berkarakter, menghasilkan lulusan yang kompeten, berjiwa
                entrepreneur, dan siap bersaing di era global dengan tetap
                menjunjung tinggi nilai-nilai Pancasila.
              </Typography>
            </motion.div>

            {/* Misi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-secondary-600" />
                </div>
                <Typography variant="h3" color="secondary">
                  Misi
                </Typography>
              </div>
              <ul className="space-y-3">
                {[
                  "Menyelenggarakan pendidikan kejuruan yang berkualitas dan relevan",
                  "Mengembangkan kurikulum yang adaptif terhadap perkembangan teknologi",
                  "Membangun kemitraan strategis dengan dunia usaha dan industri",
                  "Membentuk karakter siswa yang berakhlak mulia dan berjiwa entrepreneur",
                  "Menciptakan lingkungan belajar yang kondusif dan inovatif",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Heart className="w-4 h-4 text-accent-500 mr-3 mt-1 flex-shrink-0" />
                    <Typography variant="body2" color="muted">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="overline" color="primary" className="mb-4">
              STRUKTUR ORGANISASI
            </Typography>
            <Typography variant="h2" className="mb-6">
              Tata Kelola Sekolah
            </Typography>
            <Typography
              variant="body1"
              color="muted"
              className="max-w-3xl mx-auto"
            >
              Struktur organisasi SMK Madyatama yang mendukung tata kelola
              pendidikan yang efektif.
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { role: "Kepala Sekolah", name: "Drs. Bambang Setiawan" },
              { role: "Wakil Kurikulum", name: "Siti Andayani, S.Kom" },
              { role: "Wakil Kesiswaan", name: "Agus Priyanto, S.Pd" },
              { role: "Wakil Sarpras", name: "Rina Amelia, S.Sn" },
            ].map((person, idx) => (
              <motion.div
                key={person.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-primary-100 text-center shadow"
              >
                <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4" />
                <Typography variant="subtitle2" className="mb-1">
                  {person.role}
                </Typography>
                <Typography variant="body2" color="muted">
                  {person.name}
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="overline" color="primary" className="mb-4">
              STATISTIK SEKOLAH
            </Typography>
            <Typography variant="h2" className="mb-6">
              Pencapaian dalam Angka
            </Typography>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {stat.icon}
                </div>
                <Typography variant="h2" color="primary" className="mb-2">
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="muted">
                  {stat.label}
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="section-padding bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="overline" color="primary" className="mb-4">
              FASILITAS UNGGULAN
            </Typography>
            <Typography variant="h2" className="mb-6">
              Sarana Pembelajaran Modern
            </Typography>
            <Typography
              variant="body1"
              color="muted"
              className="max-w-3xl mx-auto"
            >
              Fasilitas lengkap dan modern untuk mendukung proses pembelajaran
              yang optimal dan mempersiapkan siswa menghadapi tantangan dunia
              kerja.
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-primary-600">
                        {facility.icon}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <Typography
                      variant="h5"
                      className="mb-3 group-hover:text-primary-600 transition-colors"
                    >
                      {facility.name}
                    </Typography>
                    <Typography variant="body2" color="muted">
                      {facility.description}
                    </Typography>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="overline" color="primary" className="mb-4">
                HUBUNGI KAMI
              </Typography>
              <Typography variant="h2" className="mb-6">
                Informasi Kontak
              </Typography>
              <Typography variant="body1" color="muted" className="mb-8">
                Untuk informasi lebih lanjut tentang {school.name}, jangan ragu
                untuk menghubungi kami.
              </Typography>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="mb-1">
                      Alamat
                    </Typography>
                    <Typography variant="body2" color="muted">
                      {school.address.street}, {school.address.kelurahan},{" "}
                      {school.address.kecamatan}, {school.address.city},{" "}
                      {school.address.province}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="mb-1">
                      Telepon
                    </Typography>
                    <Typography variant="body2" color="muted">
                      {school.contact.phone}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="mb-1">
                      Email
                    </Typography>
                    <Typography variant="body2" color="muted">
                      {school.contact.email}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="mb-1">
                      Media Sosial
                    </Typography>
                    <div className="flex gap-4">
                      <a
                        href={school.contact.instagram}
                        className="text-primary-600 underline"
                      >
                        Instagram
                      </a>
                      <a
                        href={school.contact.facebook}
                        className="text-primary-600 underline"
                      >
                        Facebook
                      </a>
                      <a
                        href={school.contact.youtube}
                        className="text-primary-600 underline"
                      >
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg"
                  alt="Gedung SMK SIAKAD"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
