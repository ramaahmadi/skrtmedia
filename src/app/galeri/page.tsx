'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  FolderOpen,
  Image as ImageIcon,
  Instagram,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import OngoingActivityBar from '@/components/Common/OngoingActivityBar';
import {
  DEFAULT_CURATED_GALLERY,
  GalleryItem,
  resolveDriveMedia,
} from '@/lib/drive';

function DriveThumbnail({
  item,
  className = '',
}: {
  item: GalleryItem;
  className?: string;
}) {
  const media = resolveDriveMedia(item.drive_url, item.media_type);
  const [src, setSrc] = useState(media.thumbnailUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(media.thumbnailUrl);
    setFailed(false);
  }, [media.thumbnailUrl]);

  if (failed || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-slate-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 ${className}`}
      >
        {item.media_type === 'video' ? (
          <Film className="mb-2 h-10 w-10" />
        ) : (
          <ImageIcon className="mb-2 h-10 w-10" />
        )}
        <span className="px-4 text-center text-xs">
          {item.media_type === 'video' ? 'Klik untuk memutar video' : 'Pratinjau tidak tersedia'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={item.title}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (media.fallbackImageUrl && src !== media.fallbackImageUrl) {
          setSrc(media.fallbackImageUrl);
        } else {
          setFailed(true);
        }
      }}
      className={className}
    />
  );
}

function formatEventDate(value?: string | null, long = false): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: 'numeric',
  });
}

function getEventTimestamp(item: GalleryItem): number {
  const raw = item.event_date || item.created_at;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

interface AlbumGroup {
  key: string;
  albumName: string;
  dateKey: string;
  dateLabel: string | null;
  timestamp: number;
  category: string;
  albumUrl: string;
  items: GalleryItem[];
}

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [albumFilter, setAlbumFilter] = useState<string>('Semua Album');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc'>('date_desc');
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      const response = await fetch('/api/galeri', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          return;
        }
      }
      setItems(DEFAULT_CURATED_GALLERY);
    } catch (error) {
      console.error('Error loading gallery:', error);
      setItems(DEFAULT_CURATED_GALLERY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const photoItems = useMemo(
    () => items.filter((item) => !resolveDriveMedia(item.drive_url, item.media_type).isInstagram),
    [items]
  );

  const albumNames = useMemo(() => {
    const names = Array.from(
      new Set(
        photoItems.map((item) => (item.album_name || item.category || 'Dokumentasi SKRT').trim())
      )
    );
    return ['Semua Album', ...names];
  }, [photoItems]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchType =
        mediaFilter === 'all' || item.media_type === mediaFilter;
      const itemAlbum = (item.album_name || item.category || 'Dokumentasi SKRT').trim();
      const matchAlbum =
        albumFilter === 'Semua Album' || itemAlbum === albumFilter;
      return matchType && matchAlbum;
    });

    return [...filtered].sort((a, b) => {
      const diff = getEventTimestamp(b) - getEventTimestamp(a);
      if (diff !== 0) return sortBy === 'date_desc' ? diff : -diff;
      return Number(a.sort_order || 0) - Number(b.sort_order || 0);
    });
  }, [items, mediaFilter, albumFilter, sortBy]);

  // Group non-Instagram items into Albums by (Album Kegiatan + Tanggal)
  const photoAlbums = useMemo<AlbumGroup[]>(() => {
    const map = new Map<string, AlbumGroup>();

    for (const item of filteredItems) {
      const media = resolveDriveMedia(item.drive_url, item.media_type);
      if (media.isInstagram) continue;

      const albumName = (item.album_name || item.category || 'Dokumentasi SKRT').trim();
      const dateKey = item.event_date ? String(item.event_date).slice(0, 10) : 'undated';
      const key = `${albumName}__${dateKey}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          albumName,
          dateKey,
          dateLabel: formatEventDate(item.event_date, true),
          timestamp: getEventTimestamp(item),
          category: item.category || 'Dokumentasi',
          albumUrl: item.album_url || '',
          items: [],
        });
      }

      const group = map.get(key)!;
      group.items.push(item);
      if (!group.albumUrl && item.album_url) {
        group.albumUrl = item.album_url;
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const diff = b.timestamp - a.timestamp;
      return sortBy === 'date_desc' ? diff : -diff;
    });
  }, [filteredItems, sortBy]);

  const reelItems = useMemo(() => {
    if (mediaFilter === 'photo') return [];
    if (albumFilter !== 'Semua Album') return [];
    return items
      .filter((item) => resolveDriveMedia(item.drive_url, item.media_type).isInstagram)
      .sort((a, b) => {
        const diff = getEventTimestamp(b) - getEventTimestamp(a);
        if (diff !== 0) return sortBy === 'date_desc' ? diff : -diff;
        return Number(a.sort_order || 0) - Number(b.sort_order || 0);
      });
  }, [items, mediaFilter, albumFilter, sortBy]);

  const flatLightboxItems = useMemo(
    () => photoAlbums.flatMap((group) => group.items),
    [photoAlbums]
  );

  const activeIndex = useMemo(() => {
    if (!activePhotoId) return null;
    const idx = flatLightboxItems.findIndex((item) => item.id === activePhotoId);
    return idx >= 0 ? idx : null;
  }, [activePhotoId, flatLightboxItems]);

  const photoCount = useMemo(
    () => items.filter((i) => i.media_type === 'photo').length,
    [items]
  );
  const videoCount = useMemo(
    () => items.filter((i) => i.media_type === 'video').length,
    [items]
  );

  const mainAlbumLink = useMemo(
    () => items.find((i) => i.album_url && i.album_url.includes('drive.google.com'))?.album_url || '',
    [items]
  );

  const closeLightbox = useCallback(() => setActivePhotoId(null), []);
  const showPrev = useCallback(() => {
    if (activeIndex === null || flatLightboxItems.length === 0) return;
    const prevIdx = (activeIndex - 1 + flatLightboxItems.length) % flatLightboxItems.length;
    setActivePhotoId(flatLightboxItems[prevIdx].id);
  }, [activeIndex, flatLightboxItems]);

  const showNext = useCallback(() => {
    if (activeIndex === null || flatLightboxItems.length === 0) return;
    const nextIdx = (activeIndex + 1) % flatLightboxItems.length;
    setActivePhotoId(flatLightboxItems[nextIdx].id);
  }, [activeIndex, flatLightboxItems]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
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
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const activeItem =
    activeIndex !== null && flatLightboxItems[activeIndex]
      ? flatLightboxItems[activeIndex]
      : null;
  const activeMedia = activeItem
    ? resolveDriveMedia(activeItem.drive_url, activeItem.media_type)
    : null;

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32">
      <div className="container">
        <OngoingActivityBar />

        {/* Page Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Album Kegiatan &amp; Kurasi Terbaik
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Galeri Foto &amp; Video
          </h1>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Dokumentasi pilihan yang dikelompokkan berdasarkan album tiap
            kegiatan dan tanggal pelaksanaan SKRT MEDIA.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {mainAlbumLink && (
              <a
                href={mainAlbumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white dark:hover:border-primary/50 dark:hover:text-sky-400"
              >
                <FolderOpen className="h-4 w-4 text-primary dark:text-sky-400" />
                Buka Album Google Drive
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            )}
            <a
              href="https://www.instagram.com/skrtmedia.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Instagram className="h-4 w-4" />
              Follow @skrtmedia.id
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Interactive Filter & Album Controls */}
        <div className="mb-10 space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Media Type Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { key: 'all', label: `Semua (${items.length})` },
                  { key: 'photo', label: `Album Foto (${photoCount})` },
                  { key: 'video', label: `Video Reels (${videoCount})` },
                ] as const
              ).map((tab) => {
                const selected = mediaFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setMediaFilter(tab.key);
                      if (tab.key === 'video') setAlbumFilter('Semua Album');
                      setActivePhotoId(null);
                    }}
                    className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      selected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-slate-100 text-gray-700 hover:bg-slate-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort by Activity Date */}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
              <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-primary dark:text-sky-400" />
              <label htmlFor="galeri-sort" className="sr-only">
                Urutkan galeri
              </label>
              <select
                id="galeri-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'date_desc' | 'date_asc');
                  setActivePhotoId(null);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-gray-800 outline-none dark:text-gray-200"
              >
                <option value="date_desc" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
                  Tanggal Terbaru
                </option>
                <option value="date_asc" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
                  Tanggal Terlama
                </option>
              </select>
            </div>
          </div>

          {/* Album Filter Pills */}
          {mediaFilter !== 'video' && albumNames.length > 2 && (
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3 pb-1 dark:border-white/10 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {albumNames.map((name) => {
                const selected = albumFilter === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setAlbumFilter(name);
                      setActivePhotoId(null);
                    }}
                    className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? 'bg-primary/15 font-semibold text-primary ring-1 ring-primary/30 dark:bg-primary/25 dark:text-sky-300'
                        : 'bg-slate-100/70 text-body-color hover:bg-slate-200/70 dark:bg-white/5 dark:text-body-color-dark dark:hover:bg-white/10'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-[4/3] animate-pulse rounded-2xl border border-gray-200/80 bg-white dark:border-white/10 dark:bg-gray-dark"
              />
            ))}
          </div>
        ) : photoAlbums.length === 0 && reelItems.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-gray-200/80 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-gray-dark">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Belum Ada Media di Album Ini
            </h2>
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
              Coba pilih album atau filter lain untuk melihat dokumentasi kami.
            </p>
            <button
              type="button"
              onClick={() => {
                setMediaFilter('all');
                setAlbumFilter('Semua Album');
              }}
              className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Tampilkan Semua Album
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {/* Photo Albums Grouped by Event & Date */}
            {photoAlbums.map((album) => (
              <section key={album.key} aria-label={`Album ${album.albumName}`}>
                {/* Album Section Header */}
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-white/10">
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      {album.dateLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300">
                          <Calendar className="h-3.5 w-3.5" />
                          {album.dateLabel}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                        {album.category}
                      </span>
                      <span className="text-xs text-body-color dark:text-body-color-dark">
                        • {album.items.length} foto
                      </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                      {album.albumName}
                    </h2>
                  </div>

                  {album.albumUrl && (
                    <a
                      href={album.albumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline dark:text-sky-400 sm:text-sm"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Lihat Folder Drive
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* Album Photo Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {album.items.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => setActivePhotoId(item.id)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
                      whileHover={{ y: -4 }}
                      aria-label={`Buka foto: ${item.title}`}
                      className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200/80 bg-white text-left shadow-sm transition-shadow duration-300 hover:border-primary/40 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-gray-dark"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-gray-900">
                        <DriveThumbnail
                          item={item}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                        {item.media_type === 'video' && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg ring-4 ring-white/25 transition-transform duration-300 group-hover:scale-110">
                              <Play className="ml-0.5 h-6 w-6 fill-current" />
                            </span>
                          </div>
                        )}

                        <div className="absolute right-4 bottom-3.5 left-4">
                          <h3 className="line-clamp-1 text-base font-bold text-white drop-shadow-xs">
                            {item.title}
                          </h3>
                          {item.caption && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-gray-200">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            ))}

            {/* Instagram Reels Section (Uniform 4:5 Frameless Reel Grid) */}
            {reelItems.length > 0 && (
              <section aria-label="Album Video Reels @skrtmedia.id">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200/80 pb-4 dark:border-white/10">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300">
                        <Instagram className="h-3.5 w-3.5" />
                        Reels Instagram
                      </span>
                      <span className="text-xs text-body-color dark:text-body-color-dark">
                        • {reelItems.length} video
                      </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                      Video Reels @skrtmedia.id
                    </h2>
                  </div>
                  <a
                    href="https://www.instagram.com/skrtmedia.id/reels/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline dark:text-sky-400 sm:text-sm"
                  >
                    Lihat semua Reels
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {reelItems.map((item, idx) => {
                    const media = resolveDriveMedia(item.drive_url, item.media_type);
                    if (!media.isInstagram || !media.embedUrl) return null;

                    const innerAspectByCode: Record<string, string> = {
                      DbTMAbStxxM: 'aspect-[485/273]',
                      DMpZpTXzPVP: 'aspect-[485/263]',
                      DV5WPFRCQpp: 'aspect-[485/367]',
                    };
                    const innerAspect =
                      (media.instagramCode && innerAspectByCode[media.instagramCode]) ||
                      'h-full';

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
                        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-black/10 transition-shadow hover:shadow-xl dark:ring-white/10"
                      >
                        <div className={`relative w-full overflow-hidden ${innerAspect}`}>
                          <iframe
                            src={media.embedUrl}
                            title={item.title}
                            loading="lazy"
                            scrolling="no"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            className="absolute -top-[55px] left-0 h-[calc(100%+240px)] w-full border-0"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && activeMedia && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/88 p-4 backdrop-blur-xs sm:p-6"
          >
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-gray-950 shadow-2xl ring-1 ring-white/15"
            >
              <div className="relative aspect-[16/10] w-full bg-black">
                {activeMedia.isDirectVideo ? (
                  <video
                    src={activeMedia.originalUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (activeItem.media_type === 'video' || activeMedia.isYouTube) && activeMedia.embedUrl ? (
                  <iframe
                    src={activeMedia.embedUrl}
                    title={activeItem.title}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    className="h-full w-full border-0 bg-black"
                  />
                ) : (
                  <img
                    src={activeMedia.fullImageUrl}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (
                        activeMedia.fallbackImageUrl &&
                        e.currentTarget.src !== activeMedia.fallbackImageUrl
                      ) {
                        e.currentTarget.src = activeMedia.fallbackImageUrl;
                      }
                    }}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="flex flex-col justify-between gap-4 border-t border-white/10 bg-gray-900/95 px-5 py-4 text-white sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
                      {activeItem.album_name || activeItem.category || 'Dokumentasi'}
                    </span>
                    {formatEventDate(activeItem.event_date, true) && (
                      <span className="text-xs text-gray-300">
                        {formatEventDate(activeItem.event_date, true)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      • {(activeIndex ?? 0) + 1} / {flatLightboxItems.length}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-white sm:text-lg">
                    {activeItem.title}
                  </h3>
                  {activeItem.caption && (
                    <p className="mt-0.5 text-xs text-gray-300 sm:text-sm">
                      {activeItem.caption}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {activeMedia.isDrive && (
                    <a
                      href={activeItem.drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                    >
                      Buka di Drive
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {flatLightboxItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={showPrev}
                        aria-label="Media sebelumnya"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={showNext}
                        aria-label="Media berikutnya"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={closeLightbox}
                    aria-label="Tutup pratinjau"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
