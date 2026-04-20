import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | skrtmedia.ig",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = () => {
  return (
    <div className="text-center">
      {/* <Contact /> */}
    </div>
  );
};

export default ContactPage;
