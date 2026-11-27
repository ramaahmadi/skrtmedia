import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <div className="scale-75">{icon}</div>
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark sm:text-base">
        {paragraph}
      </p>
    </article>
  );
};

export default SingleFeature;
