"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button/Button";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Placeholder: integrate NextAuth credentials provider later
      await new Promise((r) => setTimeout(r, 800));
      router.push("/dashboard/student/lesson-value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Portal Siswa"
        subtitle="Masuk untuk mengakses informasi akademik Anda"
        breadcrumbs={[{ label: "Portal Siswa" }]}
        backgroundImage="https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg"
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
              Gunakan NISN atau username dan kata sandi Anda
            </Typography>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="NISN / Username"
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
                className="w-full bg-primary-700 text-white"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/teacher/login"
                className="text-sm text-primary-700 underline"
              >
                Masuk sebagai Guru
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
