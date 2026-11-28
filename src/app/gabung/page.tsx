'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Camera,
  CheckCircle2,
  HandHeart,
  Handshake,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import OngoingActivityBar from '@/components/Common/OngoingActivityBar';
import Reveal from '@/components/Common/Reveal';

const ROLES = [
  {
    id: 'Peserta Kajian & Komunitas',
    title: 'Peserta Kajian',
    desc: 'Ikut kajian rutin, Satset, dan info kegiatan terbaru SKRT.',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'Relawan Aksi Sosial',
    title: 'Relawan Sosial',
    desc: 'Terlibat langsung di Yatim Care, Qurban, & aksi peduli sesama.',
    icon: <HandHeart className="h-5 w-5" />,
  },
  {
    id: 'Tim Kreatif & Media',
    title: 'Kreatif & Media',
    desc: 'Berkarya lewat fotografi, videografi, desain, atau penulisan dakwah.',
    icon: <Camera className="h-5 w-5" />,
  },
  {
    id: 'Kolaborasi & Media Partner',
    title: 'Kolaborasi / Partner',
    desc: 'Kerja sama acara, sponsor kegiatan sosial, atau media partner.',
    icon: <Handshake className="h-5 w-5" />,
  },
];

const STEPS = [
  { step: '01', title: 'Pilih Peran', desc: 'Tentukan minat kontribusimu di komunitas SKRT.' },
  { step: '02', title: 'Isi Data Singkat', desc: 'Lengkapi nama, domisili, dan pesan perkenalan.' },
  { step: '03', title: 'Terhubung via WhatsApp', desc: 'Tim kami akan menyambut dan mengundangmu ke circle SKRT.' },
];

export default function GabungPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Assalamu'alaikum Admin SKRT MEDIA,",
      '',
      'Saya ingin bergabung bersama komunitas SKRT MEDIA:',
      `• Nama: ${name.trim()}`,
      `• Domisili: ${city.trim()}`,
      `• No. WhatsApp: ${phone.trim()}`,
      `• Minat / Peran: ${selectedRole}`,
      note.trim() ? `• Pesan: ${note.trim()}` : '',
      '',
      'Terima kasih!',
    ].filter(Boolean);

    const url = `https://wa.me/62895338683425?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32">
      <div className="container max-w-5xl">
        <OngoingActivityBar />

        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Good Vibes, Good Circle
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Gabung Bersama SKRT MEDIA
          </h1>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Siapa pun kamu, dari mana pun langkahmu dimulai — pintu kebersamaan
            dalam ketaatan selalu terbuka lebar.
          </p>
        </Reveal>

        {/* 3 Steps */}
        <Reveal delay={0.06} className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark"
            >
              <span className="text-xs font-extrabold tracking-widest text-primary dark:text-sky-400">
                LANGKAH {item.step}
              </span>
              <h2 className="mt-1.5 text-base font-bold text-gray-900 dark:text-white">
                {item.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-body-color dark:text-body-color-dark sm:text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Interactive Form Card */}
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:p-10"
          >
            <div className="mb-6">
              <label className="mb-3 block text-sm font-bold text-gray-900 dark:text-white">
                1. Pilih Minat / Peran Kamu
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map((role) => {
                  const active = selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? 'border-primary bg-primary/5 ring-1 ring-primary dark:bg-primary/15'
                          : 'border-gray-200 bg-white hover:border-primary/40 dark:border-white/10 dark:bg-black/30'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-primary dark:bg-white/10 dark:text-sky-400'
                        }`}
                      >
                        {role.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {role.title}
                          </span>
                          {active && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary dark:text-sky-400" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                          {role.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
                2. Lengkapi Data Perkenalan
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="join-name"
                    className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="join-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama kamu"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="join-city"
                    className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Domisili / Kecamatan *
                  </label>
                  <input
                    id="join-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Karawang / Bekasi"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="join-phone"
                    className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Nomor WhatsApp *
                  </label>
                  <input
                    id="join-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="join-note"
                    className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Pesan atau Harapan Singkat (Opsional)
                  </label>
                  <textarea
                    id="join-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ceritakan sedikit tentang dirimu atau kegiatan yang ingin diikuti..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {submitted && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                <MessageCircle className="h-4 w-4 shrink-0" />
                Pesan perkenalan telah dibuka di WhatsApp. Sampai jumpa di circle SKRT MEDIA!
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto sm:text-base"
            >
              <Send className="h-4 w-4" />
              Kirim Pendaftaran via WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
