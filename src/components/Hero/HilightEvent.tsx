'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  autoUpdateActivityStatus,
  parseLocalDate,
  sortActivitiesByPriority,
} from '@/lib/types';

type Props = {
  title?: string;
  subtitle?: string;
  href?: string;
};

export default function HighlightEvent({ title, subtitle, href }: Props) {
  const [featuredActivity, setFeaturedActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  const loadActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/kegiatan', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const updated = sortActivitiesByPriority(autoUpdateActivityStatus(data));
      // Only show ongoing or upcoming events; hide completed/expired events
      const activeEvents = updated.filter(
        (a) => a.status === 'ongoing' || a.status === 'upcoming'
      );
      setFeaturedActivity(activeEvents[0] || null);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
    const onFocus = () => loadActivities();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadActivities]);

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="h-24 w-full max-w-[980px] animate-pulse rounded-2xl border border-gray-200/80 bg-white/80 dark:border-white/10 dark:bg-gray-dark/70" />
      </div>
    );
  }

  if (!featuredActivity && !title) {
    return null;
  }

  const displayTitle = title || featuredActivity?.title || 'Kegiatan SKRT MEDIA';
  const displaySubtitle = subtitle || featuredActivity?.description || '';
  const displayHref =
    href || (featuredActivity ? `/kegiatan/${featuredActivity.id}` : '/kegiatan');

  const statusMeta =
    featuredActivity?.status === 'ongoing'
      ? {
          label: 'SEDANG BERLANGSUNG',
          badgeClass:
            'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
          dotClass: 'bg-emerald-500',
        }
      : featuredActivity?.status === 'upcoming'
        ? {
            label: 'AKAN DATANG',
            badgeClass:
              'bg-blue-50 text-primary ring-blue-200 dark:bg-primary/20 dark:text-sky-300 dark:ring-primary/30',
            dotClass: 'bg-primary',
          }
        : {
            label: 'KEGIATAN TERBARU',
            badgeClass:
              'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15',
            dotClass: 'bg-gray-500',
          };

  const parsedDate = featuredActivity?.date ? parseLocalDate(featuredActivity.date) : null;
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={displayHref}
        aria-label={`Buka halaman acara ${displayTitle}`}
        className="w-full max-w-[980px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25 }}
          className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200/80 bg-white px-6 py-5 text-left shadow-sm transition-shadow hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:gap-6"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ring-1 ring-inset ${statusMeta.badgeClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                {statusMeta.label}
              </span>
              {formattedDate && (
                <span className="text-xs font-medium text-body-color dark:text-body-color-dark">
                  {formattedDate}
                  {featuredActivity?.time ? ` • ${featuredActivity.time}` : ''}
                </span>
              )}
            </div>

            <h2 className="truncate text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary dark:text-white sm:text-xl">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <p className="mt-1 line-clamp-1 text-sm text-body-color dark:text-body-color-dark">
                {displaySubtitle}
              </p>
            )}

            {featuredActivity?.status === 'upcoming' && parsedDate && (
              <EventCountdown targetDate={parsedDate} timeText={featuredActivity.time} />
            )}
          </div>

          <span className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all group-hover:bg-primary/90 sm:self-center sm:text-sm">
            Lihat Detail
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </motion.div>
      </Link>
    </div>
  );
}

function EventCountdown({
  targetDate,
  timeText,
}: {
  targetDate: Date;
  timeText?: string;
}) {
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate.getTime());
    const timeMatch = timeText ? /(\d{1,2})[:.](\d{2})/.exec(timeText) : null;
    if (timeMatch) {
      target.setHours(
        Math.min(23, Math.max(0, Number(timeMatch[1]))),
        Math.min(59, Math.max(0, Number(timeMatch[2]))),
        0,
        0
      );
    } else {
      target.setHours(8, 0, 0, 0);
    }

    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining(null);
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setRemaining({ days, hours, minutes, seconds });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate, timeText]);

  if (!remaining) return null;

  const units = [
    { label: 'Hari', value: remaining.days },
    { label: 'Jam', value: remaining.hours },
    { label: 'Menit', value: remaining.minutes },
    { label: 'Detik', value: remaining.seconds },
  ];

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Hitung mundur menuju acara">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="inline-flex items-baseline gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs dark:bg-white/10"
        >
          <span className="font-bold tabular-nums text-gray-900 dark:text-white">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-body-color dark:text-body-color-dark">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
