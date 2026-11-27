'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  autoUpdateActivityStatus,
  parseLocalDate,
  sortActivitiesByPriority,
} from '@/lib/types';

export default function OngoingActivityBar() {
  const [activity, setActivity] = useState<Activity | null>(null);

  const loadLatest = useCallback(async () => {
    try {
      const res = await fetch('/api/kegiatan', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const sorted = sortActivitiesByPriority(autoUpdateActivityStatus(data));
      setActivity(sorted[0] || null);
    } catch (error) {
      console.error('Error loading ongoing activity:', error);
    }
  }, []);

  useEffect(() => {
    loadLatest();
    const onFocus = () => loadLatest();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadLatest]);

  if (!activity) return null;

  const badge =
    activity.status === 'ongoing'
      ? {
          text: 'Sedang Berlangsung',
          cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
        }
      : activity.status === 'upcoming'
        ? {
            text: 'Akan Datang',
            cls: 'bg-blue-50 text-primary ring-blue-200 dark:bg-primary/20 dark:text-sky-300 dark:ring-primary/30',
          }
        : {
            text: 'Kegiatan Terbaru',
            cls: 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15',
          };

  const dateObj = parseLocalDate(activity.date);
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="container mb-8 px-4 sm:px-6">
      <Link
        href={`/kegiatan/${activity.id}`}
        className="group flex flex-col items-start justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white px-5 py-4 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.cls}`}
          >
            {badge.text}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white sm:text-base">
              {activity.title}
            </p>
            {formattedDate && (
              <p className="text-xs text-body-color dark:text-body-color-dark">
                {formattedDate}
                {activity.time ? ` • ${activity.time}` : ''}
              </p>
            )}
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary dark:text-sky-400 sm:text-sm">
          Detail Kegiatan →
        </span>
      </Link>
    </div>
  );
}
