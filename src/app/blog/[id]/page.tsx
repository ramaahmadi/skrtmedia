'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      const articleId = params.id as string;
      
      try {
        // Fetch all articles from API
        const response = await fetch('/api/artikel');
        const data = await response.json();
        
        // Find the specific article
        const foundArticle = data.find((item: any) => item.id === articleId);
        if (foundArticle) {
          // Transform API data to match the expected structure
          setArticle({
            id: foundArticle.id,
            title: foundArticle.title,
            paragraph: foundArticle.paragraph,
            image: foundArticle.images && foundArticle.images.length > 0 ? foundArticle.images[0] : '/images/blog/blog-01.jpg',
            author: foundArticle.author || 'SKRT Team',
            designation: foundArticle.role || 'Member',
            tags: ['Artikel'],
            publishDate: foundArticle.publish_date || foundArticle.publishDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          });
        } else {
          // Article not found, redirect to blog page
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
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Artikel Tidak Ditemukan
          </h1>
          <Link
            href="/blog"
            className="inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition"
          >
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="pt-[120px] pb-[120px]">
        <div className="container text-center">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Blog
            </Link>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    SKRT
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{article.author}</p>
                    <p className="text-sm">{article.designation}</p>
                  </div>
                </div>
                <span>•</span>
                <span>{article.publishDate}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.paragraph}
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    SKRT
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{article.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{article.designation}</p>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-white hover:bg-primary/90 transition rounded-lg"
                >
                  Lihat Artikel Lainnya
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
