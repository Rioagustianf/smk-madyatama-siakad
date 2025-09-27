"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button/Button";

interface TeacherGradeFormProps {
  onSubmit?: (payload: {
    student: string;
    subject: string;
    assignments: number;
    midterm: number;
    final: number;
  }) => void;
}

export function TeacherGradeForm({ onSubmit }: TeacherGradeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    onSubmit?.({
      student: String(data.get("student") || ""),
      subject: String(data.get("subject") || ""),
      assignments: Number(data.get("assignments") || 0),
      midterm: Number(data.get("midterm") || 0),
      final: Number(data.get("final") || 0),
    });
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-3">
      <Input name="student" placeholder="Nama Siswa" required />
      <Input name="subject" placeholder="Mata Pelajaran" required />
      <Input
        name="assignments"
        type="number"
        placeholder="Tugas"
        min={0}
        max={100}
        required
      />
      <Input
        name="midterm"
        type="number"
        placeholder="UTS"
        min={0}
        max={100}
        required
      />
      <Input
        name="final"
        type="number"
        placeholder="UAS"
        min={0}
        max={100}
        required
      />
      <div className="md:col-span-5">
        <Button type="submit" className="bg-primary-700 text-white">
          Simpan Nilai
        </Button>
      </div>
    </form>
  );
}
