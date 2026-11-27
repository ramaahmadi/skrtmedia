import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import CommunityCTA from "@/components/Home/CommunityCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SKRT MEDIA INDONESIA — Good Vibes, Good Circle",
  description:
    "Sempat Kelam Resah Tinggalkan. Komunitas anak muda Muslim yang hadir sebagai partner dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.",
  openGraph: {
    title: "SKRT MEDIA INDONESIA — Good Vibes, Good Circle",
    description:
      "Komunitas anak muda Muslim yang hadir sebagai partner dalam ketaatan melalui kajian rutin, diskusi positif, dan kegiatan sosial.",
    type: "website",
    locale: "id_ID",
  },
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <Features />
      <CommunityCTA />
    </main>
  );
}
