'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Load articles from localStorage
    const savedArticles = localStorage.getItem('skrt_articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
    setLoading(false);
  }, []);

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

  return (
    <>
      <section className="pt-20 pb-16 sm:pt-[120px] sm:pb-[120px]">
        <div className="container text-center">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Belum Ada Artikel
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Silakan login ke dashboard panitia untuk menambahkan artikel
              </p>
              <Link
                href="/skrt-army"
                className="inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition"
              >
                Login Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="-mx-4 flex flex-wrap justify-center">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="w-full px-4 sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3"
                  >
                    <SingleBlog 
                      href={`/blog/${article.id}`}
                      blog={{
                        id: parseInt(article.id),
                        title: article.title,
                        paragraph: article.paragraph,
                        image: article.image,
                        author: {
                          name: article.author,
                          image: '/images/blog/author-03.png',
                          designation: article.designation
                        },
                        tags: article.tags,
                        publishDate: article.publishDate
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
                <div className="w-full px-4">
                  <ul className="flex items-center justify-center pt-8">
                    <li className="mx-1">
                      <span className="bg-body-color/15 text-body-color flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm cursor-not-allowed">
                        Prev
                      </span>
                    </li>
                    <li className="mx-1">
                      <span className="bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm text-white">
                        1
                      </span>
                    </li>
                    <li className="mx-1">
                      <span className="bg-body-color/15 text-body-color flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md px-4 text-sm">
                        Next
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
