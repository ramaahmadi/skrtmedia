'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GalleryItem, resolveDriveMedia } from '@/lib/drive';

export interface GalleryPhoto {
  src: string;
  fallbackSrc?: string | null;
  alt: string;
  caption: string;
  dateLabel?: string | null;
}

interface HeroGalleryProps {
  photos: GalleryPhoto[];
}

function formatDateBadge(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function HeroGallery({ photos: fallbackPhotos }: HeroGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackPhotos);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const loadLatestPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/galeri', { cache: 'no-store' });
      if (!response.ok) return;
      const data: GalleryItem[] = await response.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const latestPhotos = data
        .filter((item) => item.media_type === 'photo')
        .sort((a, b) => {
          const tA = new Date(a.event_date || a.created_at || 0).getTime() || 0;
          const tB = new Date(b.event_date || b.created_at || 0).getTime() || 0;
          if (tB !== tA) return tB - tA;
          return Number(a.sort_order || 0) - Number(b.sort_order || 0);
        })
        .slice(0, 4)
        .map((item) => {
          const media = resolveDriveMedia(item.drive_url, 'photo');
          return {
            src: media.thumbnailUrl,
            fallbackSrc: media.fallbackImageUrl,
            alt: item.title,
            caption: item.caption ? `${item.title} — ${item.caption}` : item.title,
            dateLabel: formatDateBadge(item.event_date),
          };
        })
        .filter((p) => Boolean(p.src));

      if (latestPhotos.length > 0) {
        setPhotos(latestPhotos);
      }
    } catch (error) {
      console.error('Error loading latest hero gallery photos:', error);
    }
  }, []);

  useEffect(() => {
    loadLatestPhotos();
    const onFocus = () => loadLatestPhotos();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadLatestPhotos]);

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

  const activePhoto =
    activeIndex !== null && photos[activeIndex] ? photos[activeIndex] : null;

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {photos.map((photo, idx) => (
          <motion.button
            key={`${photo.src}-${idx}`}
            type="button"
            onClick={() => setActiveIndex(idx)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * idx }}
            whileHover={{ y: -4 }}
            aria-label={`Perbesar foto: ${photo.alt}`}
            className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100 text-left shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-800 dark:ring-white/10"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (photo.fallbackSrc && e.currentTarget.src !== photo.fallbackSrc) {
                  e.currentTarget.src = photo.fallbackSrc;
                }
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {photo.dateLabel && (
              <span className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                <Calendar className="h-2.5 w-2.5" />
                {photo.dateLabel}
              </span>
            )}
            <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex translate-y-2 items-end justify-between gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="line-clamp-2 text-xs font-medium text-white drop-shadow-xs">
                {photo.alt}
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
        {activePhoto && activeIndex !== null && (
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
                <img
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (
                      activePhoto.fallbackSrc &&
                      e.currentTarget.src !== activePhoto.fallbackSrc
                    ) {
                      e.currentTarget.src = activePhoto.fallbackSrc;
                    }
                  }}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-gray-900/95 px-5 py-4 text-white">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white sm:text-base">
                    {activePhoto.caption}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activePhoto.dateLabel ? `${activePhoto.dateLabel} • ` : ''}
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
