"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthQuery } from "@/lib/hooks/use-auth";
import { apiMethods } from "@/lib/api-client";
import { useToast } from "@/lib/contexts/toast-context";
import { fileUpload } from "@/lib/supabase-client";
import { Phone, Camera, Loader2, User } from "lucide-react";

export default function TeacherAccountPage() {
  const { data: me, refetch } = useAuthQuery();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [nip, setNip] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentPwError, setCurrentPwError] = React.useState("");
  const [nipError, setNipError] = React.useState("");

  React.useEffect(() => {
    if (me) {
      setName((me as any).name || "");
      setUsername((me as any).username || "");
      setPhone((me as any).phone || "");
      setNip((me as any).nip || "");
      setAvatar((me as any).avatar || "");
    }
  }, [me]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await fileUpload.uploadImage(file, "madyatama", "avatars");
      await apiMethods.auth.updateAccount({ avatar: result.url });
      setAvatar(result.url);
      await refetch();
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Foto profil telah diperbarui",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Gagal",
        description: error.message || "Gagal mengupload foto",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setCurrentPwError("");
    setNipError("");

    // Validate NIP: must be exactly 18 digits or empty
    if (nip && !/^\d{18}$/.test(nip)) {
      setNipError("NIP harus terdiri dari 18 digit angka");
      setIsSaving(false);
      return;
    }

    try {
      await apiMethods.auth.updateAccount({
        name,
        username,
        phone,
        nip,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setCurrentPassword("");
      setNewPassword("");
      await refetch(); // Refetch to update form data
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Akun diperbarui",
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Terjadi kesalahan";
      if (msg.toLowerCase().includes("salah"))
        setCurrentPwError("Password saat ini tidak sesuai");
      addToast({ type: "error", title: "Gagal", description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Akun Guru
          </h1>
          <p className="text-muted-foreground">
            Perbarui foto profil, nama, username, nomor WhatsApp, dan password
          </p>
        </div>

        {/* Avatar Section */}
        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
            <CardDescription>Klik untuk mengganti foto profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center cursor-pointer border-2 border-primary-600 hover:border-primary-800 transition-all"
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary-600" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {(me as any)?.name || "Nama Guru"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Format: JPG, PNG, atau WebP. Maks 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail login dan kontak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-primary-600 mt-1"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-primary-600 mt-1"
                  placeholder="Username untuk login"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor WhatsApp
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-primary-600 mt-1"
                  placeholder="08123456789"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: 08xxx atau 628xxx (untuk notifikasi)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  NIP (Nomor Induk Pegawai)
                </label>
                <Input
                  value={nip}
                  onChange={(e) => {
                    // Only allow digits and max 18 characters
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 18);
                    setNip(value);
                    if (nipError) setNipError("");
                  }}
                  className={`border mt-1 ${
                    nipError ? "border-red-500" : "border-primary-600"
                  }`}
                  placeholder="123456789012345678"
                  maxLength={18}
                />
                {nipError ? (
                  <p className="text-xs text-red-600 mt-1">{nipError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    NIP harus 18 digit (akan ditampilkan di rapor siswa)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>
              Isi kedua kolom untuk mengubah password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Password Saat Ini</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`border mt-1 ${
                    currentPwError ? "border-red-500" : "border-primary-600"
                  }`}
                  placeholder="••••••••"
                />
                {currentPwError ? (
                  <p className="text-xs text-red-600 mt-1">{currentPwError}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-medium">Password Baru</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-primary-600 mt-1"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-primary-950 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
