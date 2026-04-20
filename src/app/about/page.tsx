import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import AboutLocation from "@/components/About/AboutLocation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | skrtmedia.id",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <div className="text-center">
      <AboutSectionOne />
      <AboutSectionTwo />
      <AboutLocation />
    </div>
  );
};

export default AboutPage;
