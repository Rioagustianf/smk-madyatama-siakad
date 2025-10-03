"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { Search, Filter, Calendar, Bell } from "lucide-react";
import { useAnnouncements } from "@/lib/hooks/use-announcements";
import bgHeaderAnnouncements from "@/public/assets/bg-pengumuman.jpeg";
import Image from "next/image";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: "academic" | "general" | "exam" | "event";
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  publishedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const categoryLabels = {
  academic: "Akademik",
  general: "Umum",
  exam: "Ujian",
  event: "Acara",
};

const priorityLabels = {
  low: "Biasa",
  medium: "Sedang",
  high: "Penting",
};

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

  const { data, isLoading } = useAnnouncements({
    search: searchTerm,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    isPublished: true,
    page: 1,
    limit: 50,
  });

  const announcements: Announcement[] = (data as any)?.data || [];

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
              {isLoading
                ? "Memuat..."
                : `Menampilkan ${announcements.length} pengumuman`}
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
          {!isLoading && announcements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col group">
                    {announcement.image && (
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <Image
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
                            {priorityLabels[announcement.priority]}
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
                          {categoryLabels[announcement.category]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(
                            announcement.publishedAt || announcement.createdAt
                          )}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {announcement.excerpt}
                      </p>

                      <Button
                        size="sm"
                        className="w-full bg-primary-950 hover:bg-primary-900 group-hover:text-white transition-colors"
                        asChild
                      >
                        <a href={`/announcements/${announcement._id}`}>
                          Baca Selengkapnya
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 h-full animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
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
          {!isLoading && announcements.length > 0 && (
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
