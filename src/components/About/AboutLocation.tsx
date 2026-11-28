"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, MapPin } from "lucide-react";
import Reveal from "@/components/Common/Reveal";

const MAPS_LINK = "https://maps.google.com/?q=-6.2954059,107.2899466";

const AboutLocation = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAPS_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="container">
        <Reveal>
          <div className="rounded-2xl border border-gray-200/80 bg-slate-50 p-5 text-left shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-8">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl">
                    Lokasi Kami
                  </h3>
                  <p className="mt-0.5 text-xs text-body-color dark:text-body-color-dark sm:text-sm">
                    Masjid Al-Istiqomah — Titik kumpul kajian &amp; kegiatan SKRT MEDIA
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Link Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Lokasi
                    </>
                  )}
                </button>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                >
                  Buka Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200/70 dark:border-white/10">
              <iframe
                title="Lokasi Masjid Al-Istiqomah SKRT MEDIA"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d557.3956900339347!2d107.2899466!3d-6.2954059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699d9e22af165f%3A0x72c10f32dfab428!2sMasjid%20Al%20Istiqomah!5e1!3m2!1sen!2sid!4v1776663185643!5m2!1sen!2sid"
                width="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[280px] w-full sm:h-[360px] md:h-[420px]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutLocation;
