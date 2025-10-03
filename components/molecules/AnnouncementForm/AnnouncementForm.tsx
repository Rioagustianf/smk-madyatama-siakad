"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Image as ImageIcon, Settings } from "lucide-react";

const announcementSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  excerpt: z.string().min(1, "Ringkasan wajib diisi"),
  content: z.string().min(1, "Konten wajib diisi"),
  category: z.enum(["academic", "general", "exam", "event"], {
    required_error: "Kategori wajib dipilih",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Prioritas wajib dipilih",
  }),
  image: z.string().optional(),
  publishedAt: z.string().min(1, "Tanggal publikasi wajib diisi"),
  isPublished: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  initialData?: Partial<AnnouncementFormData>;
  onSubmit: (data: AnnouncementFormData) => void;
  isLoading?: boolean;
}

const categoryOptions = [
  { value: "academic", label: "Akademik" },
  { value: "general", label: "Umum" },
  { value: "exam", label: "Ujian" },
  { value: "event", label: "Acara" },
];

const priorityOptions = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
];

export function AnnouncementForm({
  initialData,
  onSubmit,
  isLoading = false,
}: AnnouncementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "general",
      priority: initialData?.priority || "medium",
      image: initialData?.image || "",
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      isPublished: initialData?.isPublished ?? true,
    },
  });

  const watchedImage = watch("image");
  const watchedIsPublished = watch("isPublished");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informasi Dasar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informasi Dasar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Pengumuman *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Masukkan judul pengumuman yang menarik"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan Pengumuman *</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Masukkan ringkasan singkat yang akan ditampilkan di kartu pengumuman"
              rows={3}
              className={errors.excerpt ? "border-red-500" : ""}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500 mt-1">
                {errors.excerpt.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Ringkasan ini akan muncul di halaman utama pengumuman
            </p>
          </div>

          <div>
            <Label htmlFor="content">Konten Lengkap *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Masukkan konten lengkap pengumuman dengan detail yang diperlukan"
              rows={8}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Konten ini akan ditampilkan di halaman detail pengumuman
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gambar Pengumuman */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Gambar Pengumuman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="image">Upload Gambar (Opsional)</Label>
            <ImageUpload
              value={watchedImage || ""}
              onChange={(url) => setValue("image", url)}
              maxSizeMB={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              Gambar akan ditampilkan di kartu pengumuman. Maksimal 5MB. Format:
              JPG, PNG, WebP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kategori & Prioritas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Kategori & Prioritas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Pilih kategori pengumuman" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Kategori akan ditampilkan sebagai badge di kartu pengumuman
            </p>
          </div>

          <div>
            <Label htmlFor="priority">Prioritas *</Label>
            <Select
              value={watch("priority")}
              onValueChange={(value) => setValue("priority", value as any)}
            >
              <SelectTrigger
                className={errors.priority ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Pilih tingkat prioritas" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500 mt-1">
                {errors.priority.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Prioritas tinggi akan ditampilkan dengan badge merah
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pengaturan Publikasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Pengaturan Publikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="publishedAt">Tanggal & Waktu Publikasi *</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              {...register("publishedAt")}
              className={errors.publishedAt ? "border-red-500" : ""}
            />
            {errors.publishedAt && (
              <p className="text-sm text-red-500 mt-1">
                {errors.publishedAt.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Tanggal ini akan ditampilkan di kartu pengumuman
            </p>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Switch
              id="isPublished"
              checked={watchedIsPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="isPublished" className="text-sm font-medium">
                Publikasikan Sekarang
              </Label>
              <p className="text-xs text-gray-500">
                {watchedIsPublished
                  ? "Pengumuman akan langsung terlihat di halaman publik"
                  : "Pengumuman akan disimpan sebagai draft"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </div>
          ) : (
            "Simpan Pengumuman"
          )}
        </Button>
      </div>
    </form>
  );
}
