"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface StaffFormData {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  education: string;
  experience: number;
  certifications: string[];
  isActive: boolean;
}

interface StaffFormProps {
  formData: StaffFormData;
  onInputChange: (field: keyof StaffFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export function StaffForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
}: StaffFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Nama"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          required
        />
        <Input
          placeholder="Jabatan"
          value={formData.position}
          onChange={(e) => onInputChange("position", e.target.value)}
          required
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Departemen"
          value={formData.department}
          onChange={(e) => onInputChange("department", e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="No. Telepon"
          value={formData.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
        />
        <Input
          placeholder="URL Foto"
          value={formData.image}
          onChange={(e) => onInputChange("image", e.target.value)}
        />
      </div>
      <Textarea
        placeholder="Bio singkat"
        value={formData.bio}
        onChange={(e) => onInputChange("bio", e.target.value)}
        rows={4}
      />
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          placeholder="Pendidikan"
          value={formData.education}
          onChange={(e) => onInputChange("education", e.target.value)}
        />
        <Input
          placeholder="Pengalaman (tahun)"
          type="number"
          value={formData.experience}
          onChange={(e) => onInputChange("experience", Number(e.target.value))}
          min={0}
        />
      </div>
      <Input
        placeholder="Sertifikasi (pisahkan dengan koma)"
        value={formData.certifications.join(", ")}
        onChange={(e) =>
          onInputChange(
            "certifications",
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
