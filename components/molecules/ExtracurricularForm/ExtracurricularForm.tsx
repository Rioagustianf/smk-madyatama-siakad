"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/molecules/ImageUpload/ImageUpload";

export interface ExtracurricularFormData {
  name: string;
  description: string;
  image: string;
  coach: string;
  trainer: string;
  scheduleDay: string;
  scheduleTime: string;
}

interface ExtracurricularFormProps {
  formData: ExtracurricularFormData;
  onInputChange: (field: keyof ExtracurricularFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitText: string;
  onCancel: () => void;
}

export function ExtracurricularForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText,
  onCancel,
}: ExtracurricularFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Nama Ekstrakurikuler *</Label>
          <Input
            placeholder="Contoh: Pramuka"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            required
            className="border border-primary-600"
          />
        </div>

        <ImageUpload
          value={formData.image}
          onChange={(value) => onInputChange("image", value)}
          label="Foto Ekstrakurikuler"
          placeholder="Upload atau masukkan URL gambar"
          disabled={isLoading}
          storagePath="extracurriculars"
        />

        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea
            placeholder="Deskripsi lengkap kegiatan ekstrakurikuler..."
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            className="border border-primary-600 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pembina</Label>
            <Input
              placeholder="Nama pembina"
              value={formData.coach}
              onChange={(e) => onInputChange("coach", e.target.value)}
              className="border border-primary-600"
            />
          </div>
          <div className="space-y-2">
            <Label>Pelatih</Label>
            <Input
              placeholder="Nama pelatih"
              value={formData.trainer}
              onChange={(e) => onInputChange("trainer", e.target.value)}
              className="border border-primary-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hari Latihan</Label>
            <Input
              placeholder="Contoh: Senin, Rabu"
              value={formData.scheduleDay}
              onChange={(e) => onInputChange("scheduleDay", e.target.value)}
              className="border border-primary-600"
            />
          </div>
          <div className="space-y-2">
            <Label>Jam Latihan</Label>
            <Input
              placeholder="Contoh: 15:00 - 17:00"
              value={formData.scheduleTime}
              onChange={(e) => onInputChange("scheduleTime", e.target.value)}
              className="border border-primary-600"
            />
          </div>
        </div>
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
