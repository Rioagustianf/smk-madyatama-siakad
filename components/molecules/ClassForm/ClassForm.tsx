"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface ClassFormData {
  name: string;
  majorId?: string;
  homeroomTeacherId?: string;
  isActive?: boolean;
}

interface Major {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  education?: string;
}

interface ClassFormProps {
  formData: ClassFormData;
  onInputChange: (field: keyof ClassFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
  majors?: Major[];
  teachers?: Teacher[];
}

export default function ClassForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading = false,
  submitText = "Simpan",
  onCancel,
  majors = [],
  teachers = [],
}: ClassFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Kelas *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="Contoh: 12 TKJ 1"
          required
          className="border border-primary-600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="majorId">Jurusan</Label>
        <Select
          value={formData.majorId || "none"}
          onValueChange={(value) =>
            onInputChange("majorId", value === "none" ? "" : value)
          }
        >
          <SelectTrigger className="border border-primary-600">
            <SelectValue placeholder="Pilih Jurusan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tidak ada jurusan</SelectItem>
            {majors.map((major) => (
              <SelectItem key={major._id} value={major._id}>
                {major.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeroomTeacherId">Wali Kelas</Label>
        <Select
          value={formData.homeroomTeacherId || "none"}
          onValueChange={(value) =>
            onInputChange("homeroomTeacherId", value === "none" ? "" : value)
          }
        >
          <SelectTrigger className="border border-primary-600">
            <SelectValue placeholder="Pilih Wali Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tidak ada wali kelas</SelectItem>
            {teachers.map((teacher) => (
              <SelectItem key={teacher._id} value={teacher._id}>
                {teacher.name}{" "}
                {teacher.education ? `(${teacher.education})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={(checked) => onInputChange("isActive", checked)}
          className="border border-primary-600 checked:bg-primary-900"
        />
        <Label htmlFor="isActive">Aktif</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border border-primary-600"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-950 text-white hover:bg-primary-900"
        >
          {isLoading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
}
