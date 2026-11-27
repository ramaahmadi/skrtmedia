import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import CommunityCTA from "@/components/Home/CommunityCTA";
import LatestUpdates from "@/components/Home/LatestUpdates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKRT MEDIA INDONESIA — Good Vibes, Good Circle",
  description:
    "Sempat Kelam Resah Tinggalkan. Komunitas anak muda Muslim yang hadir sebagai partner dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.",
  icons: {
    icon: [
      { url: "/skrt-square.svg?v=skrt2", type: "image/svg+xml" },
      { url: "/icon-192.png?v=skrt2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=skrt2",
    apple: "/icon-192.png?v=skrt2",
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
      <CommunityCTA />
    </main>
  );
}
