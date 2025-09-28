"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface AnnouncementFormData {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: "academic" | "general" | "exam" | "event";
  priority: "low" | "medium" | "high";
  isPublished: boolean;
}

interface AnnouncementFormProps {
  formData: AnnouncementFormData;
  onInputChange: (field: keyof AnnouncementFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export function AnnouncementForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
}: AnnouncementFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Judul"
        value={formData.title}
        onChange={(e) => onInputChange("title", e.target.value)}
        required
      />
      <Textarea
        placeholder="Konten pengumuman"
        value={formData.content}
        onChange={(e) => onInputChange("content", e.target.value)}
        rows={4}
        required
      />
      <Input
        placeholder="Excerpt (opsional)"
        value={formData.excerpt}
        onChange={(e) => onInputChange("excerpt", e.target.value)}
      />
      <Input
        placeholder="URL Gambar (opsional)"
        value={formData.image}
        onChange={(e) => onInputChange("image", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={formData.category}
          onValueChange={(value) => onInputChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Akademik</SelectItem>
            <SelectItem value="general">Umum</SelectItem>
            <SelectItem value="exam">Ujian</SelectItem>
            <SelectItem value="event">Acara</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={formData.priority}
          onValueChange={(value) => onInputChange("priority", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Rendah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="high">Tinggi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => onInputChange("isPublished", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isPublished" className="text-sm">
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
