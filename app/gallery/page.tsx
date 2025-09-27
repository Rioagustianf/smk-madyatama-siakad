"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import {
  Camera,
  Video,
  X,
  Play,
  Calendar,
  Eye,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";

// Mock data - in real app, this would come from API
const galleryItems = [
  {
    id: "1",
    title: "Upacara Bendera Hari Senin",
    description:
      "Kegiatan rutin upacara bendera yang dilaksanakan setiap hari Senin",
    type: "image" as const,
    url: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    category: "academic",
    date: new Date("2024-01-15"),
    views: 245,
  },
  {
    id: "2",
    title: "Praktik Lab Komputer TKJ",
    description: "Siswa TKJ sedang melakukan praktik konfigurasi jaringan",
    type: "image" as const,
    url: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    category: "academic",
    date: new Date("2024-01-12"),
    views: 189,
  },
  {
    id: "3",
    title: "Workshop Programming RPL",
    description: "Video dokumentasi workshop pengembangan aplikasi mobile",
    type: "video" as const,
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    category: "academic",
    date: new Date("2024-01-10"),
    views: 312,
  },
  {
    id: "4",
    title: "Lomba Desain Grafis",
    description:
      "Kompetisi desain grafis antar siswa program keahlian Multimedia",
    type: "image" as const,
    url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    category: "competition",
    date: new Date("2024-01-08"),
    views: 156,
  },
  {
    id: "5",
    title: "Ekstrakurikuler Paskibra",
    description:
      "Latihan rutin ekstrakurikuler Paskibra (Pasukan Pengibar Bendera)",
    type: "image" as const,
    url: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
    category: "extracurricular",
    date: new Date("2024-01-05"),
    views: 203,
  },
  {
    id: "6",
    title: "Fasilitas Perpustakaan",
    description: "Suasana perpustakaan sekolah yang nyaman untuk belajar",
    type: "image" as const,
    url: "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg",
    category: "facility",
    date: new Date("2024-01-03"),
    views: 178,
  },
  {
    id: "7",
    title: "Prestasi Juara Nasional",
    description: "Dokumentasi penerimaan penghargaan juara nasional lomba IT",
    type: "video" as const,
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    category: "achievement",
    date: new Date("2024-01-01"),
    views: 445,
  },
  {
    id: "8",
    title: "Kunjungan Industri",
    description: "Siswa berkunjung ke perusahaan teknologi terkemuka",
    type: "image" as const,
    url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    thumbnail:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    category: "academic",
    date: new Date("2023-12-28"),
    views: 267,
  },
];

const categories = [
  { value: "all", label: "Semua Kategori" },
  { value: "academic", label: "Akademik" },
  { value: "extracurricular", label: "Ekstrakurikuler" },
  { value: "achievement", label: "Prestasi" },
  { value: "facility", label: "Fasilitas" },
  { value: "competition", label: "Kompetisi" },
];

const viewModes = [
  { value: "grid", label: "Grid", icon: <Grid3X3 className="w-4 h-4" /> },
  { value: "list", label: "List", icon: <List className="w-4 h-4" /> },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItem, setSelectedItem] = useState<
    (typeof galleryItems)[0] | null
  >(null);
  const [filteredItems, setFilteredItems] = useState(galleryItems);

  React.useEffect(() => {
    let filtered = galleryItems;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [selectedCategory]);

  const openModal = (item: (typeof galleryItems)[0]) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <PageHeader
        title="Galeri"
        subtitle="Dokumentasi kegiatan dan momen bersejarah SMK Madyatama"
        breadcrumbs={[{ label: "Galeri" }]}
        backgroundImage="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Filter and View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category.value
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                {viewModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === mode.value
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={mode.label}
                  >
                    {mode.icon}
                  </button>
                ))}
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
              Menampilkan {filteredItems.length} item
              {selectedCategory !== "all" &&
                ` dalam kategori "${
                  categories.find((c) => c.value === selectedCategory)?.label
                }"`}
            </Typography>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Camera className="w-4 h-4" />
                <span>
                  {filteredItems.filter((item) => item.type === "image").length}{" "}
                  Foto
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>
                  {filteredItems.filter((item) => item.type === "video").length}{" "}
                  Video
                </span>
              </div>
            </div>
          </motion.div>

          {/* Gallery Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.type === "video" ? (
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-primary-600 ml-1" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <Eye className="w-8 h-8 text-primary-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "video"
                              ? "bg-red-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {item.type === "video" ? "Video" : "Foto"}
                        </div>
                      </div>

                      {/* Views */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <Typography
                        variant="subtitle2"
                        className="mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
                      >
                        {item.title}
                      </Typography>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date.toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <div className="flex">
                    <div className="relative w-48 h-32 flex-shrink-0">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {item.type === "video" && (
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Typography
                          variant="h5"
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.title}
                        </Typography>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "video"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.type === "video" ? "Video" : "Foto"}
                        </div>
                      </div>

                      <Typography
                        variant="body2"
                        color="muted"
                        className="mb-4"
                      >
                        {item.description}
                      </Typography>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.date.toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button */}
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
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Media */}
              <div className="relative aspect-video">
                {selectedItem.type === "video" ? (
                  <video
                    src={selectedItem.url}
                    controls
                    className="w-full h-full object-cover"
                    autoPlay
                  />
                ) : (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Typography variant="h4" className="mb-2">
                      {selectedItem.title}
                    </Typography>
                    <Typography variant="body1" color="muted">
                      {selectedItem.description}
                    </Typography>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedItem.type === "video"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedItem.type === "video" ? "Video" : "Foto"}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedItem.date.toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedItem.views} views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
