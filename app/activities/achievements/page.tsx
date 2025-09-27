"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";
import { school } from "@/lib/school";

const achievements = school.achievements.map((a) => ({
  title: a.title,
  year: a.title.match(/\((\d{4})\)/)?.[1] || "",
  category: a.level,
  description: `Peringkat ${a.rank} tingkat ${a.level}.`,
}));

export default function AchievementsPage() {
  return (
    <div>
      <PageHeader
        title="Prestasi"
        subtitle={`Kumpulan prestasi akademik dan non-akademik ${school.name}`}
        breadcrumbs={[{ label: "Prestasi" }]}
        backgroundImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="rounded-2xl border border-primary-100 p-6 bg-white shadow"
              >
                <Typography variant="overline" color="primary" className="mb-2">
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
          </div>
        </div>
      </section>
    </div>
  );
}
