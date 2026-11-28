import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Donasi & Kolaborasi Kebaikan | SKRT MEDIA',
  description:
    'Salurkan infaq dan dukungan terbaikmu untuk program Yatim Care, Kajian Rutin, Qurban Bersama, dan Aksi Sosial komunitas SKRT MEDIA.',
  alternates: { canonical: `${siteUrl}/donasi` },
  openGraph: {
    title: 'Donasi & Kolaborasi Kebaikan | SKRT MEDIA',
    description:
      'Bersama menebar manfaat melalui program sosial dan dakwah generasi muda SKRT MEDIA.',
    url: `${siteUrl}/donasi`,
    siteName: 'SKRT MEDIA',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
  },
};

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
