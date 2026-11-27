'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ShareButtons from '@/components/Common/ShareButtons';

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

function estimateReadingMinutes(text: string): number {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      const articleId = params.id as string;

      try {
        const response = await fetch('/api/artikel', { cache: 'no-store' });
        if (!response.ok) {
          router.push('/blog');
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          router.push('/blog');
          return;
        }

        const transform = (item: any): Article => ({
          id: String(item.id),
          title: item.title || '',
          paragraph: item.paragraph || '',
          image:
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : '',
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
        });

        const foundArticle = data.find(
          (item: any) => String(item.id) === String(articleId)
        );
        if (foundArticle) {
          setArticle(transform(foundArticle));
          const others = data
            .filter((item: any) => String(item.id) !== String(articleId))
            .slice(0, 3)
            .map(transform);
          setRelatedArticles(others);
        } else {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
    const onFocus = () => loadArticle();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-body-color dark:text-body-color-dark">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Artikel Tidak Ditemukan
          </h1>
          <Link
            href="/blog"
            className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
          >
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  const readMinutes = estimateReadingMinutes(article.paragraph);

  return (
    <main className="min-h-screen bg-white pt-28 pb-20 dark:bg-black sm:pt-32 sm:pb-24">
      <div className="container px-4 sm:px-6">
        {/* Back Button */}
        <div className="mx-auto mb-8 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-body-color transition hover:text-primary dark:text-body-color-dark dark:hover:text-sky-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Artikel
          </Link>
        </div>

        {/* Article Container */}
        <article className="mx-auto max-w-4xl text-left">
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs text-body-color dark:text-body-color-dark">
                • {readMinutes} menit baca
              </span>
            </div>

            <h1 className="mb-5 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-body-color dark:text-body-color-dark">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20 dark:text-sky-300">
                  {(article.author || 'SK').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {article.author}
                  </p>
                  <p className="text-xs">{article.designation}</p>
                </div>
              </div>
              <span>•</span>
              <span>{article.publishDate}</span>
            </div>
          </header>

          {/* Optional Cover Image */}
          {article.image && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/10">
              <img
                src={article.image}
                alt={article.title}
                className="max-h-[460px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg sm:leading-8">
              {article.paragraph}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-10 rounded-2xl border border-gray-200/80 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-gray-dark">
            <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Bagikan artikel ini
            </p>
            <ShareButtons
              title={article.title}
              description={article.paragraph.slice(0, 140)}
              path={`/blog/${article.id}`}
            />
          </div>

          {/* Article Footer */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20 dark:text-sky-300">
                {(article.author || 'SK').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {article.author}
                </p>
                <p className="text-xs text-body-color dark:text-body-color-dark">
                  {article.designation}
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Lihat Artikel Lainnya
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mx-auto mt-16 max-w-4xl border-t border-gray-200 pt-12 dark:border-white/10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
                >
                  <div>
                    <p className="mb-2 text-xs text-body-color dark:text-body-color-dark">
                      {rel.publishDate}
                    </p>
                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                      {rel.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                      {rel.paragraph}
                    </p>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-primary dark:text-sky-400">
                    Baca selengkapnya →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
