"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@/components/atoms/Typography/Typography";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

const footerLinks = {
  akademik: [
    { label: "Teknik Komputer & Jaringan", href: "/academic/majors/tkj" },
    { label: "Rekayasa Perangkat Lunak", href: "/academic/majors/rpl" },
    { label: "Multimedia", href: "/academic/majors/mm" },
    { label: "Akuntansi", href: "/academic/majors/akl" },
  ],
  informasi: [
    { label: "Profil Sekolah", href: "/profile" },
    { label: "Pengumuman", href: "/announcements" },
    { label: "Galeri", href: "/gallery" },
    { label: "Prestasi", href: "/activities/achievements" },
  ],
  layanan: [
    { label: "Portal Siswa", href: "/student/login" },
    { label: "Portal Guru", href: "/teacher/login" },
    { label: "DUDI/Prakerin", href: "/activities/internship" },
    { label: "Ekstrakurikuler", href: "/activities/extracurricular" },
  ],
};

import { school } from "@/lib/school";

const socialLinks = [
  {
    icon: <Facebook className="w-5 h-5" />,
    href: school.contact.facebook,
    label: "Facebook",
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    href: school.contact.instagram,
    label: "Instagram",
  },
  {
    icon: <Youtube className="w-5 h-5" />,
    href: school.contact.youtube,
    label: "YouTube",
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  color="white"
                  className="font-bold"
                >
                  {school.name}
                </Typography>
                <Typography variant="caption" className="text-secondary-400">
                  NPSN: {school.npsn}
                </Typography>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3 text-white/90">
                <MapPin className="w-4 h-4 text-primary-400" />
                <Typography variant="body2" className="text-white/90">
                  {school.address.street}, {school.address.kelurahan},{" "}
                  {school.address.kecamatan}, {school.address.city},{" "}
                  {school.address.province}
                </Typography>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Phone className="w-4 h-4 text-primary-400" />
                <Typography variant="body2" className="text-white/80">
                  {school.contact.phone}
                </Typography>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Mail className="w-4 h-4 text-primary-400" />
                <Typography variant="body2" className="text-white/80">
                  {school.contact.email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Akademik */}
          <div>
            <Typography variant="subtitle2" color="white" className="mb-3">
              Program Keahlian
            </Typography>
            <ul className="space-y-2 text-sm">
              {footerLinks.akademik.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <Typography variant="subtitle2" color="white" className="mb-3">
              Informasi
            </Typography>
            <ul className="space-y-2 text-sm">
              {footerLinks.informasi.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-top border-neutral-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>

            <div className="text-secondary-400 text-center md:text-right">
              <Typography variant="body2" className="text-white">
                © 2024 {school.name}. All rights reserved.
              </Typography>
              <Typography variant="caption" className="text-secondary-500">
                NPSN {school.npsn}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
