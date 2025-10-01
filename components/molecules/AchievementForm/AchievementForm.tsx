"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AchievementFormData {
  title: string;
  category: string;
  year: string;
  description: string;
}

interface AchievementFormProps {
  formData: AchievementFormData;
  onInputChange: (field: keyof AchievementFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitText: string;
  onCancel: () => void;
}

export function AchievementForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText,
  onCancel,
}: AchievementFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Judul Prestasi"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          required
          className="border border-primary-600"
        />
        <Input
          placeholder="Kategori (mis. nasional, kota, sekolah)"
          value={formData.category}
          onChange={(e) => onInputChange("category", e.target.value)}
          className="border border-primary-600"
        />
        <Input
          placeholder="Tahun (mis. 2025)"
          value={formData.year}
          onChange={(e) => onInputChange("year", e.target.value)}
          className="border border-primary-600"
        />
        <Input
          placeholder="Deskripsi"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          className="border border-primary-600"
        />
      </div>
      <div className="flex justify-end sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border border-primary-600"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-950 hover:bg-primary-900 text-white"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitText}
        </Button>
      </div>
    </form>
  );
}
