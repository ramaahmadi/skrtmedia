import type { Metadata } from 'next';
import { getArtikelById } from '@/lib/db-queries';
import { cleanExcerpt, getSiteUrl, resolveOgImage } from '@/lib/seo';

interface Props {
  params: Promise<{ id: string }>;
}

function extractFirstImage(images: unknown): string | null {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
    return images[0];
  }
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      return images;
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/blog/${encodeURIComponent(id)}`;

  const fallback: Metadata = {
    title: 'Artikel | SKRT MEDIA',
    description: 'Baca artikel dan tulisan inspiratif dari komunitas SKRT MEDIA (Sempat Kelam, Resah, Tinggalkan).',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Artikel | SKRT MEDIA',
      description: 'Baca artikel dan tulisan inspiratif dari komunitas SKRT MEDIA.',
      url: canonicalUrl,
      siteName: 'SKRT MEDIA',
      locale: 'id_ID',
      type: 'article',
      images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Artikel | SKRT MEDIA',
      description: 'Baca artikel dan tulisan inspiratif dari komunitas SKRT MEDIA.',
      images: [`${siteUrl}/icon-512.png`],
    },
  };

  try {
    const article = await getArtikelById(id);
    if (!article) return fallback;

    const title = article.title || 'Artikel SKRT MEDIA';
    const description =
      cleanExcerpt(article.paragraph, 160) ||
      `Baca artikel "${title}" dari komunitas SKRT MEDIA.`;
    const author = article.author || 'SKRT Team';
    const ogImage = resolveOgImage(extractFirstImage(article.images));
    const publishedTime = article.created_at
      ? new Date(article.created_at).toISOString()
      : undefined;

    return {
      title: `${title} | Blog SKRT MEDIA`,
      description,
      authors: [{ name: author }],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${title} | SKRT MEDIA`,
        description,
        url: canonicalUrl,
        siteName: 'SKRT MEDIA',
        locale: 'id_ID',
        type: 'article',
        publishedTime,
        authors: [author],
        images: [{ url: ogImage, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | SKRT MEDIA`,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return fallback;
  }
}

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
