'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ArmyHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/signin');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 dark:bg-black dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/skrt-army"
              className="text-2xl font-bold text-primary dark:text-white"
            >
              SKRT Army
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary transition"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
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