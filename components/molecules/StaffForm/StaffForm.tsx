"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "../ImageUpload/ImageUpload";

export interface StaffFormData {
  name: string;
  role:
    | "headmaster"
    | "vice-headmaster"
    | "wks-kurikulum"
    | "wks-kesiswaan"
    | "wks-sarpras"
    | "wks-humas"
    | "kepala-program"
    | "kepala-tu"
    | "teacher"
    | "admin"
    | "staff"
    | "other";
  position: string;
  image: string;
  bio: string;
  isActive: boolean;
  subject?: string; // for teacher
  quote?: string; // for headmaster
  order?: number; // display order (ascending)
}

interface StaffFormProps {
  formData: StaffFormData;
  onInputChange: (field: keyof StaffFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;

  submitText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Role = Level organisasi (disatukan)
const ROLE_OPTIONS = [
  { value: "headmaster", label: "Pimpinan Sekolah - Kepala Sekolah" },
  { value: "vice-headmaster", label: "Wakil Kepala Sekolah" },
  { value: "wks-kurikulum", label: "WKS Bidang Kurikulum" },
  { value: "wks-kesiswaan", label: "WKS Bidang Kesiswaan" },
  { value: "wks-sarpras", label: "WKS Bidang Sarana & Prasarana" },
  { value: "wks-humas", label: "WKS Humas / Hubungan Industri (DU/DI)" },
  { value: "kepala-program", label: "Kepala Program Keahlian / Kompetensi" },
  { value: "kepala-tu", label: "Kepala Tata Usaha" },
  { value: "teacher", label: "Guru (Tenaga Pendidik)" },
  { value: "staff", label: "Staf / Bagian Pendukung" },
  { value: "admin", label: "Administrator" },
  { value: "other", label: "Lainnya" },
];

export function StaffForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
}: StaffFormProps) {
  const isHeadmaster = formData.role === "headmaster";
  const isTeacher = formData.role === "teacher";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <Input
            placeholder="Nama beserta gelar"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Level / Role Organisasi</Label>
          <Select
            value={formData.role}
            onValueChange={(v) => onInputChange("role", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih level/role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Jabatan / Unit</Label>
          <Input
            placeholder="Mis. WKS Kurikulum, Kepala TU, Koordinator RPL"
            value={formData.position}
            onChange={(e) => onInputChange("position", e.target.value)}
            required
          />
        </div>
        {isTeacher && (
          <div className="space-y-2">
            <Label>Mata Pelajaran (Guru)</Label>
            <Input
              placeholder="Mis. Produktif RPL"
              value={formData.subject || ""}
              onChange={(e) => onInputChange("subject", e.target.value)}
            />
          </div>
        )}
      </div>

      {isHeadmaster && (
        <div className="space-y-2">
          <Label>Kutipan (Kepala Sekolah)</Label>
          <Input
            placeholder="Kutipan singkat untuk ditampilkan di publik"
            value={formData.quote || ""}
            onChange={(e) => onInputChange("quote", e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Foto</Label>
        <ImageUpload
          value={formData.image || ""}
          onChange={(v) => onInputChange("image", v)}
          maxSizeMB={5}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Urutan Tampil</Label>
          <Input
            placeholder="0"
            type="number"
            value={typeof formData.order === "number" ? formData.order : 0}
            onChange={(e) => onInputChange("order", Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bio Singkat</Label>
        <Textarea
          placeholder="Tuliskan bio singkat (opsional)"
          value={formData.bio}
          onChange={(e) => onInputChange("bio", e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => onInputChange("isActive", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm">
          Aktif
        </label>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            className="border border-primary-600"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}
        <Button
          className="bg-primary-950 text-white hover:bg-primary-900"
          type="submit"
          disabled={isLoading}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}
