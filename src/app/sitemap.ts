import type { MetadataRoute } from 'next';
import { getAllArtikel, getAllKegiatan } from '@/lib/db-queries';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function toValidDate(value: unknown, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kegiatan`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/galeri`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/donasi`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/kajian-trust-islam`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/trust-islam`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/qurban_registration`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  let kegiatanRoutes: MetadataRoute.Sitemap = [];
  let artikelRoutes: MetadataRoute.Sitemap = [];

  try {
    const kegiatanList = await getAllKegiatan();
    if (Array.isArray(kegiatanList)) {
      kegiatanRoutes = kegiatanList
        .filter((item) => item && item.id)
        .map((item) => ({
          url: `${baseUrl}/kegiatan/${encodeURIComponent(String(item.id))}`,
          lastModified: toValidDate(item.updated_at || item.created_at || item.date, now),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error('Error fetching kegiatan for sitemap:', error);
  }

  try {
    const artikelList = await getAllArtikel();
    if (Array.isArray(artikelList)) {
      artikelRoutes = artikelList
        .filter((item) => item && item.id)
        .map((item) => ({
          url: `${baseUrl}/blog/${encodeURIComponent(String(item.id))}`,
          lastModified: toValidDate(item.updated_at || item.created_at || item.publish_date, now),
          changeFrequency: 'monthly',
          priority: 0.75,
        }));
    }
  } catch (error) {
    console.error('Error fetching artikel for sitemap:', error);
  }

  return [...staticRoutes, ...kegiatanRoutes, ...artikelRoutes];
}
