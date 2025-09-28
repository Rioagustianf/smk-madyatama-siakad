"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface GalleryFormData {
  title: string;
  description: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

interface GalleryFormProps {
  formData: GalleryFormData;
  onInputChange: (field: keyof GalleryFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export function GalleryForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
}: GalleryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Judul"
        value={formData.title}
        onChange={(e) => onInputChange("title", e.target.value)}
        required
      />
      <Textarea
        placeholder="Deskripsi (opsional)"
        value={formData.description}
        onChange={(e) => onInputChange("description", e.target.value)}
        rows={3}
      />
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="URL Media"
          value={formData.url}
          onChange={(e) => onInputChange("url", e.target.value)}
          required
        />
        <Input
          placeholder="URL Thumbnail (opsional)"
          value={formData.thumbnail}
          onChange={(e) => onInputChange("thumbnail", e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) => onInputChange("category", e.target.value)}
        />
        <Input
          placeholder="Tipe (image/video)"
          value={formData.type}
          onChange={(e) => onInputChange("type", e.target.value as any)}
        />
      </div>
      <Input
        placeholder="Tag (pisahkan dengan koma)"
        value={formData.tags.join(", ")}
        onChange={(e) =>
          onInputChange(
            "tags",
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublishedGallery"
          checked={formData.isPublished}
          onChange={(e) => onInputChange("isPublished", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isPublishedGallery" className="text-sm">
          Publikasikan sekarang
        </label>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
