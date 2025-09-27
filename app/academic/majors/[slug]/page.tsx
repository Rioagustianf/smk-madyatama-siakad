"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { BookOpen, Briefcase, GraduationCap } from "lucide-react";
import { school } from "@/lib/school";

const PROGRAM_DETAILS: Record<
  string,
  {
    image: string;
    description: string;
    subjects: string[];
    facilities: string[];
    careers: string[];
  }
> = {
  tkj: {
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    description:
      "Teknik Komputer dan Jaringan berfokus pada instalasi, administrasi jaringan, serta keamanan jaringan berbasis praktik industri.",
    subjects: [
      "Administrasi Sistem Jaringan",
      "Keamanan Jaringan",
      "Teknologi Jaringan Nirkabel",
      "Cloud & Virtualisasi",
    ],
    facilities: ["Lab Jaringan", "Lab Server", "Internet Dedicated"],
    careers: ["Network Engineer", "System Administrator", "IT Support"],
  },
  perhotelan: {
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    description:
      "Akomodasi Perhotelan membekali siswa dengan keterampilan front office, housekeeping, dan layanan perhotelan modern.",
    subjects: [
      "Front Office",
      "Housekeeping",
      "Food & Beverage Service",
      "English For Hospitality",
    ],
    facilities: ["Mockup Front Office", "Room Practice", "Laundry"],
    careers: ["Front Office Staff", "Room Attendant", "Guest Relation"],
  },
};

export default function MajorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || "").toLowerCase();

  const programMeta = useMemo(
    () => school.programs.find((p) => p.slug.toLowerCase() === slug),
    [slug]
  );
  const details = PROGRAM_DETAILS[slug];

  return (
    <div>
      <PageHeader
        title={programMeta?.name || "Program Keahlian"}
        subtitle={`Informasi lengkap program keahlian ${
          programMeta?.name || ""
        } di ${school.name}`}
        breadcrumbs={[
          { label: "Akademik", href: "/academic" },
          { label: "Program Keahlian", href: "/academic/majors" },
          { label: programMeta?.name || "Detail" },
        ]}
        backgroundImage={details?.image}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          {programMeta && details ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Overview */}
              <div className="lg:col-span-2">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={details.image}
                    alt={programMeta.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Typography variant="h2" className="mb-4">
                  {programMeta.name}
                </Typography>
                <Typography variant="body1" color="muted" className="mb-8">
                  {details.description}
                </Typography>

                {/* Subjects */}
                <div className="mb-8">
                  <div className="flex items-center mb-3">
                    <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
                    <Typography variant="subtitle2">
                      Mata Pelajaran Utama
                    </Typography>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.subjects.map((s) => (
                      <li
                        key={s}
                        className="rounded-lg border border-primary-100 p-3"
                      >
                        <Typography variant="body2" color="muted">
                          {s}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Facilities */}
                <div className="mb-8">
                  <div className="flex items-center mb-3">
                    <GraduationCap className="w-5 h-5 text-primary-600 mr-2" />
                    <Typography variant="subtitle2">Fasilitas</Typography>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.facilities.map((f) => (
                      <li
                        key={f}
                        className="rounded-lg border border-primary-100 p-3"
                      >
                        <Typography variant="body2" color="muted">
                          {f}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Prospects */}
                <div>
                  <div className="flex items-center mb-3">
                    <Briefcase className="w-5 h-5 text-primary-600 mr-2" />
                    <Typography variant="subtitle2">Prospek Karier</Typography>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {details.careers.map((c) => (
                      <li
                        key={c}
                        className="rounded-lg border border-primary-100 p-3"
                      >
                        <Typography variant="body2" color="muted">
                          {c}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-4">
                <div className="rounded-2xl border border-primary-100 p-5">
                  <Typography variant="subtitle2" className="mb-2">
                    Tautan Terkait
                  </Typography>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" asChild>
                      <a href="/activities/internship">Program Prakerin</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/activities/achievements">Prestasi</a>
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="text-center py-20">
              <Typography variant="h4" className="mb-3">
                Program tidak ditemukan
              </Typography>
              <Button variant="outline" asChild>
                <a href="/academic/majors">Kembali ke daftar</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return school.programs.map((p) => ({ slug: p.slug }));
}
