'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import { exportSingleItemToText } from '@/lib/exportToText';

interface EventNews {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
  role: string;
}

export default function BeritaPage() {
  const router = useRouter();
  const [eventNews, setEventNews] = useState<EventNews[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'kegiatan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadEventNews();
  }, []);

  const loadEventNews = async () => {
    try {
      const response = await fetch('/api/berita');
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        console.error('Error loading event news:', data.error, data.details);
        setEventNews([]);
        return;
      }
      
      setEventNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading event news:', error);
      setEventNews([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      const newsItem = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        date: new Date().toLocaleDateString('id-ID'),
        author: user.name || 'Panitia',
        role: user.role || 'member'
      };

      const response = await fetch('/api/berita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem)
      });

      if (response.ok) {
        await loadEventNews();
        setFormData({ title: '', content: '', category: 'kegiatan' });
        setShowModal(false);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Gagal menambah berita');
      }
    } catch (error) {
      console.error('Error creating news:', error);
      setErrorMessage('Gagal menambah berita. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNews = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteNews = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/berita?id=${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadEventNews();
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteNews = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'kegiatan': return 'bg-blue-100 text-blue-600';
      case 'pengumuman': return 'bg-yellow-100 text-yellow-600';
      case 'lomba': return 'bg-green-100 text-green-600';
      case 'sosial': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };


  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-black">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/skrt-army"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📝 Berita & Pengumuman
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola berita acara dan pengumuman organisasi
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90"
          >
            + Tambah Berita
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Berita</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{eventNews.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Kegiatan</p>
            <p className="text-2xl font-bold text-primary">{eventNews.filter(n => n.category === 'kegiatan').length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pengumuman</p>
            <p className="text-2xl font-bold text-primary">{eventNews.filter(n => n.category === 'pengumuman').length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Lainnya</p>
            <p className="text-2xl font-bold text-primary">{eventNews.filter(n => !['kegiatan', 'pengumuman'].includes(n.category)).length}</p>
          </div>
        </div>

        {/* News Feed */}
        <div className="space-y-6">
          {eventNews.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
              <span className="text-6xl">📰</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                Belum ada berita
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mulai dengan menambahkan berita pertama untuk organisasi
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="w-full rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
              >
                Tambah Berita Pertama
              </button>
            </div>
          ) : (
            eventNews.map((news) => (
              <div key={news.id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary">
                        {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {news.date}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        • {news.author}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {news.content}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => exportSingleItemToText(news, 'Berita & Pengumuman', `berita-${news.title}`)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                      title="Export"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Tambah Berita Baru
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitNews} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="kegiatan">Kegiatan</option>
                    <option value="pengumuman">Pengumuman</option>
                    <option value="lomba">Lomba</option>
                    <option value="sosial">Sosial</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Judul Berita
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul berita..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Isi Berita
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Tulis detail berita di sini..."
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 shadow-btn hover:shadow-btn-hover"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Hapus Berita"
          message="Apakah Anda yakin ingin menghapus berita ini?"
          onConfirm={confirmDeleteNews}
          onCancel={cancelDeleteNews}
        />
      </div>
    </div>
  );
}
