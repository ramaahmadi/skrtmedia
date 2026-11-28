import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";
import Reveal from "@/components/Common/Reveal";

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-50/70 py-20 dark:bg-bg-color-dark md:py-24 lg:py-28"
    >
      <div className="container">
        {/* Visi Section */}
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Arah Gerak Kami
          </p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Visi SKRT MEDIA
          </h2>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            Terwujudnya generasi muda yang berkarakter Qur&apos;ani, solid dalam
            persaudaraan, serta menjadi pelopor dalam karya dan kebaikan.
          </p>
        </Reveal>

        {/* Misi Section */}
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Empat Pilar Misi
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {featuresData.map((feature, idx) => (
              <Reveal key={feature.id} delay={idx * 0.08} className="h-full">
                <SingleFeature feature={feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
