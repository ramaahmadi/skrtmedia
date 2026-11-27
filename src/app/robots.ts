import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skrtmedia.id';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/skrt-army/', '/api/', '/private'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
