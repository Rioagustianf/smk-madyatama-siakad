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

export interface TeacherFormData {
  name: string;
  username: string;
  phone?: string;
  education?: string;
  classes?: string[];
}

interface TeacherFormProps {
  formData: TeacherFormData;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

const EDUCATION_OPTIONS = [
  { value: "S.Ag", label: "S.Ag" },
  { value: "S.Pd", label: "S.Pd" },
  { value: "S.Kom", label: "S.Kom" },
  { value: "S.E", label: "S.E" },
  { value: "M.Pd", label: "M.Pd" },
  { value: "A.Md", label: "A.Md" },
  { value: "S.T", label: "S.T" },
  { value: "S.Si", label: "S.Si" },
];

const CLASS_OPTIONS = [
  { value: "12 TKJ 1", label: "12 TKJ 1" },
  { value: "12 TKJ 2", label: "12 TKJ 2" },
  { value: "11 TKJ 1", label: "11 TKJ 1" },
  { value: "11 TKJ 2", label: "11 TKJ 2" },
  { value: "10 TKJ 1", label: "10 TKJ 1" },
  { value: "10 TKJ 2", label: "10 TKJ 2" },
];

export function TeacherForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  submitText = "Simpan",
  onCancel,
}: TeacherFormProps) {
  const handleClassChange = (value: string) => {
    const currentClasses = formData.classes || [];
    if (currentClasses.includes(value)) {
      onInputChange(
        "classes",
        currentClasses.filter((c) => c !== value)
      );
    } else {
      onInputChange("classes", [...currentClasses, value]);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            placeholder="Nama Lengkap Guru"
            value={formData.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Username untuk login"
            value={formData.username || ""}
            onChange={(e) => onInputChange("username", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="phone">No. Telepon</Label>
          <Input
            id="phone"
            placeholder="081234567890"
            value={formData.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education">Pendidikan</Label>
          <Select
            value={formData.education || ""}
            onValueChange={(value) => onInputChange("education", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tidak ada</SelectItem>
              {EDUCATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kelas yang Diampu</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CLASS_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`class-${option.value}`}
                checked={formData.classes?.includes(option.value) || false}
                onChange={() => handleClassChange(option.value)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`class-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        ) : null}
        <Button type="submit" disabled={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
