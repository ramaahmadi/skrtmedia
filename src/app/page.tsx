import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import CommunityCTA from "@/components/Home/CommunityCTA";
import CommunityFAQ from "@/components/Home/CommunityFAQ";
import LatestUpdates from "@/components/Home/LatestUpdates";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skrtmedia.id"),
  title: "SKRT MEDIA INDONESIA — Good Vibes, Good Circle",
  description:
    "Sempat Kelam Resah Tinggalkan. Komunitas anak muda Muslim yang hadir sebagai partner dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.",
  icons: {
    icon: [
      { url: "/icon-192.png?v=skrt3", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico?v=skrt3", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico?v=skrt3",
    apple: "/icon-192.png?v=skrt3",
  },
  openGraph: {
    title: "SKRT MEDIA INDONESIA — Good Vibes, Good Circle",
    description:
      "Komunitas anak muda Muslim yang hadir sebagai partner dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.",
    type: "website",
    locale: "id_ID",
    images: ["/icon-512.png"],
  },
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <LatestUpdates />
      <Features />
      <CommunityFAQ />
      <CommunityCTA />
    </main>
  );
}
