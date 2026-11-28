'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Reveal from '@/components/Common/Reveal';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'apa-itu-skrt',
    question: 'Apa itu SKRT MEDIA?',
    answer:
      'SKRT adalah singkatan dari "Sempat Kelam, Resah, Tinggalkan". Kami adalah komunitas generasi muda Muslim (Good Vibes, Good Circle) yang menjadi ruang aman untuk saling menguatkan dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.',
  },
  {
    id: 'cara-ikut-kegiatan',
    question: 'Bagaimana cara mengikuti kajian atau kegiatan SKRT?',
    answer:
      'Kamu bisa melihat seluruh jadwal kajian dan kegiatan yang sedang berlangsung maupun akan datang di halaman Kegiatan. Pilih acara yang ingin diikuti, simpan ke Google Calendar, atau langsung daftar melalui tautan pendaftaran yang tersedia.',
  },
  {
    id: 'terbuka-untuk-umum',
    question: 'Apakah kegiatan SKRT terbuka untuk umum?',
    answer:
      'Ya! Sebagian besar kajian dan kegiatan sosial SKRT terbuka untuk umum — siapa pun yang ingin belajar bersama, memperbaiki diri, dan mencari lingkungan pertemanan yang positif dipersilakan hadir.',
  },
  {
    id: 'bergabung-kolaborasi',
    question: 'Bagaimana jika ingin bergabung menjadi relawan atau berkolaborasi?',
    answer:
      'Kami sangat terbuka untuk kolaborasi media partner, sponsor kegiatan sosial, maupun relawan dakwah. Silakan hubungi tim kami langsung melalui halaman Kontak agar bisa segera terhubung via WhatsApp.',
  },
];

export default function CommunityFAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <section className="bg-white py-20 dark:bg-black md:py-24">
      <div className="container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Tanya Jawab
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
            Kenali lebih dekat komunitas SKRT MEDIA dan cara berpartisipasi dalam kegiatan kami.
          </p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <Reveal key={item.id} delay={idx * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                    isOpen
                      ? 'border-primary/40 bg-slate-50/80 shadow-xs dark:border-primary/40 dark:bg-gray-dark'
                      : 'border-gray-200/80 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-gray-dark/60 dark:hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    id={`faq-btn-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 dark:text-sky-400 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-btn-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:px-6 sm:text-base">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-8 text-center">
          <p className="text-sm text-body-color dark:text-body-color-dark">
            Masih punya pertanyaan lain?{' '}
            <Link
              href="/contact"
              className="font-semibold text-primary underline-offset-4 hover:underline dark:text-sky-400"
            >
              Hubungi kami langsung
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
