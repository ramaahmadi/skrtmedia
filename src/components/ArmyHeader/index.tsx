'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggler from '@/components/Header/ThemeToggler';

const ArmyHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    router.push('/signin');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-gray-dark/90">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/skrt-army"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-primary dark:text-white sm:text-xl"
          >
            <Image
              src="/images/logo/skrt-logo.svg"
              alt="SKRT MEDIA logo"
              width={96}
              height={36}
              priority
              className="h-8 w-auto"
            />
            <span className="border-l border-gray-300 pl-2.5 text-sm font-semibold text-gray-700 dark:border-white/20 dark:text-gray-200 sm:text-base">
              Army
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggler />
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-dark transition hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-white/10 dark:hover:text-sky-400"
            >
              Beranda
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArmyHeader;