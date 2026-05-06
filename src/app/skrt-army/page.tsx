'use client';

import Link from 'next/link';

export default function SKRTArmyPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-black">
      <div className="container py-8">
        {/* Button to main website */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary hover:bg-primary/90 px-6 py-3 font-medium text-white transition shadow-btn hover:shadow-btn-hover"
          >
            ← Ke Web Utama
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/skrt-army/berita"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Berita
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola berita acara dan pengumuman organisasi
            </p>
          </Link>

          <Link
            href="/skrt-army/artikel"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Artikel
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Buat dan kelola artikel untuk blog
            </p>
          </Link>

          <Link
            href="/skrt-army/kegiatan"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Kegiatan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola jadwal dan detail kegiatan
            </p>
          </Link>

          <Link
            href="/skrt-army/pembukuan"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Pembukuan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Catat pemasukan dan pengeluaran keuangan
            </p>
          </Link>

          <Link
            href="/skrt-army/notulensi"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Notulensi
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Catat notulensi rapat dan pertemuan
            </p>
          </Link>

          <Link
            href="/skrt-army/anggota"
            className="group rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Anggota
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data anggota dan hak akses
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
