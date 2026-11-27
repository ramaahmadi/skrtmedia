'use client';

import { useEffect, useMemo, useState } from 'react';
import SingleBlog from "@/components/Blog/SingleBlog";
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  paragraph: string;
  image: string;
  author: string;
  designation: string;
  tags: string[];
  publishDate: string;
}

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch('/api/artikel');
        if (!response.ok) {
          setArticles([]);
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          setArticles([]);
          return;
        }
        const transformedArticles = data.map((item: any) => ({
          id: String(item.id),
          title: item.title,
          paragraph: item.paragraph,
          image: item.images && item.images.length > 0 ? item.images[0] : '/images/blog/blog-01.jpg',
          author: item.author || 'SKRT Team',
          designation: item.role || 'Member',
          tags: ['Artikel'],
          publishDate:
            item.publish_date ||
            item.publishDate ||
            new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
        }));
        setArticles(transformedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.paragraph || '').toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 dark:bg-black sm:pt-32 sm:pb-24">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Tulisan &amp; Refleksi
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Artikel SKRT MEDIA
          </h1>
          <p className="text-base text-body-color dark:text-body-color-dark sm:text-lg">
            Bacaan ringan, catatan kajian, dan pengingat kebaikan untuk menemani langkah sehari-hari.
          </p>
        </div>

        {/* Search Input */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              id="search-artikel"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berdasarkan judul atau penulis..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pr-4 pl-12 text-sm text-gray-900 shadow-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-gray-dark dark:text-white dark:placeholder-gray-400 sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="mb-4 h-5 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="mb-3 h-6 w-4/5 rounded bg-gray-200 dark:bg-white/10" />
                <div className="mb-2 h-4 w-full rounded bg-gray-100 dark:bg-white/5" />
                <div className="mb-6 h-4 w-2/3 rounded bg-gray-100 dark:bg-white/5" />
                <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-white/5" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white p-10 text-center shadow-xs dark:border-white/10 dark:bg-gray-dark">
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? 'Artikel Tidak Ditemukan' : 'Belum Ada Artikel'}
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              {searchQuery
                ? 'Coba kata kunci pencarian lain.'
                : 'Silakan login ke dashboard panitia untuk menambahkan artikel.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Reset Pencarian
              </button>
            ) : (
              <Link
                href="/skrt-army"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Login Dashboard
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <SingleBlog
                key={article.id}
                href={`/blog/${article.id}`}
                blog={{
                  id: Number.isNaN(Number(article.id)) ? index + 1 : Number(article.id),
                  title: article.title,
                  paragraph: article.paragraph,
                  image: article.image,
                  author: {
                    name: article.author,
                    image: '/images/blog/author-03.png',
                    designation: article.designation,
                  },
                  tags: article.tags,
                  publishDate: article.publishDate,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Blog;
