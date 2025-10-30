"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/ui/button";
import { Trophy, Bell } from "lucide-react";
import { useAchievements } from "@/lib/hooks/use-activities";

export default function AchievementsPage() {
  const { data, isLoading, error } = useAchievements();
  const achievements = (data?.data || []).map((a: any) => ({
    title: a.title,
    year: a.year || "",
    category: a.category || "",
    description: a.description || "",
  }));
  return (
    <div>
      <PageHeader
        title="Prestasi"
        subtitle={`Kumpulan prestasi akademik dan non-akademik`}
        breadcrumbs={[{ label: "Prestasi" }]}
        backgroundImage="/assets/prestasi.png"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && (
              <div className="col-span-3 text-center text-muted-foreground">
                Memuat data...
              </div>
            )}
            {error && (
              <div className="col-span-3 text-center text-red-600">
                Gagal memuat data
              </div>
            )}
            {!isLoading &&
              !error &&
              achievements.length > 0 &&
              achievements.map((item: any, index: number) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="rounded-2xl border border-primary-100 p-6 bg-white shadow"
                >
                  <Typography
                    variant="overline"
                    color="primary"
                    className="mb-2"
                  >
                    {item.category} • {item.year}
                  </Typography>
                  <Typography variant="h5" className="mb-2">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="muted">
                    {item.description}
                  </Typography>
                </motion.div>
              ))}
            {!isLoading && !error && achievements.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="col-span-3 text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-gray-400" />
                </div>
                <Typography variant="h4" color="muted" className="mb-4">
                  Belum ada prestasi yang tercatat
                </Typography>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
