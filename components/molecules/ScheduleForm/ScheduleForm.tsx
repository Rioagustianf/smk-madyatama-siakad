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
import { useSubjects } from "@/lib/hooks/use-subjects";
import { useClasses } from "@/lib/hooks/use-classes";
import { useTeachers } from "@/lib/hooks/use-teachers";

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
  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    error: subjectsError,
  } = useSubjects();
  const subjects: any[] = subjectsData?.data || [];

  const {
    data: classesData,
    isLoading: isClassesLoading,
    error: classesError,
  } = useClasses();
  const classes: any[] = classesData?.data || [];

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    error: teachersError,
  } = useTeachers();
  const teachers: any[] = teachersData?.data || [];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 ">
          <Label htmlFor="day">Hari *</Label>
          <Select
            value={formData.day}
            onValueChange={(value) => onInputChange("day", value)}
          >
            <SelectTrigger className="border border-primary-600">
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
            <SelectTrigger className="border border-primary-600">
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
          <Select
            value={formData.subject}
            onValueChange={(value) => onInputChange("subject", value)}
          >
            <SelectTrigger className="border border-primary-600">
              <SelectValue
                placeholder={
                  isSubjectsLoading
                    ? "Memuat..."
                    : subjectsError
                    ? "Gagal memuat"
                    : "Pilih Mata Pelajaran"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__CUSTOM__">Lainnya (ketik manual)</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s._id || s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.subject === "__CUSTOM__" && (
            <Input
              className="border border-primary-600 mt-2"
              placeholder="Tulis nama mata pelajaran (mis. UPACARA)"
              value={"__CUSTOM__" === formData.subject ? "" : formData.subject}
              onChange={(e) => onInputChange("subject", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Kelas *</Label>
          <Select
            value={formData.class}
            onValueChange={(value) => onInputChange("class", value)}
          >
            <SelectTrigger className="border border-primary-600">
              <SelectValue
                placeholder={
                  isClassesLoading
                    ? "Memuat..."
                    : classesError
                    ? "Gagal memuat"
                    : "Pilih Kelas"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL_CLASSES__">Semua Kelas</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c._id || c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teacher">Guru Pengampu</Label>
          <Select
            value={formData.teacher}
            onValueChange={(value) => onInputChange("teacher", value)}
          >
            <SelectTrigger className="border border-primary-600">
              <SelectValue
                placeholder={
                  isTeachersLoading
                    ? "Memuat..."
                    : teachersError
                    ? "Gagal memuat"
                    : "Pilih Guru (Opsional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t._id || t.id} value={t.name}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          className="bg-primary-950 text-white hover:bg-primary-900"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
}
