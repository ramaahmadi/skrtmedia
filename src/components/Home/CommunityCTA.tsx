import Link from "next/link";
import Reveal from "@/components/Common/Reveal";

const CommunityCTA = () => {
  return (
    <section className="bg-white py-20 dark:bg-black md:py-24">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-blue-100 uppercase">
              Bergabung Bersama Kami
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Temukan Lingkungan yang Saling Menguatkan
            </h2>
            <p className="mb-8 text-base leading-relaxed text-blue-100 sm:text-lg">
              Ikuti kajian rutin, kegiatan sosial, serta baca artikel inspiratif
              dari keluarga besar SKRT MEDIA.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/kegiatan"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 sm:text-base"
              >
                Lihat Jadwal Kegiatan
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:text-base"
              >
                Baca Artikel
              </Link>
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CommunityCTA;
