'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Frequency = 'all' | 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

interface RecurringActivity {
  id: string;
  title: string;
  frequency: Exclude<Frequency, 'all'>;
  schedule: string;
  description: string;
  virtue: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const RECURRING_ACTIVITIES: RecurringActivity[] = [
  {
    id: 'sholat-dzikir-tilawah',
    title: 'Sholat Berjamaah, Dzikir & Tilawah Harian',
    frequency: 'harian',
    schedule: 'Setiap Hari',
    description:
      'Menjaga sholat fardhu lima waktu tepat waktu berjamaah, rutin dzikir pagi & petang, serta tilawah Al-Qur’an minimal satu halaman per hari.',
    virtue: 'Menjaga ketenangan hati dan konsistensi kedekatan dengan Allah ﷻ.',
  },
  {
    id: 'puasa-senin-kamis',
    title: 'Puasa Sunnah Senin & Kamis',
    frequency: 'mingguan',
    schedule: 'Setiap Senin & Kamis',
    description:
      'Menghidupkan sunnah Rasulullah ﷺ dengan berpuasa di hari diangkatnya amal, melatih kesabaran, dan menjaga kesehatan jiwa raga.',
    virtue: '“Amal-amal diperiksa pada hari Senin dan Kamis, maka aku suka amalku diperiksa saat aku berpuasa.” (HR. Tirmidzi)',
  },
  {
    id: 'amalan-jumat',
    title: 'Sholat Jumat & Amalan Hari Jumat',
    frequency: 'mingguan',
    schedule: 'Setiap Hari Jumat',
    description:
      'Membaca Surah Al-Kahfi, memperbanyak shalawat kepada Nabi ﷺ, bersedekah di hari Jumat, serta menghadiri sholat Jumat lebih awal.',
    virtue: 'Sayyidul Ayyam (penghulu segala hari) penuh keberkahan dan waktu mustajab berdoa.',
  },
  {
    id: 'kajian-pekanan',
    title: 'Kajian Rutin & Halaqah Pekanan',
    frequency: 'mingguan',
    schedule: 'Setiap Pekan',
    description:
      'Majelis ilmu rutin untuk memperdalam pemahaman Islam, berdiskusi positif, dan menguatkan ukhuwah di lingkungan yang saling mengingatkan.',
    virtue: 'Menuntut ilmu adalah kewajiban setiap Muslim dan jalan menuju surga.',
    ctaLabel: 'Info Kajian',
    ctaHref: '/contact',
  },
  {
    id: 'puasa-ayyamul-bidh',
    title: 'Puasa Sunnah Ayyamul Bidh',
    frequency: 'bulanan',
    schedule: 'Tanggal 13, 14 & 15 Hijriah',
    description:
      'Puasa sunnah tiga hari pada pertengahan setiap bulan Hijriah (hari-hari putih saat bulan purnama).',
    virtue: '“Puasa tiga hari setiap bulan seperti berpuasa sepanjang tahun.” (HR. Bukhari & Muslim)',
  },
  {
    id: 'sedekah-santunan',
    title: 'Infak, Sedekah & Santunan Rutin',
    frequency: 'bulanan',
    schedule: 'Setiap Bulan',
    description:
      'Menyisihkan sebagian rezeki secara rutin untuk santunan anak yatim, kaum dhuafa, dan mendukung program sosial dakwah.',
    virtue: 'Harta tidak akan berkurang karena sedekah; justru Allah melipatgandakan keberkahannya.',
    ctaLabel: 'Salurkan Donasi',
    ctaHref: '/contact',
  },
  {
    id: 'puasa-ramadhan',
    title: 'Puasa Ramadhan, Tarawih & I’tikaf',
    frequency: 'tahunan',
    schedule: 'Bulan Ramadhan (1–30 Ramadhan)',
    description:
      'Ibadah puasa wajib sebulan penuh, menghidupkan malam dengan sholat Tarawih, tadarus Al-Qur’an, dan i’tikaf meraih Lailatul Qadar.',
    virtue: 'Bulan diturunkannya Al-Qur’an, pintu surga dibuka, dan pahala dilipatgandakan.',
  },
  {
    id: 'zakat-fitrah-maal',
    title: 'Zakat Fitrah & Zakat Maal',
    frequency: 'tahunan',
    schedule: 'Akhir Ramadhan / Haul Tahunan',
    description:
      'Menunaikan zakat fitrah sebelum Idul Fitri untuk menyucikan jiwa, serta zakat maal bagi harta yang telah mencapai nisab dan haul.',
    virtue: 'Menyucikan jiwa dan harta, sekaligus menghadirkan kebahagiaan bagi mustahik.',
  },
  {
    id: 'puasa-syawal',
    title: 'Puasa Sunnah 6 Hari di Bulan Syawal',
    frequency: 'tahunan',
    schedule: 'Bulan Syawal (6 Hari)',
    description:
      'Melanjutkan semangat ibadah Ramadhan dengan menunaikan enam hari puasa sunnah di bulan Syawal secara berurutan maupun terpisah.',
    virtue: '“Barangsiapa berpuasa Ramadhan lalu diikuti enam hari di bulan Syawal, maka seperti berpuasa setahun penuh.” (HR. Muslim)',
  },
  {
    id: 'arafah-qurban',
    title: 'Puasa Arafah & Ibadah Qurban (Idul Adha)',
    frequency: 'tahunan',
    schedule: '9–13 Dzulhijjah',
    description:
      'Puasa sunnah Arafah pada 9 Dzulhijjah bagi yang tidak berhaji, dilanjutkan sholat Idul Adha serta penyembelihan & distribusi hewan qurban.',
    virtue: 'Puasa Arafah menghapus dosa setahun yang lalu dan setahun yang akan datang (HR. Muslim).',
    ctaLabel: 'Daftar Qurban',
    ctaHref: '/qurban_registration',
  },
  {
    id: 'puasa-asyura',
    title: 'Puasa Tasu’a & Asyura',
    frequency: 'tahunan',
    schedule: '9 & 10 Muharram',
    description:
      'Puasa sunnah utama di bulan Muharram pada tanggal 9 (Tasu’a) dan 10 (Asyura) sebagai syukur dan pengingat awal tahun Hijriah.',
    virtue: '“Puasa hari Asyura, aku berharap kepada Allah agar dapat menghapus dosa setahun yang lalu.” (HR. Muslim)',
  },
];

const FREQUENCY_TABS: Array<{ key: Frequency; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'harian', label: 'Harian' },
  { key: 'mingguan', label: 'Mingguan' },
  { key: 'bulanan', label: 'Bulanan' },
  { key: 'tahunan', label: 'Tahunan' },
];

const FREQUENCY_STYLES: Record<Exclude<Frequency, 'all'>, { label: string; cls: string }> = {
  harian: {
    label: 'Harian',
    cls: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30',
  },
  mingguan: {
    label: 'Mingguan',
    cls: 'bg-blue-50 text-primary ring-blue-200 dark:bg-primary/20 dark:text-blue-300 dark:ring-primary/30',
  },
  bulanan: {
    label: 'Bulanan',
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  },
  tahunan: {
    label: 'Tahunan',
    cls: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  },
};

export default function RecurringIslamicActivities() {
  const [activeFreq, setActiveFreq] = useState<Frequency>('all');

  const counts = useMemo(() => {
    return {
      all: RECURRING_ACTIVITIES.length,
      harian: RECURRING_ACTIVITIES.filter((a) => a.frequency === 'harian').length,
      mingguan: RECURRING_ACTIVITIES.filter((a) => a.frequency === 'mingguan').length,
      bulanan: RECURRING_ACTIVITIES.filter((a) => a.frequency === 'bulanan').length,
      tahunan: RECURRING_ACTIVITIES.filter((a) => a.frequency === 'tahunan').length,
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFreq === 'all') return RECURRING_ACTIVITIES;
    return RECURRING_ACTIVITIES.filter((item) => item.frequency === activeFreq);
  }, [activeFreq]);

  return (
    <section
      id="kegiatan-muslim-berulang"
      className="mx-auto mt-20 max-w-5xl border-t border-gray-200/80 pt-16 dark:border-white/10"
    >
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Pengingat Ibadah Rutin
        </p>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          Kegiatan Muslim Berulang
        </h2>
        <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:text-base">
          Panduan ringkas ibadah dan amalan rutin umat Islam—mulai dari puasa sunnah &amp; wajib, zakat, sedekah, hingga qurban—agar kita saling mengingatkan dalam ketaatan.
        </p>
      </div>

      {/* Frequency Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {FREQUENCY_TABS.map((tab) => {
          const active = activeFreq === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFreq(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-gray-dark dark:text-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.map((item) => {
          const badge = FREQUENCY_STYLES[item.frequency];
          return (
            <article
              key={item.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <svg
                      className="h-3.5 w-3.5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {item.schedule}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                  {item.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-white/10">
                <p className="text-xs leading-relaxed text-gray-600 italic dark:text-gray-300">
                  {item.virtue}
                </p>
                {item.ctaHref && item.ctaLabel && (
                  <div className="mt-3">
                    <Link
                      href={item.ctaHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                      {item.ctaLabel}
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
