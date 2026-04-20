'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Article {
  id: string;
  title: string;
  paragraph: string;
  images: string[];
  author: string;
  designation: string;
  publishDate: string;
}

export default function ArtikelPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    paragraph: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_data');
      
      if (token && user) {
        setIsAuthenticated(true);
        loadArticles();
      } else {
        setIsAuthenticated(false);
        router.push('/skrt-army');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadArticles = () => {
    const savedArticles = localStorage.getItem('skrt_articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
  };

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArticleForm({
      ...articleForm,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentImages = articleForm.images.length;
    const remainingSlots = maxImages - currentImages;
    const filesToProcess = Math.min(files.length, remainingSlots);

    if (files.length > remainingSlots) {
      alert(`Maksimal ${maxImages} gambar. Hanya ${remainingSlots} gambar yang akan ditambahkan.`);
    }

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleForm(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setArticleForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      const article: Article = {
        id: Date.now().toString(),
        title: articleForm.title,
        paragraph: articleForm.paragraph,
        images: articleForm.images,
        author: user.name || 'Admin',
        designation: user.designation || 'Panitia SKRT',
        publishDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const existingArticles = JSON.parse(localStorage.getItem('skrt_articles') || '[]');
      const updatedArticles = [article, ...existingArticles];
      localStorage.setItem('skrt_articles', JSON.stringify(updatedArticles));
      
      setArticles(updatedArticles);
      setArticleForm({ title: '', paragraph: '', images: [] });
      setShowModal(false);
    } catch (error) {
      console.error('Gagal menambahkan artikel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteArticle = () => {
    if (itemToDelete) {
      const updatedArticles = articles.filter(article => article.id !== itemToDelete);
      setArticles(updatedArticles);
      localStorage.setItem('skrt_articles', JSON.stringify(updatedArticles));
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteArticle = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

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
              📚 Manajemen Artikel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola artikel untuk blog organisasi
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/blog"
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Lihat Blog
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
            >
              + Tambah Artikel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Artikel</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{articles.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Dengan Gambar</p>
            <p className="text-2xl font-bold text-primary">{articles.filter(a => a.images.length > 0).length}</p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
              <span className="text-6xl">📝</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                Belum ada artikel
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mulai dengan menambahkan artikel pertama untuk blog
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
              >
                Tambah Artikel Pertama
              </button>
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="rounded-lg bg-white shadow-sm dark:bg-gray-dark overflow-hidden">
                {article.images && article.images.length > 0 && (
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={article.images[0]}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {article.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{article.images.length - 1} lainnya
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {article.publishDate}
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {article.paragraph}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {article.author}
                    </p>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
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
            <div 
              className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Tambah Artikel Baru
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitArticle} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Judul Artikel
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={articleForm.title}
                    onChange={handleArticleChange}
                    placeholder="Masukkan judul artikel..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Gambar (Maksimal 5 gambar)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={articleForm.images.length >= 5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {articleForm.images.length}/5 gambar terupload
                  </p>
                  {articleForm.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {articleForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Isi Artikel
                  </label>
                  <textarea
                    name="paragraph"
                    value={articleForm.paragraph}
                    onChange={handleArticleChange}
                    placeholder="Tulis konten artikel di sini..."
                    rows={8}
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
          title="Hapus Artikel"
          message="Apakah Anda yakin ingin menghapus artikel ini?"
          onConfirm={confirmDeleteArticle}
          onCancel={cancelDeleteArticle}
        />
      </div>
    </div>
  );
}
