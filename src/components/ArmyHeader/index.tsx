'use client';

import Link from 'next/link';

const ArmyHeader = () => {
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
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ArmyHeader;