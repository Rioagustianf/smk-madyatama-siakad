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
import {
  Eye,
  EyeOff,
  Phone,
  Camera,
  Loader2,
  User,
  Mail,
  Briefcase,
} from "lucide-react";

export default function StaffProfilePage() {
  const { data: me, refetch } = useAuthQuery();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentPwError, setCurrentPwError] = React.useState("");
  const [showCurrentPw, setShowCurrentPw] = React.useState(false);
  const [showNewPw, setShowNewPw] = React.useState(false);

  React.useEffect(() => {
    if (me) {
      setName((me as any).name || "");
      setUsername((me as any).username || "");
      setPhone((me as any).phone || "");
      setEmail((me as any).email || "");
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
      // Upload ke Supabase Storage (reuse existing logic, folder 'avatars' is fine)
      const result = await fileUpload.uploadImage(
        file,
        "madyatama",
        "staff-avatars"
      );

      // Update avatar URL di database
      await apiMethods.auth.updateAccount({
        avatar: result.url,
      });

      setAvatar(result.url);
      await refetch();

      addToast({
        type: "success",
        title: "Berhasil",
        description: "Foto profil telah diperbarui",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      addToast({
        type: "error",
        title: "Gagal",
        description: error.message || "Gagal mengupload foto",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setCurrentPwError("");
    try {
      await apiMethods.auth.updateAccount({
        name,
        username,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        // email is not currently in updateAccount type signature in client but handled in backend if passed?
        // Wait, updateUserProfile handles: name, username, phone, nip, parentName, avatar, password.
        // It does NOT explicitly handle 'email' in the destructuring/updateDoc logic in auth-service.ts based on my read.
        // Let's check auth-service.ts lines 270-290 again.
      });
      // Existing logic doesn't update email. I will stick to what's supported.

      setCurrentPassword("");
      setNewPassword("");
      await refetch();
      addToast({
        type: "success",
        title: "Berhasil",
        description: "Profil diperbarui",
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
            Profil Saya
          </h1>
          <p className="text-muted-foreground">
            Kelola informasi akun dan preferensi keamanan Anda
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

                  {/* Overlay on hover */}
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
                <p className="text-lg font-medium">
                  {(me as any)?.name || "Nama Staff"}
                </p>
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      {(me as any)?.position || "Staff"} -{" "}
                      {(me as any)?.department || "Umum"}
                    </span>
                  </div>
                  {(me as any)?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{(me as any)?.email}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: JPG, PNG, atau WebP. Maks 2MB
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
                <label className="text-sm font-medium">Nama Lengkap</label>
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
                  Nomor HP / WhatsApp
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-primary-600 mt-1"
                  placeholder="0812xxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email (Read Only)
                </label>
                <Input
                  value={email}
                  readOnly
                  disabled
                  className="border border-primary-200 mt-1 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Hubungi admin untuk mengubah email.
                </p>
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
                <div
                  className={`relative mt-1 ${
                    currentPwError
                      ? "[&>input]:border-red-500"
                      : "[&>input]:border-primary-600"
                  }`}
                >
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label={
                      showCurrentPw
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPw((v) => !v)}
                  >
                    {showCurrentPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {currentPwError ? (
                  <p className="text-xs text-red-600 mt-1">{currentPwError}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-medium">Password Baru</label>
                <div className="relative mt-1 [&>input]:border-primary-600">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label={
                      showNewPw
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPw((v) => !v)}
                  >
                    {showNewPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-primary-950 text-white hover:bg-primary-900"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
