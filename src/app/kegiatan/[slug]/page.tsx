'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, autoUpdateActivityStatus, parseLocalDate } from '@/lib/types';
import {
  FaLightbulb,
  FaArrowUp,
  FaHeart,
  FaShieldAlt,
  FaHandsHelping,
  FaStar,
} from 'react-icons/fa';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch('/api/kegiatan', { cache: 'no-store' });
        if (!response.ok) {
          router.push('/kegiatan');
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          router.push('/kegiatan');
          return;
        }

        const activities = autoUpdateActivityStatus(data);
        const foundActivity = activities.find(
          (a: Activity) => String(a.id) === String(params.slug)
        );
        if (foundActivity) {
          setActivity(foundActivity);
        } else {
          router.push('/kegiatan');
        }
      } catch (error) {
        console.error('Error loading activity:', error);
        router.push('/kegiatan');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
    const onFocus = () => loadActivity();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-body-color dark:text-body-color-dark">Memuat kegiatan...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return null;
  }

  const parsedDate = parseLocalDate(activity.date);
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : activity.date;

  const statusBadge =
    activity.status === 'ongoing'
      ? {
          label: 'Sedang Berlangsung',
          cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
        }
      : activity.status === 'upcoming'
        ? {
            label: 'Akan Datang',
            cls: 'bg-blue-50 text-primary ring-blue-200 dark:bg-primary/20 dark:text-sky-300 dark:ring-primary/30',
          }
        : {
            label: 'Selesai',
            cls: 'bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15',
          };

  const locationsText = Array.isArray(activity.locations)
    ? activity.locations.join(', ')
    : activity.locations || '-';

  return (
    <main className="bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* Beranda Section */}
      <section
        id="beranda"
        className="relative flex min-h-[560px] items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-28 pb-16 dark:from-gray-dark dark:via-gray-dark dark:to-black sm:min-h-[620px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-300 dark:hover:text-white"
            >
              ← Semua Kegiatan
            </Link>
            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusBadge.cls}`}
            >
              {statusBadge.label}
            </span>
          </div>

          <h1 className="mx-auto mb-5 max-w-4xl text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            {activity.hero_title || activity.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg md:text-xl">
            {activity.hero_subtitle || activity.description}
          </p>

          {(activity.hero_quote || activity.category) && (
            <p className="mt-6 text-sm italic text-body-color dark:text-body-color-dark sm:text-base">
              &ldquo;{activity.hero_quote || activity.category}&rdquo;
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#detail-acara"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              Lihat Detail &amp; Daftar
            </a>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section
        id="tentang-acara"
        className="relative overflow-hidden bg-slate-50/70 py-20 dark:bg-bg-color-dark"
      >
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300">
              <FaLightbulb className="h-3.5 w-3.5" />
              <span>{activity.category || 'Tentang Kegiatan'}</span>
            </div>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {activity.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
              {activity.about_section?.background || activity.description}
            </p>
          </div>

          {activity.about_section?.goals && activity.about_section.goals.length > 0 && (
            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <FaArrowUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tujuan Kami
                  </h3>
                  <div className="mt-1.5 h-1 w-12 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="space-y-4">
                {activity.about_section.goals.map((goal, index) => {
                  const icons = [FaShieldAlt, FaHeart, FaLightbulb, FaHandsHelping];
                  const Icon = icons[index % icons.length];

                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary dark:bg-primary/20 dark:text-sky-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                          {goal}
                        </h4>
                      </div>
                      <FaStar className="mt-1 h-4 w-4 flex-shrink-0 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Bottom */}
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-8 text-white shadow-lg sm:p-10">
              <h3 className="mb-3 text-2xl font-bold">
                Siap Bergabung dengan {activity.title}?
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-blue-100">
                {activity.description}
              </p>
              <a
                href="#detail-acara"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <FaHeart className="h-4 w-4" />
                <span>Daftar Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section id="detail-acara" className="bg-white py-16 dark:bg-black sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Semua yang Perlu Kamu Tahu
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-8">
              <div className="space-y-6">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-body-color dark:text-body-color-dark">
                      Tanggal &amp; Waktu
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formattedDate}
                      {activity.time && ` • ${activity.time}`}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-body-color dark:text-body-color-dark">Lokasi</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {locationsText}
                    </p>
                  </div>
                </div>

                {/* Embedded Map */}
                {Array.isArray(activity.locations) &&
                  activity.locations.length > 0 &&
                  activity.locations[0] && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-body-color dark:text-body-color-dark">
                        Peta Lokasi
                      </p>
                      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs dark:border-white/10">
                        <iframe
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            activity.locations.join(', ')
                          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    </div>
                  )}

                {/* Ticket Price */}
                {activity.ticket_price_min != null && activity.ticket_price_max != null ? (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Harga Tiket
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {`Rp ${Number(activity.ticket_price_min).toLocaleString('id-ID')} - Rp ${Number(
                          activity.ticket_price_max
                        ).toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  </div>
                ) : activity.ticket_price_min != null ? (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Harga Tiket
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {`Rp ${Number(activity.ticket_price_min).toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  </div>
                ) : activity.ticket_price != null ? (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Harga Tiket
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {Number(activity.ticket_price) > 0
                          ? `Rp ${Number(activity.ticket_price).toLocaleString('id-ID')}`
                          : 'Gratis'}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Capacity */}
                {activity.max_participants != null && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Kapasitas
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {activity.max_participants === 0
                          ? 'Unlimited'
                          : `${activity.max_participants} Peserta`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {activity.registration_link && (
                <div className="mt-8">
                  <a
                    href={activity.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                  >
                    Daftar Sekarang
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              {/* Contact Information */}
              {(activity.contact_person || activity.contact_phone) && (
                <div className="mt-8 border-t border-gray-200 pt-8 dark:border-white/10">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Informasi Kontak
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {activity.contact_person && (
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-6 w-6 text-primary dark:text-sky-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-body-color dark:text-body-color-dark">
                            Nama Kontak
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {activity.contact_person}
                          </p>
                        </div>
                      </div>
                    )}
                    {activity.contact_phone && (
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-6 w-6 text-primary dark:text-sky-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-body-color dark:text-body-color-dark">
                            No. Telepon
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {activity.contact_phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
