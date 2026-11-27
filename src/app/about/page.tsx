import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import AboutLocation from "@/components/About/AboutLocation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | skrtmedia.id",
  description: "Mengenal lebih dekat SKRT MEDIA — Good Vibes, Good Circle. Partner dalam ketaatan untuk generasi muda.",
};

const AboutPage = () => {
  return (
    <div className="text-center pt-24">
      <AboutSectionOne />
      <AboutSectionTwo />
      <AboutLocation />
    </div>
  );
};

export default AboutPage;
