import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import AboutLocation from "@/components/About/AboutLocation";
import OngoingActivityBar from "@/components/Common/OngoingActivityBar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | skrtmedia.id",
  description: "Mengenal lebih dekat SKRT MEDIA — Good Vibes, Good Circle. Partner dalam ketaatan untuk generasi muda.",
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white pt-28 text-center dark:bg-black">
      <OngoingActivityBar />
      <AboutSectionOne />
      <AboutSectionTwo />
      <AboutLocation />
    </main>
  );
};

export default AboutPage;
