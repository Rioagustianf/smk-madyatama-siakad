'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Calendar, Clock, ArrowRight, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AnnouncementCardProps {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  category: 'academic' | 'general' | 'exam' | 'event';
  priority: 'low' | 'medium' | 'high';
  publishedAt: Date;
  href: string;
}

const categoryColors = {
  academic: 'bg-blue-100 text-blue-800',
  general: 'bg-gray-100 text-gray-800',
  exam: 'bg-red-100 text-red-800',
  event: 'bg-green-100 text-green-800',
};

const categoryLabels = {
  academic: 'Akademik',
  general: 'Umum',
  exam: 'Ujian',
  event: 'Acara',
};

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400',
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  excerpt,
  image,
  category,
  priority,
  publishedAt,
  href,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${priorityColors[priority]} hover:-translate-y-1`}>
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
                {categoryLabels[category]}
              </span>
            </div>
            {priority === 'high' && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white p-2 rounded-full">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Category and Date */}
          <div className="flex items-center justify-between mb-3">
            {!image && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
                {categoryLabels[category]}
              </span>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {format(publishedAt, 'dd MMM yyyy', { locale: id })}
            </div>
          </div>

          {/* Title */}
          <Typography variant="h5" className="mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </Typography>

          {/* Excerpt */}
          <Typography variant="body2" color="muted" className="mb-4 line-clamp-3">
            {excerpt}
          </Typography>

          {/* Read More Button */}
          <Button variant="ghost" size="sm" className="p-0 h-auto font-medium group-hover:text-primary-600" asChild>
            <Link href={href}>
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};