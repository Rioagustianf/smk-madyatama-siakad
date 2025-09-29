"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ScheduleFormData {
  day: string;
  time: string;
  subject: string;
  class: string;
  teacher: string;
}

interface ScheduleFormProps {
  formData: ScheduleFormData;
  onInputChange: (field: keyof ScheduleFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const TIME_SLOTS = [
  "07:00-07:40",
  "07:40-08:20",
  "08:20-09:00",
  "09:00-09:40",
  "09:40-10:10", // Istirahat
  "10:10-10:50",
  "10:50-11:30",
  "11:30-12:10",
  "12:10-12:40", // Istirahat
  "12:40-13:20",
  "13:20-14:00",
  "14:00-14:40",
  "14:40-15:20",
];

export default function ScheduleForm({
  formData,
  onInputChange,
  onSubmit,
  isLoading = false,
  submitText = "Simpan",
  onCancel,
}: ScheduleFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="day">Hari *</Label>
          <Select
            value={formData.day}
            onValueChange={(value) => onInputChange("day", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Hari" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Waktu *</Label>
          <Select
            value={formData.time}
            onValueChange={(value) => onInputChange("time", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Mata Pelajaran *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => onInputChange("subject", e.target.value)}
            placeholder="Contoh: Matematika"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Kelas *</Label>
          <Input
            id="class"
            value={formData.class}
            onChange={(e) => onInputChange("class", e.target.value)}
            placeholder="Contoh: 12 TKJ 1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teacher">Guru Pengampu</Label>
          <Input
            id="teacher"
            value={formData.teacher}
            onChange={(e) => onInputChange("teacher", e.target.value)}
            placeholder="Nama Guru (Opsional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
}
