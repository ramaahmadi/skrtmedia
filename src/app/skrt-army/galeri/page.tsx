'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import {
  extractGoogleDriveFileId,
  GalleryItem,
  GalleryMediaType,
  resolveDriveMedia,
} from '@/lib/drive';

const CATEGORIES = ['Kajian', 'Sosial', 'Kebersamaan', 'Event', 'Dokumentasi'];

interface FormState {
  id: string;
  title: string;
  caption: string;
  category: string;
  media_type: GalleryMediaType;
  drive_url: string;
  album_url: string;
  is_featured: boolean;
  sort_order: number;
}

const EMPTY_FORM: FormState = {
  id: '',
  title: '',
  caption: '',
  category: 'Kajian',
  media_type: 'photo',
  drive_url: '',
  album_url: '',
  is_featured: true,
  sort_order: 0,
};

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch('/api/galeri?all=true', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading admin gallery:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const previewMedia = form.drive_url.trim()
    ? resolveDriveMedia(form.drive_url, form.media_type)
    : null;
  const detectedDriveId = extractGoogleDriveFileId(form.drive_url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/galeri', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setFeedback({ type: 'error', text: data.error || 'Gagal menyimpan item galeri.' });
        return;
      }

      setFeedback({
        type: 'success',
        text: isEditing
          ? 'Item galeri berhasil diperbarui.'
          : 'Item galeri baru berhasil ditambahkan.',
      });
      setForm(EMPTY_FORM);
      setIsEditing(false);
      await loadItems();
    } catch {
      setFeedback({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setForm({
      id: item.id,
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'Dokumentasi',
      media_type: item.media_type === 'video' ? 'video' : 'photo',
      drive_url: item.drive_url || '',
      album_url: item.album_url || '',
      is_featured: Boolean(item.is_featured),
      sort_order: Number(item.sort_order || 0),
    });
    setIsEditing(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    try {
      const response = await fetch('/api/galeri', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_featured: !item.is_featured,
        }),
      });
      if (response.ok) {
        await loadItems();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus item ini dari galeri?')) return;
    try {
      const response = await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        if (form.id === id) {
          setForm(EMPTY_FORM);
          setIsEditing(false);
        }
        await loadItems();
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const featuredCount = items.filter((i) => i.is_featured).length;

  return (
    <main className="min-h-screen bg-slate-50/60 py-8 dark:bg-black">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/skrt-army"
              className="mb-2 inline-block text-xs font-semibold text-primary hover:underline dark:text-sky-400"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Kelola Galeri Google Drive
            </h1>
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
              Tambahkan link foto/video dari Google Drive dan pilih hanya yang terbaik untuk ditampilkan di halaman publik.
            </p>
          </div>
          <Link
            href="/galeri"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-xs transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white"
          >
            Lihat Halaman Galeri
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Guide Alert */}
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 dark:border-primary/30 dark:bg-primary/10 dark:text-sky-200">
          <p className="font-semibold">Cara mengambil link Google Drive agar muncul di website:</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-xs sm:text-sm">
            <li>Buka file foto atau video di Google Drive, klik <strong>Bagikan (Share)</strong>.</li>
            <li>Pada <strong>Akses umum</strong>, ubah ke <strong>Siapa saja yang memiliki link (Pelihat)</strong>.</li>
            <li>Klik <strong>Salin link</strong> lalu tempelkan pada kolom <em>Link Google Drive</em> di bawah.</li>
            <li>Centang <strong>Pilihan Terbaik</strong> hanya untuk beberapa foto/video terbaik agar galeri tetap rapi.</li>
          </ol>
        </div>

        {/* Form + Live Preview */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark lg:col-span-2"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Item Galeri' : 'Tambah Foto / Video dari Google Drive'}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setIsEditing(false);
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  Batal Edit
                </button>
              )}
            </div>

            {feedback && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Link Google Drive atau Post/Reels Instagram *
                </label>
                <input
                  type="url"
                  required
                  value={form.drive_url}
                  onChange={(e) => setForm({ ...form, drive_url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/... atau https://www.instagram.com/reel/..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
                {form.drive_url.trim() && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs">
                    {detectedDriveId ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        ID Google Drive terdeteksi: <code className="font-mono">{detectedDriveId.slice(0, 12)}…</code>
                      </span>
                    ) : previewMedia?.isInstagram ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Link Post/Reels Instagram terdeteksi (siap di-embed)
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">
                        Bukan format link Google Drive / Instagram standar (akan dipakai sebagai URL langsung).
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Tipe Media *
                </label>
                <select
                  value={form.media_type}
                  onChange={(e) =>
                    setForm({ ...form, media_type: e.target.value as GalleryMediaType })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                >
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Judul Dokumentasi *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Kajian Bulanan SKRT — Ramadan 2026"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Keterangan singkat momen foto/video ini..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Link Folder Album Drive (Opsional)
                </label>
                <input
                  type="url"
                  value={form.album_url}
                  onChange={(e) => setForm({ ...form, album_url: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Urutan Tampil (kecil = lebih atas)
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Tampilkan di Galeri Publik (Pilihan Terbaik)
                    </span>
                    <p className="text-xs text-body-color dark:text-body-color-dark">
                      Hanya item yang dicentang ini yang muncul di halaman /galeri.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {saving
                  ? 'Menyimpan...'
                  : isEditing
                    ? 'Simpan Perubahan'
                    : 'Tambahkan ke Galeri'}
              </button>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
              Pratinjau Langsung
            </h3>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-black/50">
              {previewMedia ? (
                (form.media_type === 'video' || previewMedia.isInstagram) && previewMedia.embedUrl ? (
                  <iframe
                    src={previewMedia.embedUrl}
                    title="Pratinjau Media"
                    className="h-full w-full border-0 bg-white"
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <img
                    src={previewMedia.thumbnailUrl}
                    alt="Pratinjau Foto"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center text-gray-400">
                  {form.media_type === 'video' ? (
                    <Film className="mb-2 h-8 w-8" />
                  ) : (
                    <ImageIcon className="mb-2 h-8 w-8" />
                  )}
                  <p className="text-xs">
                    Tempelkan link Google Drive untuk melihat pratinjau foto/video di sini.
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-body-color dark:text-body-color-dark">
              Total tersimpan: <strong>{items.length}</strong> item • Ditampilkan di publik:{' '}
              <strong className="text-primary dark:text-sky-400">{featuredCount}</strong> pilihan terbaik.
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            Daftar Media Tersimpan ({items.length})
          </h2>

          {loading ? (
            <p className="py-8 text-center text-sm text-body-color dark:text-body-color-dark">
              Memuat data galeri...
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-body-color dark:text-body-color-dark">
              Belum ada media Google Drive yang disimpan. Saat kosong, halaman /galeri menampilkan 4 foto kurasi bawaan.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const media = resolveDriveMedia(item.drive_url, item.media_type);
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col overflow-hidden rounded-xl border transition ${
                      item.is_featured
                        ? 'border-primary/40 bg-white dark:bg-black/30'
                        : 'border-gray-200 bg-gray-50/70 opacity-75 dark:border-white/10 dark:bg-black/20'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-gray-900">
                      <img
                        src={media.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        {item.media_type === 'video' ? 'Video' : 'Foto'} • {item.category}
                      </span>
                      {item.is_featured && (
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-gray-950">
                          <Star className="h-3 w-3 fill-current" /> Terbaik
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="line-clamp-1 font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.caption && (
                          <p className="mt-1 line-clamp-2 text-xs text-body-color dark:text-body-color-dark">
                            {item.caption}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                            item.is_featured
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300'
                          }`}
                        >
                          <Star className="h-3.5 w-3.5" />
                          {item.is_featured ? 'Tampil' : 'Disembunyikan'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            aria-label="Edit item"
                            className="rounded-lg p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-white/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            aria-label="Hapus item"
                            className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
