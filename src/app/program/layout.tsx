import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Program Unggulan | SKRT MEDIA',
  description:
    'Kenali program unggulan komunitas SKRT MEDIA (Sempat Kelam, Resah, Tinggalkan): Kajian Rutin & Satset, Yatim Care, Qurban Bersama, dan Aksi Sosial.',
  alternates: { canonical: `${siteUrl}/program` },
  openGraph: {
    title: 'Program Unggulan | SKRT MEDIA',
    description:
      'Program kajian rutin, santunan Yatim Care, Qurban Bersama, dan aksi sosial komunitas SKRT MEDIA.',
    url: `${siteUrl}/program`,
    siteName: 'SKRT MEDIA',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: `${siteUrl}/icon-512.png`, width: 512, height: 512, alt: 'SKRT MEDIA' }],
  },
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
