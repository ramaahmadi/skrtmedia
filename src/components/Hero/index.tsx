import Link from "next/link";
import HighlightEvent from "./HilightEvent";
import React from "react";
import Image from "next/image";

const portraits = [
  {
    src: "/images/hero/portrait1.JPG",
    alt: "Dokumentasi kajian SKRT MEDIA 1",
  },
  {
    src: "/images/hero/landscape1.JPG",
    alt: "Dokumentasi kebersamaan SKRT MEDIA 2",
  },
  {
    src: "/images/hero/portrait2.JPG",
    alt: "Dokumentasi acara SKRT MEDIA 3",
  },
  {
    src: "/images/hero/landscape2.JPG",
    alt: "Dokumentasi komunitas SKRT MEDIA 4",
  },
];

const Hero = React.memo(() => {
  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-28 pb-16 dark:from-gray-dark dark:via-gray-dark dark:to-black sm:pt-36 sm:pb-20 md:pt-40 md:pb-24"
    >
      {/* Subtle radial blue ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-primary uppercase sm:text-sm">
            SKRT MEDIA INDONESIA • Good Vibes, Good Circle
          </p>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl md:leading-[1.12]">
            Sempat Kelam, Resah, Tinggalkan.
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Ruang tumbuh bersama bagi generasi muda Muslim untuk saling
            menguatkan dalam ketaatan, kajian rutin, dan karya kebaikan.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:text-base"
            >
              Jelajahi Kegiatan
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-primary/50 sm:text-base"
            >
              Tentang Kami
            </Link>
          </div>

          {/* Hadith Quote */}
          <blockquote className="mx-auto mb-10 max-w-2xl rounded-2xl border border-gray-200/80 bg-white/80 px-6 py-4 text-sm leading-relaxed text-gray-700 shadow-xs backdrop-blur-xs dark:border-white/10 dark:bg-white/5 dark:text-gray-300 sm:text-base">
            &ldquo;Seorang mukmin terhadap mukmin lainnya seperti satu bangunan,
            sebagiannya menguatkan yang lainnya.&rdquo;
            <footer className="mt-1.5 text-xs font-medium text-primary dark:text-sky-400">
              — HR. Bukhari &amp; Muslim
            </footer>
          </blockquote>

          {/* Upcoming Highlight Event */}
          <HighlightEvent />

          {/* Clean Responsive Photo Gallery */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {portraits.map((p, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 dark:ring-white/10"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 dark:text-sky-400 dark:hover:text-sky-300"
            >
              Lihat seluruh dokumentasi &amp; jadwal kegiatan
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
