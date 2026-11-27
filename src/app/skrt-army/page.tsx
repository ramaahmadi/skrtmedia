'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  anggota: number;
  kegiatan: number;
  artikel: number;
  saldoKas: number;
}

const modules = [
  {
    href: '/skrt-army/berita',
    icon: '📝',
    title: 'Berita',
    description: 'Kelola berita acara dan pengumuman organisasi',
  },
  {
    href: '/skrt-army/artikel',
    icon: '📚',
    title: 'Artikel',
    description: 'Buat dan kelola artikel untuk halaman blog publik',
  },
  {
    href: '/skrt-army/kegiatan',
    icon: '🎯',
    title: 'Kegiatan',
    description: 'Kelola jadwal, harga tiket, dan detail kegiatan',
  },
  {
    href: '/skrt-army/pembukuan',
    icon: '💰',
    title: 'Pembukuan',
    description: 'Catat pemasukan dan pengeluaran keuangan kas',
  },
  {
    href: '/skrt-army/notulensi',
    icon: '📋',
    title: 'Notulensi',
    description: 'Catat dan arsipkan hasil rapat serta pertemuan',
  },
  {
    href: '/skrt-army/anggota',
    icon: '👥',
    title: 'Anggota',
    description: 'Kelola data panitia, anggota, dan hak akses',
  },
];

export default function SKRTArmyPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [anggotaRes, kegiatanRes, artikelRes, pembukuanRes] = await Promise.all([
          fetch('/api/anggota'),
          fetch('/api/kegiatan'),
          fetch('/api/artikel'),
          fetch('/api/pembukuan'),
        ]);

        const [anggota, kegiatan, artikel, pembukuan] = await Promise.all([
          anggotaRes.ok ? anggotaRes.json() : [],
          kegiatanRes.ok ? kegiatanRes.json() : [],
          artikelRes.ok ? artikelRes.json() : [],
          pembukuanRes.ok ? pembukuanRes.json() : [],
        ]);

        const saldoKas = Array.isArray(pembukuan)
          ? pembukuan.reduce((acc: number, item: any) => {
              const amount = Number(item.amount || 0);
              return item.type === 'income' ? acc + amount : acc - amount;
            }, 0)
          : 0;

        setStats({
          anggota: Array.isArray(anggota) ? anggota.length : 0,
          kegiatan: Array.isArray(kegiatan) ? kegiatan.length : 0,
          artikel: Array.isArray(artikel) ? artikel.length : 0,
          saldoKas,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/60 py-8 dark:bg-black">
      <div className="container">
        {/* Top Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Dashboard Panitia SKRT
            </h1>
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
              Kelola seluruh konten, kegiatan, anggota, dan pembukuan organisasi.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90"
          >
            ← Ke Web Utama
          </Link>
        </div>

        {/* Live Summary Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <p className="text-xs font-medium text-body-color uppercase dark:text-body-color-dark">
              Total Anggota
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {stats ? stats.anggota : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <p className="text-xs font-medium text-body-color uppercase dark:text-body-color-dark">
              Total Kegiatan
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {stats ? stats.kegiatan : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <p className="text-xs font-medium text-body-color uppercase dark:text-body-color-dark">
              Total Artikel
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {stats ? stats.artikel : '—'}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <p className="text-xs font-medium text-body-color uppercase dark:text-body-color-dark">
              Saldo Kas
            </p>
            <p
              className={`mt-2 text-xl font-bold sm:text-2xl ${
                stats && stats.saldoKas < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {stats ? `Rp ${stats.saldoKas.toLocaleString('id-ID')}` : '—'}
            </p>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
                  <span className="text-2xl">{mod.icon}</span>
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                  {mod.title}
                </h2>
                <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                  {mod.description}
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-sky-400">
                Buka Modul
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
