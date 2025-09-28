"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
}

interface Teacher {
  _id: string;
  name: string;
  education?: string;
}

interface SubjectFormProps {
  formData: SubjectFormData;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
  teachers?: Teacher[];
}

export function SubjectForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
  teachers = [],
}: SubjectFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Mapel</Label>
          <Input
            id="name"
            placeholder="Nama Mapel"
            value={formData.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            required
            className="border border-primary-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Kode</Label>
          <Input
            id="code"
            placeholder="Kode"
            value={formData.code || ""}
            onChange={(e) => onInputChange("code", e.target.value)}
            required
            className="border border-primary-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherId">Guru Pengampu</Label>
        <Select
          value={formData.teacherId || "none"}
          onValueChange={(value) =>
            onInputChange("teacherId", value === "none" ? "" : value)
          }
        >
          <SelectTrigger className="border border-primary-600">
            <SelectValue placeholder="Pilih Guru Pengampu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tidak ada guru</SelectItem>
            {teachers.map((teacher) => (
              <SelectItem key={teacher._id} value={teacher._id}>
                {teacher.name}{" "}
                {teacher.education ? `(${teacher.education})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          placeholder="Deskripsi mata pelajaran"
          value={formData.description || ""}
          onChange={(e) => onInputChange("description", e.target.value)}
          className="border border-primary-600"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button
            className="border border-primary-600"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Batal
          </Button>
        ) : null}
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
