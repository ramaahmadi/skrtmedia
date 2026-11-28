"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import Reveal from "@/components/Common/Reveal";

const TOPICS = [
  "Tanya Kajian & Kegiatan",
  "Kolaborasi / Media Partner",
  "Program Sosial & Donasi",
  "Gabung Komunitas SKRT",
  "Lainnya",
];

const WHATSAPP_NUMBER = "62895338683425";
const WHATSAPP_DISPLAY = "+62 895-3386-83425";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const text = [
      "*Pesan dari Website SKRT MEDIA*",
      "",
      `Topik: ${topic}`,
      `Nama: ${name.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      "",
      "Pesan:",
      message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_DISPLAY);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-12 md:py-16 lg:py-20">
      <div className="container">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Terhubung Bersama Kami
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Hubungi SKRT MEDIA
          </h1>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
            Ada pertanyaan seputar kajian, saran, atau ingin berkolaborasi? Pilih
            topik di bawah dan kirim pesan langsung ke tim kami via WhatsApp.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Contact Form */}
          <Reveal className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-8">
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Kirim Pesan Cepat
              </h2>
              <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
                Pilih topik agar pesanmu langsung diarahkan dengan rapi.
              </p>

              {/* Interactive Topic Pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                {TOPICS.map((item) => {
                  const selected = topic === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                        selected
                          ? "bg-primary text-white shadow-xs"
                          : "bg-slate-100 text-gray-700 hover:bg-slate-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                  Terima kasih! WhatsApp telah dibuka untuk meneruskan pesan Anda ke tim SKRT MEDIA.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full rounded-xl border border-gray-300 bg-slate-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Email (Opsional)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full rounded-xl border border-gray-300 bg-slate-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                      Pesan *
                    </label>
                    <span className="text-xs text-body-color dark:text-body-color-dark">
                      {message.length} karakter
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Tulis pesan seputar "${topic}" di sini...`}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-slate-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:w-auto sm:text-base"
                >
                  <Send className="h-4 w-4" />
                  Kirim Pesan via WhatsApp
                </button>
              </form>
            </div>
          </Reveal>

          {/* Direct Contact Info Cards */}
          <Reveal delay={0.1} className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                WhatsApp Admin SKRT
              </h3>
              <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                Chat langsung untuk respon cepat mengenai jadwal kajian, pendaftaran, atau kolaborasi.
              </p>
              <p className="mt-3 font-mono text-sm font-semibold text-gray-900 dark:text-white">
                {WHATSAPP_DISPLAY}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Chat Sekarang
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-200"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Nomor
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Instagram className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Instagram @skrtmedia.id
              </h3>
              <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                Ikuti update harian, poster kajian, reels dokumentasi, dan pengingat kebaikan di Instagram resmi kami.
              </p>
              <a
                href="https://www.instagram.com/skrtmedia.id"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
              >
                Kunjungi @skrtmedia.id
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-400">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Basecamp &amp; Masjid Al-Istiqomah
              </h3>
              <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                Titik kumpul kegiatan kajian rutin dan program sosial komunitas SKRT MEDIA.
              </p>
              <a
                href="https://maps.google.com/?q=-6.2954059,107.2899466"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline dark:text-sky-400"
              >
                Buka petunjuk arah di Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary dark:bg-white/10 dark:text-sky-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Waktu Respon Tim
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                    Setiap hari pukul 08.00 – 21.00 WIB. Pesan di luar jam tersebut akan dibalas pada pagi hari berikutnya.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
