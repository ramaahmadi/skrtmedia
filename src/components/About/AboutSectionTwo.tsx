import Image from "next/image";
import Reveal from "@/components/Common/Reveal";

const AboutSectionTwo = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <Reveal>
          <div className="-mx-4 flex flex-wrap items-center text-left">
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="group relative mx-auto mb-10 aspect-25/24 max-w-[500px] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 dark:ring-white/10 lg:m-0"
                data-wow-delay=".15s"
              >
                <Image
                  src="/images/hero/landscape1.JPG"
                  alt="kegiatan-skrtmedia"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="mx-auto max-w-[500px] lg:mx-0">
                <div className="mb-6">
                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">
                    Partner dalam Ketaatan
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg sm:leading-relaxed">
                    Maka kebersamaan adalah solusi yang dibutuhkan saat ini, sebagai bentuk penjagaan dan pengawasan. Karenanya kami hadir untuk menjadi partner dalam menjalankan ketaatan bersama, dan dengannya diharapkan agar kami bisa saling mengingatkan akan kebenaran dan mengingatkan akan kesabaran.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
