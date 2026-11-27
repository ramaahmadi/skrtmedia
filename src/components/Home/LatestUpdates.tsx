'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  autoUpdateActivityStatus,
  parseLocalDate,
  sortActivitiesByPriority,
} from '@/lib/types';

interface ArticleSummary {
  id: string;
  title: string;
  paragraph: string;
  author: string;
  publishDate: string;
}

export default function LatestUpdates() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [kegRes, artRes] = await Promise.all([
        fetch('/api/kegiatan', { cache: 'no-store' }),
        fetch('/api/artikel', { cache: 'no-store' }),
      ]);

      if (kegRes.ok) {
        const kegData = await kegRes.json();
        if (Array.isArray(kegData)) {
          const activeActivities = sortActivitiesByPriority(
            autoUpdateActivityStatus(kegData)
          ).filter((a) => a.status === 'ongoing' || a.status === 'upcoming');
          setActivities(activeActivities.slice(0, 3));
        }
      }

      if (artRes.ok) {
        const artData = await artRes.json();
        if (Array.isArray(artData)) {
          setArticles(
            artData.slice(0, 3).map((item: any) => ({
              id: String(item.id),
              title: item.title || '',
              paragraph: item.paragraph || '',
              author: item.author || 'SKRT Team',
              publishDate: item.publish_date || item.publishDate || '',
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error loading latest updates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const onFocus = () => loadData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadData]);

  const getStatusBadge = (status: Activity['status']) => {
    if (status === 'ongoing') {
      return {
        label: 'Sedang Berlangsung',
        cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
      };
    }
    return {
      label: 'Akan Datang',
      cls: 'bg-blue-50 text-primary ring-blue-200 dark:bg-primary/20 dark:text-sky-300 dark:ring-primary/30',
    };
  };

  if (!loading && activities.length === 0 && articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 dark:bg-black md:py-24">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Informasi Terkini
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {activities.length > 0 ? 'Update Kegiatan & Artikel' : 'Artikel Terbaru'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link
              href="/kegiatan"
              className="text-primary transition hover:text-primary/80 dark:text-sky-400"
            >
              Semua Kegiatan →
            </Link>
            <Link
              href="/blog"
              className="text-body-color transition hover:text-primary dark:text-body-color-dark dark:hover:text-white"
            >
              Semua Artikel →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-52 animate-pulse rounded-2xl border border-gray-200/80 bg-slate-50 dark:border-white/10 dark:bg-gray-dark"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Activities Grid */}
            {activities.length > 0 && (
              <div>
                <h3 className="mb-5 text-sm font-semibold tracking-wider text-body-color uppercase dark:text-body-color-dark">
                  Kegiatan Berlangsung &amp; Terbaru
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activities.map((activity) => {
                    const badge = getStatusBadge(activity.status);
                    const dateObj = parseLocalDate(activity.date);
                    const dateText = dateObj
                      ? dateObj.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-';

                    return (
                      <Link
                        key={activity.id}
                        href={`/kegiatan/${activity.id}`}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark"
                      >
                        <div>
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-xs text-body-color dark:text-body-color-dark">
                              {dateText}
                            </span>
                          </div>
                          <h4 className="mb-2 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                            {activity.title}
                          </h4>
                          <p className="line-clamp-2 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                            {activity.description}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-primary dark:border-white/10 dark:text-sky-400">
                          <span>Lihat Info Kegiatan</span>
                          <span>→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {articles.length > 0 && (
              <div>
                <h3 className="mb-5 text-sm font-semibold tracking-wider text-body-color uppercase dark:text-body-color-dark">
                  Artikel Terbaru
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.id}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-gray-dark"
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between text-xs text-body-color dark:text-body-color-dark">
                          <span className="font-semibold text-primary dark:text-sky-400">
                            Artikel
                          </span>
                          <span>{article.publishDate}</span>
                        </div>
                        <h4 className="mb-2 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                          {article.title}
                        </h4>
                        <p className="line-clamp-2 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                          {article.paragraph}
                        </p>
                      </div>
                      <p className="mt-4 text-xs font-medium text-body-color dark:text-body-color-dark">
                        Oleh {article.author}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
