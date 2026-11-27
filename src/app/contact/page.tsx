import Contact from "@/components/Contact";
import OngoingActivityBar from "@/components/Common/OngoingActivityBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | skrtmedia.id",
  description: "Hubungi tim SKRT MEDIA untuk pertanyaan, kolaborasi, atau informasi kegiatan.",
};

const ContactPage = () => {
  return (
    <main className="pt-28">
      <OngoingActivityBar />
      <Contact />
    </main>
  );
};

export default ContactPage;
