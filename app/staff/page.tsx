"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";

const headmaster = {
  name: "Drs. Bambang Setiawan",
  position: "Kepala Sekolah",
  photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  quote: "Pendidikan adalah kunci untuk membuka masa depan yang gemilang.",
};

const teachers = [
  { name: "Siti Andayani, S.Kom", subject: "Produktif RPL" },
  { name: "Dedi Kurniawan, S.T", subject: "Produktif TKJ" },
  { name: "Rina Amelia, S.Sn", subject: "Multimedia" },
  { name: "Ahmad Fauzi, S.E", subject: "Akuntansi" },
];

export default function StaffPage() {
  return (
    <div>
      <PageHeader
        title="Kepala Sekolah & Tenaga Pendidik"
        subtitle="Informasi pimpinan, tenaga pendidik, dan staf SMK Madyatama"
        breadcrumbs={[{ label: "Kepala Sekolah & Tenaga Pendidik" }]}
        backgroundImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
      />

      {/* Headmaster */}
      <section className="section-padding bg-white">
        <div className="container-custom">
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
              <Typography variant="subtitle2" color="muted" className="mb-6">
                {headmaster.position}
              </Typography>
              <Typography
                variant="body1"
                color="muted"
                className="leading-relaxed"
              >
                {headmaster.quote}
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
                  src={headmaster.photo}
                  alt={headmaster.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <Typography variant="h3" className="mb-8 text-center">
            Tenaga Pendidik
          </Typography>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-primary-100 text-center shadow"
              >
                <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4" />
                <Typography variant="subtitle2" className="mb-1">
                  {t.name}
                </Typography>
                <Typography variant="caption" color="muted">
                  {t.subject}
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
