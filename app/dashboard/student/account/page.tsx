"use client";

import React from "react";
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
import { Eye, EyeOff } from "lucide-react";

export default function StudentAccountPage() {
  const { data: me } = useAuthQuery();
  const { addToast } = useToast();
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentPwError, setCurrentPwError] = React.useState("");
  const [showCurrentPw, setShowCurrentPw] = React.useState(false);
  const [showNewPw, setShowNewPw] = React.useState(false);

  React.useEffect(() => {
    if (me) {
      setName((me as any).name || "");
      setUsername((me as any).username || "");
    }
  }, [me]);

  const handleSave = async () => {
    setIsSaving(true);
    setCurrentPwError("");
    try {
      await apiMethods.auth.updateAccount({
        name,
        username,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setCurrentPassword("");
      setNewPassword("");
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
            Akun Siswa
          </h1>
          <p className="text-muted-foreground">
            Perbarui nama, username, dan password
          </p>
        </div>

        <Card className="border border-primary-900">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail login</CardDescription>
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
