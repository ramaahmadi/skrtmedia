import type { Metadata } from 'next';
import { getKegiatanById } from '@/lib/db-queries';
import { cleanExcerpt, getSiteUrl, resolveOgImage } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/kegiatan/${encodeURIComponent(slug)}`;

  const fallback: Metadata = {
    title: 'Detail Kegiatan | SKRT MEDIA',
    description: 'Informasi lengkap kegiatan dan kajian komunitas SKRT MEDIA (Sempat Kelam, Resah, Tinggalkan).',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Detail Kegiatan | SKRT MEDIA',
      description: 'Informasi lengkap kegiatan dan kajian komunitas SKRT MEDIA.',
      url: canonicalUrl,
      siteName: 'SKRT MEDIA',
      locale: 'id_ID',
      type: 'website',
      images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Detail Kegiatan | SKRT MEDIA',
      description: 'Informasi lengkap kegiatan dan kajian komunitas SKRT MEDIA.',
      images: [`${siteUrl}/icon-512.png`],
    },
  };

  try {
    const activity = await getKegiatanById(slug);
    if (!activity) return fallback;

    const title = activity.title || activity.hero_title || 'Detail Kegiatan';
    const rawDesc =
      activity.description ||
      activity.hero_subtitle ||
      `Ikuti kegiatan ${title} bersama komunitas SKRT MEDIA.`;

    const formatDateId = (value: unknown): string => {
      if (!value) return '';
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const isCoordinates = (text: string) =>
      /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(text);

    const rawLocations = Array.isArray(activity.locations)
      ? activity.locations
      : typeof activity.locations === 'string'
        ? [activity.locations]
        : [];

    const locations = rawLocations
      .map((loc: unknown) => String(loc || '').trim())
      .filter((loc: string) => Boolean(loc) && !isCoordinates(loc))
      .join(', ');

    const formattedDate = formatDateId(activity.date);
    const metaParts = [formattedDate, locations].filter(Boolean).join(' • ');
    const description = cleanExcerpt(
      metaParts ? `${metaParts} — ${rawDesc}` : rawDesc,
      160
    );

    const ogImage = resolveOgImage(activity.image);

    return {
      title: `${title} | Kegiatan SKRT MEDIA`,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${title} | SKRT MEDIA`,
        description,
        url: canonicalUrl,
        siteName: 'SKRT MEDIA',
        locale: 'id_ID',
        type: 'website',
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
    console.error('Error generating kegiatan metadata:', error);
    return fallback;
  }
}

export default function KegiatanDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
