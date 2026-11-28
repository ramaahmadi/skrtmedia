'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  HandHeart,
  Heart,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import OngoingActivityBar from '@/components/Common/OngoingActivityBar';
import Reveal from '@/components/Common/Reveal';

const DONATION_PROGRAMS = [
  {
    id: 'Yatim Care (Santunan Anak Yatim & Duafa)',
    label: 'Yatim Care',
    desc: 'Paket bingkisan dan santunan anak yatim & duafa di masjid binaan.',
  },
  {
    id: 'Operasional Kajian & Dakwah Pemuda',
    label: 'Kajian & Dakwah',
    desc: 'Mendukung penyelenggaraan kajian rutin, Satset, dan media dakwah.',
  },
  {
    id: 'Aksi Sosial & Tanggap Bencana',
    label: 'Aksi Sosial',
    desc: 'Bersih-bersih masjid, donasi korban banjir, dan kegiatan kemanusiaan.',
  },
  {
    id: 'Infaq Umum Komunitas SKRT',
    label: 'Infaq Umum',
    desc: 'Disalurkan ke program kebaikan SKRT yang paling membutuhkan.',
  },
];

const QUICK_AMOUNTS = [25000, 50000, 100000, 250000, 500000];

export default function DonasiPage() {
  const [selectedProgram, setSelectedProgram] = useState(DONATION_PROGRAMS[0].id);
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [prayer, setPrayer] = useState('');
  const [sent, setSent] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount.replace(/\D/g, '')) : amount;
  const formattedAmount =
    effectiveAmount > 0
      ? `Rp ${effectiveAmount.toLocaleString('id-ID')}`
      : 'Nominal bebas';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Assalamu'alaikum Admin SKRT MEDIA,",
      '',
      'Saya ingin berpartisipasi dalam Donasi / Infaq Kebaikan:',
      `• Nama Donatur: ${donorName.trim() || 'Hamba Allah'}`,
      `• Program: ${selectedProgram}`,
      `• Rencana Nominal: ${formattedAmount}`,
      prayer.trim() ? `• Doa / Niat: ${prayer.trim()}` : '',
      '',
      'Mohon informasi nomor rekening / QRIS resmi SKRT MEDIA. Terima kasih!',
    ].filter(Boolean);

    const url = `https://wa.me/62895338683425?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32">
      <div className="container max-w-4xl">
        <OngoingActivityBar />

        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Kolaborasi Kebaikan
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Dukung Program Kebaikan SKRT
          </h1>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Setiap kontribusi terbaikmu membantu menghadirkan kajian rutin,
            santunan Yatim Care, dan aksi sosial yang berdampak langsung.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-10"
          >
            {/* Step 1: Program */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-bold text-gray-900 dark:text-white">
                1. Pilih Program Kebaikan
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DONATION_PROGRAMS.map((prog) => {
                  const active = selectedProgram === prog.id;
                  return (
                    <motion.button
                      key={prog.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProgram(prog.id)}
                      className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? 'border-primary bg-primary/5 ring-1 ring-primary dark:bg-primary/15'
                          : 'border-gray-200 bg-white hover:border-primary/40 dark:border-white/10 dark:bg-black/30'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {prog.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                          {prog.desc}
                        </p>
                      </div>
                      {active && (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-sky-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Nominal */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-bold text-gray-900 dark:text-white">
                2. Pilih Nominal Infaq / Donasi
              </label>
              <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {QUICK_AMOUNTS.map((val) => {
                  const active = !customAmount && amount === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                        active
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-gray-200 bg-slate-50 text-gray-800 hover:border-primary/40 dark:border-white/10 dark:bg-black/30 dark:text-gray-200'
                      }`}
                    >
                      Rp {(val / 1000).toLocaleString('id-ID')}rb
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="Atau ketik nominal lain (contoh: 150000)"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
              />
            </div>

            {/* Step 3: Identity & Prayer */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="donor-name"
                  className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Nama Donatur (kosongkan jika ingin sebagai &ldquo;Hamba Allah&rdquo;)
                </label>
                <input
                  id="donor-name"
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Hamba Allah"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="donor-prayer"
                  className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Titip Doa / Niat Kebaikan (Opsional)
                </label>
                <textarea
                  id="donor-prayer"
                  rows={2}
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  placeholder="Semoga menjadi amal jariyah dan keberkahan bagi keluarga..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:bg-primary/10 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <HandHeart className="mt-0.5 h-6 w-6 shrink-0 text-primary dark:text-sky-400" />
                <div>
                  <p className="text-xs font-semibold text-body-color dark:text-body-color-dark">
                    Ringkasan Donasi
                  </p>
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {formattedAmount}
                  </p>
                  <p className="text-xs text-primary dark:text-sky-400">
                    {selectedProgram}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                Konfirmasi via WhatsApp
              </button>
            </div>

            {sent && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                <MessageCircle className="h-4 w-4 shrink-0" />
                Jazakumullahu khairan! Konfirmasi donasi telah dibuka di WhatsApp resmi SKRT MEDIA.
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-body-color dark:text-body-color-dark">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Penyaluran transparan &amp; terdokumentasi di Galeri
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-primary dark:text-sky-400" />
                Langsung terhubung dengan pengurus resmi SKRT
              </span>
            </div>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
