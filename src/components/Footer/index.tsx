"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-gray-200/80 bg-white pt-16 pb-10 dark:border-white/10 dark:bg-gray-dark">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/logo/skrt-logo.svg"
                alt="SKRT MEDIA logo"
                className="h-auto w-40"
                width={140}
                height={30}
              />
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-body-color dark:text-body-color-dark">
              Sempat Kelam Resah Tinggalkan — Komunitas anak muda Muslim yang
              hadir sebagai partner dalam ketaatan. Good Vibes, Good Circle.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/skrtmedia.id"
                aria-label="Instagram SKRT MEDIA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-body-color transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white dark:border-white/10 dark:text-body-color-dark dark:hover:border-primary dark:hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-black uppercase dark:text-white">
              Navigasi
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/kegiatan"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Program & Akses Column */}
          <div className="md:col-span-4">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-black uppercase dark:text-white">
              Program & Akses
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/qurban_registration"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Pendaftaran Qurban Bersama
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/skrt-army"
                  className="text-body-color transition-colors hover:text-primary dark:text-body-color-dark dark:hover:text-white"
                >
                  Dashboard Panitia (SKRT Army)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/80 pt-6 text-center text-xs text-body-color dark:border-white/10 dark:text-body-color-dark sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {currentYear} SKRT MEDIA Indonesia. Seluruh hak cipta dilindungi.</p>
          <p className="mt-2 sm:mt-0">Good Vibes, Good Circle.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
