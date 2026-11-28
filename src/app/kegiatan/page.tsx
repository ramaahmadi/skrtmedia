'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  autoUpdateActivityStatus,
  parseLocalDate,
  sortActivitiesByPriority,
} from '@/lib/types';

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed';

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/kegiatan', { cache: 'no-store' });
      if (!response.ok) {
        setActivities([]);
        return;
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        setActivities([]);
        return;
      }
      setActivities(sortActivitiesByPriority(autoUpdateActivityStatus(data)));
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
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

  const counts = useMemo(() => {
    return {
      all: activities.length,
      upcoming: activities.filter((a) => a.status === 'upcoming').length,
      ongoing: activities.filter((a) => a.status === 'ongoing').length,
      completed: activities.filter((a) => a.status === 'completed').length,
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((activity) => {
      const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const locText = Array.isArray(activity.locations)
        ? activity.locations.join(' ').toLowerCase()
        : String(activity.locations || '').toLowerCase();
      return (
        activity.title.toLowerCase().includes(q) ||
        (activity.description || '').toLowerCase().includes(q) ||
        locText.includes(q)
      );
    });
  }, [activities, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'Akan Datang',
          cls: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
        };
      case 'ongoing':
        return {
          label: 'Berlangsung',
          cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
        };
      case 'completed':
        return {
          label: 'Selesai',
          cls: 'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15',
        };
      default:
        return {
          label: status,
          cls: 'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15',
        };
    }
  };

  const formatPrice = (activity: Activity) => {
    if (activity.ticket_price_min != null && activity.ticket_price_max != null) {
      return `Rp ${Number(activity.ticket_price_min).toLocaleString('id-ID')} - Rp ${Number(activity.ticket_price_max).toLocaleString('id-ID')}`;
    }
    if (activity.ticket_price_min != null) {
      return `Rp ${Number(activity.ticket_price_min).toLocaleString('id-ID')}`;
    }
    if (activity.ticket_price != null && Number(activity.ticket_price) > 0) {
      return `Rp ${Number(activity.ticket_price).toLocaleString('id-ID')}`;
    }
    return 'Gratis';
  };

  const filterTabs: Array<{ key: StatusFilter; label: string }> = [
    { key: 'all', label: 'Semua' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'ongoing', label: 'Berlangsung' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32 sm:pb-24">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Agenda &amp; Program
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Kegiatan SKRT MEDIA
          </h1>
          <p className="text-base text-body-color dark:text-body-color-dark sm:text-lg">
            Ikuti kajian rutin, kegiatan sosial, dan acara inspiratif bersama komunitas kami.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mx-auto mb-10 max-w-4xl space-y-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              id="search-kegiatan"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan berdasarkan judul, deskripsi, atau lokasi..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pr-11 pl-12 text-sm text-gray-900 shadow-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-gray-dark dark:text-white dark:placeholder-gray-400 sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex flex-nowrap items-center justify-start gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {filterTabs.map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-gray-dark dark:text-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>
          {(searchQuery || statusFilter !== 'all') && !loading && (
            <p className="text-center text-xs text-body-color dark:text-body-color-dark">
              Menampilkan <strong>{filteredActivities.length}</strong> kegiatan
            </p>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="mx-auto max-w-4xl space-y-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-white/10 dark:bg-gray-dark sm:p-8"
              >
                <div className="mb-4 h-5 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="mb-3 h-7 w-3/4 rounded-lg bg-gray-200 dark:bg-white/10" />
                <div className="mb-6 h-4 w-full rounded bg-gray-100 dark:bg-white/5" />
                <div className="flex gap-4">
                  <div className="h-4 w-32 rounded bg-gray-100 dark:bg-white/5" />
                  <div className="h-4 w-28 rounded bg-gray-100 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="mx-auto max-w-4xl space-y-5">
            {filteredActivities.map((activity) => {
              const badge = getStatusBadge(activity.status);
              const dateObj = parseLocalDate(activity.date);
              const validDate = dateObj !== null;
              const locationsText = Array.isArray(activity.locations)
                ? activity.locations.join(', ')
                : activity.locations || '-';

              return (
                <Link
                  key={activity.id}
                  href={`/kegiatan/${activity.id}`}
                  className="group block"
                >
                  <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark sm:flex-row">
                    {/* Date Block */}
                    <div className="flex shrink-0 flex-row items-center justify-between gap-3 bg-primary/5 px-6 py-4 text-primary dark:bg-primary/15 dark:text-sky-300 sm:w-36 sm:flex-col sm:justify-center sm:py-6 sm:text-center">
                      {validDate ? (
                        <>
                          <span className="text-3xl font-extrabold leading-none sm:text-4xl">
                            {dateObj.getDate()}
                          </span>
                          <div className="text-right sm:text-center">
                            <p className="text-sm font-semibold">
                              {dateObj.toLocaleString('id-ID', { month: 'long' })}
                            </p>
                            <p className="text-xs opacity-80">{dateObj.getFullYear()}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-sm font-semibold">Segera</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                          {activity.category && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-sky-300">
                              {activity.category}
                            </span>
                          )}
                        </div>

                        <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary dark:text-white sm:text-2xl">
                          {activity.title}
                        </h2>
                        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:text-base">
                          {activity.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4 text-xs text-gray-600 dark:border-white/10 dark:text-gray-300 sm:text-sm">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="max-w-[200px] truncate">{locationsText}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatPrice(activity)}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5 dark:text-sky-400">
                          Lihat Detail
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white p-10 text-center shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {searchQuery || statusFilter !== 'all'
                ? 'Kegiatan Tidak Ditemukan'
                : 'Belum Ada Kegiatan'}
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              {searchQuery || statusFilter !== 'all'
                ? 'Coba ubah kata kunci pencarian atau pilih filter status lainnya.'
                : 'Silakan login ke dashboard panitia untuk menambahkan kegiatan baru.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Reset Filter
              </button>
            ) : (
              <Link
                href="/skrt-army"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Login Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
