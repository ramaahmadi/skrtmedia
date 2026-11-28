'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  HandHeart,
  HeartHandshake,
  Sparkles,
  Users,
} from 'lucide-react';
import OngoingActivityBar from '@/components/Common/OngoingActivityBar';
import Reveal from '@/components/Common/Reveal';

interface ProgramItem {
  id: string;
  label: string;
  title: string;
  tagline: string;
  description: string;
  schedule: string;
  icon: React.ReactNode;
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const PROGRAMS: ProgramItem[] = [
  {
    id: 'kajian',
    label: 'Kajian & Satset',
    title: 'Kajian Rutin & Satset SKRT',
    tagline: 'Belajar ilmu agama dengan suasana santai, hangat, dan membumi.',
    description:
      'Program inti SKRT MEDIA yang mempertemukan generasi muda Muslim dalam majelis ilmu, sharing circle, dan diskusi kehidupan sehari-hari. Hadir dengan bahasa yang dekat dengan anak muda agar semakin mudah diamalkan.',
    schedule: 'Rutin bulanan & agenda tematik Ramadhan',
    icon: <BookOpen className="h-5 w-5" />,
    highlights: [
      'Kajian tematik bersama ustadz & narasumber inspiratif',
      'Sesi Satset (sharing circle & bincang santai anak muda)',
      'Terbuka untuk umum tanpa syarat latar belakang',
      'Lingkungan pertemanan yang positif dan saling menguatkan',
    ],
    primaryCta: { label: 'Lihat Jadwal Kegiatan', href: '/kegiatan' },
    secondaryCta: { label: 'Lihat Dokumentasi', href: '/galeri' },
  },
  {
    id: 'yatim-care',
    label: 'Yatim Care',
    title: 'Program Yatim Care',
    tagline: 'Berbagi kebahagiaan dan santunan bersama adik-adik yatim & duafa.',
    description:
      'Gerakan kepedulian sosial yang rutin dilaksanakan di berbagai masjid dan lingkungan masyarakat (Al-Istiqomah, Al-Huda, Sumber Urip, Pacing, dan lainnya) melalui santunan, bingkisan, doa bersama, dan sesi bermain ceria.',
    schedule: 'Berkala & momentum spesial Ramadhan',
    icon: <HandHeart className="h-5 w-5" />,
    highlights: [
      'Penyaluran santunan dan paket bingkisan SKRT secara langsung',
      'Interaksi hangat, kuis ceria, dan doa bersama',
      'Kolaborasi bersama takmir masjid dan relawan lokal',
      'Laporan dokumentasi transparan di galeri komunitas',
    ],
    primaryCta: { label: 'Ikut Berdonasi', href: '/donasi' },
    secondaryCta: { label: 'Lihat Galeri Yatim Care', href: '/galeri' },
  },
  {
    id: 'qurban',
    label: 'Qurban Bersama',
    title: 'Pelaksanaan & Distribusi Qurban',
    tagline: 'Memudahkan ibadah qurban dan menyalurkan daging tepat sasaran.',
    description:
      'Setiap Idul Adha, SKRT MEDIA mengoordinasikan pendaftaran pekurban, penyembelihan sesuai syariat, hingga pendistribusian daging qurban kepada masyarakat yang membutuhkan secara merata.',
    schedule: 'Tahunan — Menjelang & Hari Raya Idul Adha',
    icon: <HeartHandshake className="h-5 w-5" />,
    highlights: [
      'Pendaftaran online mudah dan transparan',
      'Dikelola langsung oleh panitia dan relawan SKRT',
      'Distribusi daging menjangkau warga yang membutuhkan',
      'Dokumentasi lengkap untuk setiap pekurban',
    ],
    primaryCta: { label: 'Daftar Qurban', href: '/qurban_registration' },
    secondaryCta: { label: 'Tanya Panitia', href: '/contact' },
  },
  {
    id: 'aksi-sosial',
    label: 'Aksi Sosial',
    title: 'Aksi Sosial & Peduli Sesama',
    tagline: 'Hadir nyata di tengah masyarakat saat dibutuhkan.',
    description:
      'Mulai dari kegiatan bersih-bersih masjid, penggalangan dan penyaluran donasi korban banjir, hingga berbagai aksi kemanusiaan cepat tanggap yang melibatkan langsung para relawan muda SKRT.',
    schedule: 'Insidental & tanggap darurat kemanusiaan',
    icon: <Users className="h-5 w-5" />,
    highlights: [
      'Aksi bersih-bersih masjid dan fasilitas ibadah',
      'Penggalangan dan penyaluran bantuan korban bencana/banjir',
      'Terbuka untuk relawan baru maupun kolaborasi komunitas',
      'Semangat gotong royong dan kepedulian nyata',
    ],
    primaryCta: { label: 'Gabung Relawan', href: '/gabung' },
    secondaryCta: { label: 'Salurkan Bantuan', href: '/donasi' },
  },
];

const IMPACT_STATS = [
  { value: '4+', label: 'Program Utama Aktif' },
  { value: '10+', label: 'Lokasi Masjid & Komunitas' },
  { value: '100%', label: 'Terbuka untuk Umum' },
  { value: 'Good Circle', label: 'Lingkungan Saling Menguatkan' },
];

export default function ProgramPage() {
  const [activeId, setActiveId] = useState<string>(PROGRAMS[0].id);
  const activeProgram = PROGRAMS.find((p) => p.id === activeId) || PROGRAMS[0];

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32">
      <div className="container">
        <OngoingActivityBar />

        {/* Header */}
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Program Unggulan SKRT
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Tumbuh Bersama dalam Ketaatan &amp; Kebaikan
          </h1>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Berbagai ruang belajar, berbagi, dan bergerak yang dirancang agar
            generasi muda Muslim dapat saling menguatkan secara nyata.
          </p>
        </Reveal>

        {/* Impact Strip */}
        <Reveal delay={0.08} className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {IMPACT_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200/80 bg-white p-4 text-center shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-5"
            >
              <p className="text-xl font-extrabold tracking-tight text-primary dark:text-sky-400 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-body-color dark:text-body-color-dark">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Interactive Program Switcher */}
        <div className="mx-auto max-w-5xl">
          <div
            role="tablist"
            aria-label="Pilih program SKRT MEDIA"
            className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
          >
            {PROGRAMS.map((program) => {
              const isSelected = program.id === activeId;
              return (
                <button
                  key={program.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(program.id)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md'
                      : 'border border-gray-200/80 bg-white text-gray-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-gray-dark dark:text-gray-200 dark:hover:text-sky-400'
                  }`}
                >
                  {program.icon}
                  {program.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-10"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300">
                    <Calendar className="h-3.5 w-3.5" />
                    {activeProgram.schedule}
                  </div>
                  <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    {activeProgram.title}
                  </h2>
                  <p className="mb-4 text-base font-medium text-primary dark:text-sky-400">
                    {activeProgram.tagline}
                  </p>
                  <p className="mb-6 text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:text-base">
                    {activeProgram.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={activeProgram.primaryCta.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      {activeProgram.primaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={activeProgram.secondaryCta.href}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:text-sky-400"
                    >
                      {activeProgram.secondaryCta.label}
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-black/30 sm:p-6 lg:col-span-5">
                  <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase dark:text-white">
                    Fokus &amp; Nilai Program
                  </h3>
                  <ul className="space-y-3">
                    {activeProgram.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-200"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-sky-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <Reveal delay={0.12} className="mx-auto mt-14 max-w-4xl rounded-3xl bg-primary px-6 py-10 text-center text-white shadow-lg sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ingin Ikut Berkontribusi di Program SKRT?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
            Mulai dari hadir di kajian, menjadi relawan sosial, hingga ikut mendukung donasi kebaikan.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gabung"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50"
            >
              Gabung Komunitas
            </Link>
            <Link
              href="/donasi"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Dukung Donasi
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
