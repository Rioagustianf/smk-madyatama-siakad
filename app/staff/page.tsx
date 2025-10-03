"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";

import { useStaffList } from "@/lib/hooks/use-staff";
import dynamic from "next/dynamic";
const OrganizationChart = dynamic<{
  people: any[];
  className?: string;
}>(
  () =>
    import("@/components/organisms/OrganizationChart/OrganizationChart").then(
      (m) =>
        m.OrganizationChart as React.ComponentType<{
          people: any[];
          className?: string;
        }>
    ),
  { ssr: false }
);
import { Tabs } from "@/components/ui/tabs";

export default function StaffPage() {
  const { data, isLoading, error } = useStaffList({
    page: 1,
    limit: 1000,
    isActive: true,
  } as any);
  const staff: any[] = (data as any)?.data || [];

  const byOrder = (a: any, b: any) => {
    const ao = typeof a.order === "number" ? a.order : 0;
    const bo = typeof b.order === "number" ? b.order : 0;
    if (ao !== bo) return ao - bo;
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  };

  const headmaster = staff
    .filter((s) => (s.role || "").toLowerCase() === "headmaster")
    .sort(byOrder)[0];

  const isWakil = (s: any) => /wakil.*kepala|\bwaka\b/i.test(s.position || "");
  const isKoordinator = (s: any) =>
    /(ketua|koordinator).*\b(jurusan|program|kompetensi)\b/i.test(
      s.position || ""
    );

  const wakilKepala = staff
    .filter((s) => isWakil(s) && s !== headmaster)
    .sort(byOrder);
  const koordinator = staff
    .filter((s) => isKoordinator(s) && s !== headmaster)
    .sort(byOrder);
  const teachers = staff
    .filter((s) => (s.role || "").toLowerCase() === "teacher")
    .sort(byOrder);
  const admins = staff
    .filter((s) => {
      const r = (s.role || "").toLowerCase();
      return r === "admin" || r === "staff" || r === "other";
    })
    .sort(byOrder);

  const Card = ({ item }: { item: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-primary-100 text-center shadow"
    >
      <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : null}
      </div>
      <Typography variant="subtitle2" className="mb-1">
        {item.name}
      </Typography>
      <Typography variant="caption" color="muted">
        {item.subject || item.position}
      </Typography>
    </motion.div>
  );

  return (
    <div>
      <PageHeader
        title="Kepala Sekolah & Tenaga Pendidik"
        subtitle="Informasi pimpinan, tenaga pendidik, dan staf SMK Madyatama"
        breadcrumbs={[{ label: "Kepala Sekolah & Tenaga Pendidik" }]}
        backgroundImage="../../../public/assets/bg-header-login-guru.jpeg"
      />

      {/* Headmaster */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-16">
              Memuat data staf...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-16">
              Gagal memuat data staf
            </div>
          ) : headmaster ? (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="overline" color="primary" className="mb-4">
                  KEPALA SEKOLAH
                </Typography>
                <Typography variant="h2" className="mb-2">
                  {headmaster.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="muted"
                  className="leading-relaxed"
                >
                  {headmaster.quote ||
                    headmaster.bio ||
                    "Pendidikan adalah kunci untuk membuka masa depan yang gemilang."}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={headmaster.image || "/placeholder.svg"}
                    alt={headmaster.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              Data kepala sekolah belum tersedia
            </div>
          )}
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <Typography variant="h3" className="mb-8 text-center">
            Struktur Organisasi
          </Typography>

          <OrganizationChart people={staff} className="mb-12" />

          {/* Tabs grid foto berdasarkan role/level (atomic: Typography, Card-like divs) */}
          {(() => {
            const roleOf = (p: any) => (p.role || "").toLowerCase();
            const head = staff.find((p: any) => roleOf(p) === "headmaster");
            const vice = staff.filter(
              (p: any) => roleOf(p) === "vice-headmaster"
            );
            const wks = staff.filter((p: any) => roleOf(p).startsWith("wks"));
            const kepalaProgram = staff.filter(
              (p: any) => roleOf(p) === "kepala-program"
            );
            const kepalaTU = staff.filter(
              (p: any) => roleOf(p) === "kepala-tu"
            );
            const teachers = staff.filter((p: any) => roleOf(p) === "teacher");
            const admins = staff.filter((p: any) =>
              ["staff", "other", "admin"].includes(roleOf(p))
            );

            const StaffCard = ({ item }: { item: any }) => (
              <div className="bg-white rounded-2xl overflow-hidden border border-primary-100 shadow hover:shadow-md transition">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <Typography variant="subtitle2" className="mb-1">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {item.subject || item.position}
                  </Typography>
                </div>
              </div>
            );

            const Grid = ({ items }: { items: any[] }) => (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((p) => (
                  <StaffCard key={p._id || p.id} item={p} />
                ))}
              </div>
            );

            const tabs = [
              {
                title: "Semua",
                value: "all",
                content: (
                  <div>
                    <Grid items={staff} />
                  </div>
                ),
              },
              head && {
                title: "Kepala Sekolah",
                value: "kepsek",
                content: (
                  <div>
                    <Grid items={[head]} />
                  </div>
                ),
              },
              vice.length > 0 && {
                title: "Wakil Kepsek",
                value: "vice",
                content: (
                  <div>
                    <Grid items={vice} />
                  </div>
                ),
              },
              wks.length > 0 && {
                title: "WKS (Bidang)",
                value: "wks",
                content: (
                  <div>
                    <Grid items={wks} />
                  </div>
                ),
              },
              kepalaProgram.length > 0 && {
                title: "Kepala Program",
                value: "kaprog",
                content: (
                  <div>
                    <Grid items={kepalaProgram} />
                  </div>
                ),
              },
              kepalaTU.length > 0 && {
                title: "Kepala TU",
                value: "ketu",
                content: (
                  <div>
                    <Grid items={kepalaTU} />
                  </div>
                ),
              },
              teachers.length > 0 && {
                title: "Guru",
                value: "guru",
                content: (
                  <div>
                    <Grid items={teachers} />
                  </div>
                ),
              },
              admins.length > 0 && {
                title: "Staf",
                value: "staf",
                content: (
                  <div>
                    <Grid items={admins} />
                  </div>
                ),
              },
            ].filter(Boolean) as any[];

            return (
              <div className="mt-10">
                <Tabs tabs={tabs} className="w-full" />
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
