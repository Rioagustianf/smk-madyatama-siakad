"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Typography } from "@/components/atoms/Typography/Typography";

const extracurriculars = [
  {
    name: "Paskibra",
    description:
      "Pelatihan kedisiplinan dan kepemimpinan melalui kegiatan pengibaran bendera.",
  },
  {
    name: "Pramuka",
    description:
      "Membangun karakter, kemandirian, dan kepemimpinan melalui kepramukaan.",
  },
  {
    name: "PMR",
    description:
      "Pembinaan keterampilan pertolongan pertama dan kepedulian sosial.",
  },
  {
    name: "Futsal",
    description:
      "Pengembangan bakat olahraga dan sportivitas melalui kompetisi.",
  },
  {
    name: "Desain Grafis",
    description: "Eksplorasi karya kreatif desain digital dan cetak.",
  },
];

export default function ExtracurricularPage() {
  return (
    <div>
      <PageHeader
        title="Ekstrakurikuler"
        subtitle="Informasi kegiatan pengembangan minat dan bakat di SMK Madyatama"
        breadcrumbs={[{ label: "Ekstrakurikuler" }]}
        backgroundImage="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Typography variant="h2" className="mb-4">
              Daftar Kegiatan
            </Typography>
            <Typography variant="body1" color="muted">
              Siswa dapat memilih kegiatan di luar pembelajaran untuk mengasah
              soft-skill dan karakter.
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extracurriculars.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-primary-100 shadow"
              >
                <Typography variant="h5" className="mb-2">
                  {item.name}
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
