'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react';

interface QuoteItem {
  text: string;
  source: string;
}

const QUOTES: QuoteItem[] = [
  {
    text: 'Seorang mukmin terhadap mukmin lainnya seperti satu bangunan, sebagiannya menguatkan yang lainnya.',
    source: 'HR. Bukhari & Muslim',
  },
  {
    text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.',
    source: 'HR. Ahmad & Ath-Thabrani',
  },
  {
    text: 'Amalan yang paling dicintai oleh Allah adalah amalan yang kontinu walaupun sedikit.',
    source: 'HR. Bukhari & Muslim',
  },
  {
    text: 'Barang siapa menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.',
    source: 'HR. Muslim',
  },
];

export default function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);

  const current = QUOTES[index];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${current.text}" — ${current.source}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mx-auto mb-10 max-w-2xl rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-4 shadow-xs backdrop-blur-xs transition-colors dark:border-white/10 dark:bg-white/5 sm:px-6 sm:py-5"
    >
      <div className="min-h-[72px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 sm:text-base"
          >
            &ldquo;{current.text}&rdquo;
            <footer className="mt-1.5 text-xs font-semibold text-primary dark:text-sky-400">
              — {current.source}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 dark:border-white/10">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih kutipan hadits">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Kutipan ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-5 bg-primary dark:bg-sky-400'
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-white/20 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Salin kutipan"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-sky-400"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salin</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length)}
            aria-label="Kutipan sebelumnya"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev + 1) % QUOTES.length)}
            aria-label="Kutipan berikutnya"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
