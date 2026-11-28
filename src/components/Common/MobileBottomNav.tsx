'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Calendar, HandHeart, Home, Images } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/kegiatan', label: 'Kegiatan', icon: Calendar },
  { href: '/galeri', label: 'Galeri', icon: Images },
  { href: '/blog', label: 'Artikel', icon: BookOpen },
  { href: '/donasi', label: 'Donasi', icon: HandHeart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Cepat Mobile"
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200/80 bg-white/90 px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/10 dark:bg-gray-dark/90 lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-sky-300'
                    : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Icon className="mb-0.5 h-4 w-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
