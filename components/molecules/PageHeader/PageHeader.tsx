"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typography } from "@/components/atoms/Typography/Typography";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
};

export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  backgroundImage,
}: PageHeaderProps) {
  return (
    <section className="relative w-full h-[240px] md:h-[320px] lg:h-[380px] overflow-hidden">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />

      <div className="relative h-full">
        <div className="container-custom h-full flex flex-col justify-end py-10">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              aria-label="Breadcrumb"
              className="mb-3 text-white/80"
            >
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white">
                    Beranda
                  </a>
                </li>
                {breadcrumbs.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span className="opacity-70">/</span>
                    {item.href ? (
                      <a href={item.href} className="hover:text-white">
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-white/90">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white"
          >
            <Typography variant="h1" color="white" className="mb-2">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" className="text-white/80 max-w-3xl">
                {subtitle}
              </Typography>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
