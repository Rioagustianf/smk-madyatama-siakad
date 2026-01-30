"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { debugLog } from "@/lib/utils/debug";

interface MajorFormData {
  name: string;
  code: string;
  description: string;
  image: string;
  facilities: string;
  careerProspects: string;
  headName: string;
  headPhoto: string;
  vision: string;
  mission: string;
}

interface MajorFormProps {
  formData: MajorFormData;
  onInputChange: (field: string, value: string | string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitText: string;
  onCancel: () => void;
}

export function MajorForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText,
  onCancel,
}: MajorFormProps) {
  useEffect(() => {
    debugLog("MajorForm received formData", formData);
  }, [formData]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Nama Program Keahlian"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          required
          className="border border-primary-600"
        />
        <Input
          placeholder="Kode Program (rpl/tkj/...)"
          value={formData.code}
          onChange={(e) => onInputChange("code", e.target.value)}
          required
          className="border border-primary-600"
        />
        <ImageUpload
          value={formData.image}
          onChange={(value) => onInputChange("image", value)}
          label="Gambar Program Keahlian"
          placeholder="Pilih gambar atau masukkan URL"
          storagePath="majors"
        />
        <Input
          placeholder="Deskripsi Program"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          className="border border-primary-600"
        />

        {/* Ketua Program Studi Section */}
        <div className="space-y-3 border-t pt-4 mt-2">
          <h3 className="font-semibold text-sm text-gray-700">
            Informasi Ketua Program Studi
          </h3>
          <Input
            placeholder="Nama Ketua Program Studi"
            value={formData.headName}
            onChange={(e) => onInputChange("headName", e.target.value)}
            className="border border-primary-600"
          />
          <ImageUpload
            value={formData.headPhoto}
            onChange={(value) => onInputChange("headPhoto", value)}
            label="Foto Ketua Program Studi"
            placeholder="Pilih foto atau masukkan URL"
            storagePath="majors/heads"
          />
        </div>

        {/* Visi & Misi Section */}
        <div className="space-y-3 border-t pt-4 mt-2">
          <h3 className="font-semibold text-sm text-gray-700">Visi & Misi</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Visi Program Studi
            </label>
            <Textarea
              placeholder="Contoh: Menjadi program studi unggulan di bidang..."
              value={formData.vision}
              onChange={(e) => onInputChange("vision", e.target.value)}
              rows={4}
              className="border border-primary-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Misi Program Studi
            </label>
            <Textarea
              placeholder="Contoh: 1. Menyelenggarakan pendidikan berkualitas&#10;2. Mengembangkan..."
              value={formData.mission}
              onChange={(e) => onInputChange("mission", e.target.value)}
              rows={5}
              className="border border-primary-600"
            />
          </div>
        </div>

        {/* Fasilitas & Prospek Karir */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Fasilitas (pisahkan dengan koma)
          </label>
          <Textarea
            placeholder="Lab Komputer, Perpustakaan, Workshop, dll..."
            value={formData.facilities}
            onChange={(e) => onInputChange("facilities", e.target.value)}
            rows={3}
            className="border border-primary-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Prospek Karir (pisahkan dengan koma)
          </label>
          <Textarea
            placeholder="Software Developer, Network Administrator, dll..."
            value={formData.careerProspects}
            onChange={(e) => onInputChange("careerProspects", e.target.value)}
            rows={3}
            className="border border-primary-600"
          />
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
