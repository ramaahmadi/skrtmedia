import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-28 dark:bg-black">
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-12">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo/skrt-logo.svg"
            alt="SKRT MEDIA logo"
            width={120}
            height={46}
            className="h-10 w-auto"
          />
        </div>

        <p className="mb-2 text-sm font-bold tracking-[0.2em] text-primary uppercase">
          Error 404
        </p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:text-base">
          Maaf, halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau
          alamat URL-nya kurang tepat.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/kegiatan"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-200 dark:hover:text-white"
          >
            Lihat Kegiatan
          </Link>
        </div>
      </div>
    </main>
  );
}
