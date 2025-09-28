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
  facilities: string[];
  careerProspects: string[];
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
        />
        <Input
          placeholder="Deskripsi Program"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          className="border border-primary-600"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Fasilitas (pisahkan dengan koma)
          </label>
          <Textarea
            placeholder="Lab Komputer, Perpustakaan, Workshop, dll..."
            value={formData.facilities.join(", ")}
            onChange={(e) =>
              onInputChange(
                "facilities",
                e.target.value.split(", ").filter((item) => item.trim())
              )
            }
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
            value={formData.careerProspects.join(", ")}
            onChange={(e) =>
              onInputChange(
                "careerProspects",
                e.target.value.split(", ").filter((item) => item.trim())
              )
            }
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
