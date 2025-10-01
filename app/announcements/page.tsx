"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { Search, Filter, Calendar, Bell } from "lucide-react";
import bgHeaderAnnouncements from "@/public/assets/bg-pengumuman.jpeg";

// Data contoh sesuai kebutuhan client
const announcements = [
  {
    id: "1",
    title: "Jadwal Ujian Tengah Semester Ganjil 2024/2025",
    excerpt:
      "Jadwal ujian tengah semester untuk semua program keahlian telah ditetapkan. Siswa diharapkan mempersiapkan diri dengan baik.",
    image:
      "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg",
    category: "exam" as const,
    priority: "high" as const,
    publishedAt: new Date("2024-01-15"),
    href: "/announcements/1",
  },
  {
    id: "2",
    title: "Libur Semester Ganjil dan Jadwal Masuk Semester Genap",
    excerpt:
      "Libur semester dimulai tanggal 20 Desember 2024 dan masuk kembali pada 6 Januari 2025.",
    image: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
    category: "general" as const,
    priority: "medium" as const,
    publishedAt: new Date("2024-01-12"),
    href: "/announcements/2",
  },
  {
    id: "3",
    title: "Pembagian Rapor Semester Ganjil 2024/2025",
    excerpt:
      "Pembagian rapor dilaksanakan pada 19 Desember 2024 di masing-masing wali kelas.",
    category: "academic" as const,
    priority: "medium" as const,
    publishedAt: new Date("2024-01-10"),
    href: "/announcements/3",
  },
  {
    id: "4",
    title: "Pendaftaran Ekstrakurikuler Semester Genap 2024/2025",
    excerpt:
      "Dibuka pendaftaran untuk berbagai kegiatan ekstrakurikuler. Jangan lewatkan kesempatan untuk mengembangkan bakat dan minat.",
    image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    category: "event" as const,
    priority: "low" as const,
    publishedAt: new Date("2024-01-08"),
    href: "/announcements/4",
  },
  {
    id: "5",
    title: "Libur Semester dan Jadwal Masuk Semester Baru",
    excerpt:
      "Informasi mengenai jadwal libur semester dan persiapan untuk semester baru. Siswa diharapkan memperhatikan jadwal yang telah ditetapkan.",
    category: "academic" as const,
    priority: "high" as const,
    publishedAt: new Date("2024-01-05"),
    href: "/announcements/5",
  },
  {
    id: "6",
    title: "Kunjungan Industri Program Keahlian Multimedia",
    excerpt:
      "Siswa program keahlian Multimedia akan melaksanakan kunjungan industri ke beberapa perusahaan media dan advertising terkemuka.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    category: "academic" as const,
    priority: "medium" as const,
    publishedAt: new Date("2024-01-03"),
    href: "/announcements/6",
  },
];

const categories = [
  { value: "all", label: "Semua Kategori" },
  { value: "academic", label: "Akademik" },
  { value: "general", label: "Umum" },
  { value: "exam", label: "Ujian" },
  { value: "event", label: "Acara" },
];

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredAnnouncements, setFilteredAnnouncements] =
    useState(announcements);

  React.useEffect(() => {
    let filtered = announcements;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (announcement) => announcement.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div>
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi terkini dan pengumuman penting dari SMK SIAKAD"
        breadcrumbs={[{ label: "Pengumuman" }]}
        backgroundImage={bgHeaderAnnouncements}
      />

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-primary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none bg-white min-w-48"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <Typography variant="body1" color="muted">
              Menampilkan {filteredAnnouncements.length} pengumuman
              {selectedCategory !== "all" &&
                ` dalam kategori "${
                  categories.find((c) => c.value === selectedCategory)?.label
                }"`}
            </Typography>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Diurutkan berdasarkan tanggal terbaru</span>
            </div>
          </motion.div>

          {/* Announcements Grid */}
          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col group">
                    {announcement.image && (
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={announcement.image || "/placeholder.svg"}
                          alt={announcement.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              announcement.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : announcement.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {announcement.priority === "high"
                              ? "Penting"
                              : announcement.priority === "medium"
                              ? "Sedang"
                              : "Biasa"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
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
                          {announcement.category === "academic"
                            ? "Akademik"
                            : announcement.category === "exam"
                            ? "Ujian"
                            : announcement.category === "event"
                            ? "Acara"
                            : "Umum"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {announcement.publishedAt.toLocaleDateString("id-ID")}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {announcement.excerpt}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-white transition-colors bg-transparent"
                        asChild
                      >
                        <a href={announcement.href}>Baca Selengkapnya</a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <Typography variant="h4" color="muted" className="mb-4">
                Tidak ada pengumuman ditemukan
              </Typography>
              <Typography variant="body1" color="muted" className="mb-8">
                Coba ubah kata kunci pencarian atau filter kategori
              </Typography>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filter
              </Button>
            </motion.div>
          )}

          {/* Load More Button */}
          {filteredAnnouncements.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg">
                Muat Lebih Banyak
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
