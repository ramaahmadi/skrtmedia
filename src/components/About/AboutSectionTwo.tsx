import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/hero/landscape1.JPG"
                alt="kegiatan-skrtmedia"
                fill
                className="object-cover drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Partner dalam Ketaatan
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Maka kebersamaan adalah Solusi yang di butuhkan saat ini, sebagai bentuk penjagaan dan pengawasan, karenanya kami hadir untuk menjadi partner dalam menjalankan ketaatan bersama, dan denganya di harapkan agar kami bisa  saling mengingatkan akan kebenaran dan mengingatkan akan kesabaran .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
