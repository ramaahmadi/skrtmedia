'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
}

interface HeroGalleryProps {
  photos: GalleryPhoto[];
}

export default function HeroGallery({ photos }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    );
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, close, showPrev, showNext]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {photos.map((photo, idx) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setActiveIndex(idx)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * idx }}
            whileHover={{ y: -4 }}
            aria-label={`Perbesar foto: ${photo.caption}`}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-gray-100 text-left shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-800 dark:ring-white/10"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-end justify-between gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="line-clamp-2 text-xs font-medium text-white drop-shadow-xs">
                {photo.caption}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs">
                <Expand className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau foto dokumentasi SKRT MEDIA"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs sm:p-6"
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-950 shadow-2xl ring-1 ring-white/15"
            >
              <div className="relative aspect-[4/3] w-full bg-black sm:aspect-[16/10]">
                <Image
                  src={photos[activeIndex].src}
                  alt={photos[activeIndex].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-gray-900/95 px-5 py-4 text-white">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white sm:text-base">
                    {photos[activeIndex].caption}
                  </p>
                  <p className="text-xs text-gray-400">
                    Foto {activeIndex + 1} dari {photos.length} • Gunakan tombol panah atau Esc
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Foto sebelumnya"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Foto berikutnya"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Tutup pratinjau"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
