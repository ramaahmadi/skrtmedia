import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | skrtmedia.id",
  description: "Hubungi tim SKRT MEDIA untuk pertanyaan, kolaborasi, atau informasi kegiatan.",
};

const ContactPage = () => {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
};

export default ContactPage;
