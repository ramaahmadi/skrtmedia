import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Gabung Komunitas | SKRT MEDIA',
  description:
    'Bergabung bersama komunitas SKRT MEDIA (Sempat Kelam, Resah, Tinggalkan) sebagai peserta kajian, relawan sosial, tim kreatif media, atau partner kolaborasi.',
  alternates: { canonical: `${siteUrl}/gabung` },
  openGraph: {
    title: 'Gabung Komunitas | SKRT MEDIA',
    description:
      'Temukan lingkungan yang saling menguatkan dalam ketaatan bersama keluarga besar SKRT MEDIA.',
    url: `${siteUrl}/gabung`,
    siteName: 'SKRT MEDIA',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
  },
};

export default function GabungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
