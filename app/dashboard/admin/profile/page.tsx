"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminProfilePage() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profil Sekolah
          </h1>
          <p className="text-muted-foreground">
            Kelola informasi profil sekolah
          </p>
        </div>

        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Informasi Utama</CardTitle>
            <CardDescription>Nama, visi misi, deskripsi</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="Nama Sekolah" />
              <Textarea placeholder="Visi & Misi" rows={5} />
              <Textarea placeholder="Deskripsi Singkat" rows={5} />
              <div>
                <Button>Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
