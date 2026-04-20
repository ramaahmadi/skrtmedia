'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SKRTArmyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const normalizedPhone = phone.replace(/[\s\-()]/g, '');

    const allowedPrefixes = [
      '082122451622',
    ];

    const isAllowed = allowedPrefixes.some(prefix => normalizedPhone.startsWith(prefix));

    if (isAllowed) {
      // Load members to find the name based on phone number
      const savedMembers = localStorage.getItem('skrt_members');
      let memberName = 'Admin';
      
      if (savedMembers) {
        const members = JSON.parse(savedMembers);
        const member = members.find((m: any) => m.phone === normalizedPhone);
        if (member) {
          memberName = member.name;
        }
      }

      localStorage.setItem('auth_token', 'skrt_army_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify({
        name: memberName,
        phone: normalizedPhone,
        designation: 'Admin'
      }));
      setIsAuthenticated(true);
    } else {
      setLoginError('Nomor handphone tidak terdaftar');
    }

    setIsLoggingIn(false);
  };


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFCFC] dark:bg-black">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-dark">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🛡️</span>
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white">
              Dashboard SKRT Army
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Halaman ini khusus untuk panitia SKRT MEDIA. Silakan login dengan nomor handphone.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nomor Handphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              {loginError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 px-6 py-3 font-medium text-white transition disabled:opacity-50 shadow-btn hover:shadow-btn-hover"
              >
                {isLoggingIn ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="mt-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
