import Contact from "@/components/Contact";
import OngoingActivityBar from "@/components/Common/OngoingActivityBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | skrtmedia.id",
  description: "Hubungi tim SKRT MEDIA untuk pertanyaan, kolaborasi, atau informasi kegiatan.",
};

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 dark:bg-black">
      <OngoingActivityBar />
      <Contact />
    </main>
  );
};

export default ContactPage;
