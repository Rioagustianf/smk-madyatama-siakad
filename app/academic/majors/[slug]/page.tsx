"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { BookOpen, Briefcase, GraduationCap } from "lucide-react";
import { useMajors } from "@/lib/hooks/use-majors";
import tkj from "@/public/tkj.jpeg";

function fromSlug(slug: string): string {
  return slug.replace(/-/g, " ").toUpperCase();
}

export default function MajorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || "").toLowerCase();
  const { data, isLoading, error } = useMajors();
  const majors = data?.data || [];

  const major = useMemo(() => {
    // Match by code (converted from slug) or by normalized name
    const codeGuess = fromSlug(slug);
    const byCode = majors.find(
      (m: any) => (m.code || "").toLowerCase() === codeGuess.toLowerCase()
    );
    if (byCode) return byCode;
    const normalized = slug.replace(/-/g, " ");
    return majors.find(
      (m: any) => (m.name || "").toLowerCase() === normalized.toLowerCase()
    );
  }, [majors, slug]);

  return (
    <div>
      <PageHeader
        title={major?.name || "Program Keahlian"}
        subtitle={major?.description || "Informasi lengkap program keahlian"}
        breadcrumbs={[
          { label: "Akademik", href: "/academic" },
          { label: "Program Keahlian", href: "/academic/majors" },
          { label: major?.name || "Detail" },
        ]}
        backgroundImage={tkj.src}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              Memuat detail program...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              Gagal memuat data program
            </div>
          ) : major ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Overview */}
              <div className="lg:col-span-2">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={major.image || "/placeholder.svg"}
                    alt={major.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Typography variant="h2" className="mb-4">
                  {major.name}
                </Typography>
                <Typography variant="body1" color="muted" className="mb-8">
                  {major.description}
                </Typography>

                {/* Subjects */}
                {Array.isArray(major.subjects) && major.subjects.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
                      <Typography variant="subtitle2">
                        Mata Pelajaran Utama
                      </Typography>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {major.subjects.map((s: string) => (
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
                )}

                {/* Facilities */}
                {Array.isArray(major.facilities) &&
                  major.facilities.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center mb-3">
                        <GraduationCap className="w-5 h-5 text-primary-600 mr-2" />
                        <Typography variant="subtitle2">Fasilitas</Typography>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {major.facilities.map((f: string) => (
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
                  )}

                {/* Career Prospects */}
                {Array.isArray(major.careerProspects) &&
                  major.careerProspects.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <Briefcase className="w-5 h-5 text-primary-600 mr-2" />
                        <Typography variant="subtitle2">
                          Prospek Karier
                        </Typography>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {major.careerProspects.map((c: string) => (
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
                  )}
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
