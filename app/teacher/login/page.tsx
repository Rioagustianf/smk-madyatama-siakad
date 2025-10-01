"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/stateful-button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { useLoginMutation } from "@/lib/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import bgHeaderLoginGuru from "@/public/assets/bg-header-login-guru.jpeg";

export default function TeacherLoginPage() {
  const router = useRouter();
  const { state } = useAuth();
  const loginMutation = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"teacher" | "admin">("teacher");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ username, password, role });
      // Success animation will be handled by stateful button
      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/teacher/lesson-value-input";
        }
      }, 2000); // Wait for success animation to complete
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login gagal");
    }
  };

  return (
    <div>
      <PageHeader
        title="Portal Guru & Admin"
        subtitle="Masuk untuk mengelola data akademik dan konten"
        breadcrumbs={[{ label: "Portal Internal" }]}
        backgroundImage={bgHeaderLoginGuru}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-md mx-auto rounded-2xl border border-primary-100 p-6 shadow bg-white">
            <Typography variant="h3" className="mb-2 text-center">
              Masuk
            </Typography>
            <Typography
              variant="body2"
              color="muted"
              className="mb-6 text-center"
            >
              Pilih peran dan gunakan NIP/Username serta kata sandi Anda
            </Typography>
            <div>
              <label className="block text-sm mb-1">Masuk sebagai</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as "teacher" | "admin")}
              >
                <option value="teacher">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm mb-1">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Kata Sandi</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary-950 hover:bg-primary-900 text-white"
                disabled={loginMutation.isPending}
              >
                Masuk
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/student/login"
                className="text-sm text-primary-950 underline"
              >
                Masuk sebagai Siswa
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
