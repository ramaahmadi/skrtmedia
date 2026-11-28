import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Galeri Dokumentasi Pilihan | SKRT MEDIA',
  description:
    'Kurasi foto dan video dokumentasi terbaik kegiatan, kajian rutin, dan kebersamaan komunitas SKRT MEDIA (Sempat Kelam, Resah, Tinggalkan).',
  alternates: { canonical: `${siteUrl}/galeri` },
  openGraph: {
    title: 'Galeri Dokumentasi Pilihan | SKRT MEDIA',
    description:
      'Kurasi foto dan video dokumentasi terbaik kegiatan, kajian rutin, dan kebersamaan komunitas SKRT MEDIA.',
    url: `${siteUrl}/galeri`,
    siteName: 'SKRT MEDIA',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
