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

export default function TeacherAccountPage() {
  const { data: me } = useAuthQuery();
  const { addToast } = useToast();
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentPwError, setCurrentPwError] = React.useState("");

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
            Akun Guru
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
