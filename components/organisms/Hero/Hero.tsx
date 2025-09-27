"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typography } from "@/components/atoms/Typography/Typography";
import { Button } from "@/components/atoms/Button/Button";
import { school } from "@/lib/school";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden  h-screen">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[44vh] h-[44vh] opacity-20 z-0">
        <Image
          src="/blob.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[60vh] h-[60vh] opacity-35 z-0">
        <Image
          src="/blob.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="container-custom pt-0 pb-0 md:pt-0 md:pb-0 h-full">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full"
        >
          {/* Left: Heading & CTA */}
          <motion.div variants={item}>
            <Typography
              variant="h1"
              className="mb-6 !text-5xl md:!text-6xl lg:!text-7xl font-black leading-tight"
            >
              {school.name}
            </Typography>
            <Typography variant="body1" color="muted" className="mb-8 max-w-xl">
              Mempersiapkan generasi muda yang kompeten, berkarakter, dan siap
              bersaing di era industri 4.0 dengan pendidikan kejuruan
              berkualitas tinggi.
            </Typography>
            <Button
              size="xl"
              className="bg-primary-950 hover:bg-primary-800 text-white font-bold hover:text-white"
              asChild
            >
              <a href="#fitur">Profil Sekolah</a>
            </Button>
          </motion.div>

          {/* Right: single hero image full & clear */}
          <motion.div variants={item} className="relative h-full">
            <div className="relative h-full w-full">
              <Image
                src="/hero.png"
                alt="Hero SMK Madyatama"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
