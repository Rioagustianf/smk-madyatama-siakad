"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import {
  Users,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { useMajors } from "@/lib/hooks/use-majors";
import bgHeaderMajors from "@/public/assets/bg-jurusan.png";

// Util to build slug from code or name
function toSlug(nameOrCode: string): string {
  return nameOrCode
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function MajorsPage() {
  const { data, isLoading, error } = useMajors();
  const majors = data?.data || [];
  const totalMajors = majors.length;
  const totalStudents = majors.reduce(
    (acc: number, m: any) =>
      acc + (typeof m.totalStudents === "number" ? m.totalStudents : 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Program Keahlian"
        subtitle="Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang cerah"
        breadcrumbs={[
          { label: "Akademik", href: "/academic" },
          { label: "Program Keahlian" },
        ]}
        backgroundImage={bgHeaderMajors}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography
              variant="h1"
              className="text-4xl font-bold mb-4 text-balance"
            >
              Temukan Program Keahlian Terbaik
            </Typography>
            <Typography
              variant="body1"
              color="muted"
              className="text-lg max-w-2xl mx-auto text-pretty"
            >
              SMK Madyatama menawarkan program keahlian berkualitas dengan
              kurikulum terkini dan fasilitas modern
            </Typography>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? "…" : totalMajors.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-muted-foreground">
                Program Keahlian
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? "…" : totalStudents.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-muted-foreground">Total Siswa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">
                Tingkat Kelulusan
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">
                Langsung Kerja
              </div>
            </div>
          </motion.div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {isLoading && (
              <div className="col-span-2 text-center text-muted-foreground">
                Memuat program keahlian...
              </div>
            )}
            {error && (
              <div className="col-span-2 text-center text-red-600">
                Gagal memuat data program keahlian
              </div>
            )}
            {!isLoading &&
              !error &&
              majors.map((major: any, index: number) => (
                <motion.div
                  key={major._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    {/* Card Header with Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={major.image || "/placeholder.svg"}
                        alt={major.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: "top" }}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/30 opacity-80`}
                      />
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Floating Info */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-white text-sm font-medium">
                            {major.code}
                          </span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-300" />
                          <span className="text-white text-sm">
                            {major.accreditation || "A"}
                          </span>
                        </div>
                      </div>

                      {/* No static icon; keep clean header */}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Typography
                            variant="h3"
                            className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"
                          >
                            {major.name}
                          </Typography>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{major.totalStudents || 0} siswa</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Typography
                        variant="body2"
                        color="muted"
                        className="mb-6 text-pretty leading-relaxed"
                      >
                        {major.description}
                      </Typography>

                      {/* Key Subjects */}
                      {Array.isArray(major.subjects) &&
                        major.subjects.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center mb-3">
                              <BookOpen className="w-4 h-4 text-primary mr-2" />
                              <Typography
                                variant="subtitle2"
                                className="text-sm font-medium"
                              >
                                Mata Pelajaran Utama
                              </Typography>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {major.subjects
                                .slice(0, 3)
                                .map((subject: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-secondary rounded-md text-xs text-secondary-foreground"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              {major.subjects.length > 3 && (
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                  +{major.subjects.length - 3} lainnya
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* CTA Button */}
                      <Button
                        variant="outline"
                        className="w-full bg-primary-950 group/btn hover:bg-primary hover:text-primary-foreground"
                        asChild
                      >
                        <Link
                          href={`/academic/majors/${toSlug(
                            major.code || major.name
                          )}`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-white">
                              Pelajari Lebih Detail
                            </span>
                            <ChevronRight className="w-4 text-white h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-primary-900 border border-border rounded-2xl p-8">
              <Typography
                variant="h3"
                className="text-2xl font-semibold mb-4 text-white"
              >
                Masih Bingung Memilih?
              </Typography>
              <Typography
                variant="body1"
                color="muted"
                className="mb-6 max-w-2xl mx-auto text-white"
              >
                Tim konselor akademik kami siap membantu kamu menemukan program
                keahlian yang tepat sesuai minat dan bakat
              </Typography>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
