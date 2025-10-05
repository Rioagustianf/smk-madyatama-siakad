"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface InternshipFormData {
  program: string;
  period?: string;
  notes?: string;
}

interface InternshipFormProps {
  formData: InternshipFormData;
  onInputChange: (field: keyof InternshipFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
}

export default function InternshipForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isLoading,
  submitText = "Simpan",
}: InternshipFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nama Program</label>
        <Input
          value={formData.program}
          onChange={(e) => onInputChange("program", e.target.value)}
          placeholder="Contoh: Prakerin RPL - PT Teknologi"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Periode</label>
        <Input
          value={formData.period || ""}
          onChange={(e) => onInputChange("period", e.target.value)}
          placeholder="Contoh: Mei - Juli 2025"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Keterangan</label>
        <Input
          value={formData.notes || ""}
          onChange={(e) => onInputChange("notes", e.target.value)}
          placeholder="Contoh: Batch 1"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
}
