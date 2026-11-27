import { Blog } from "@/types/blog";
import Link from "next/link";

const SingleBlog = ({ blog, href }: { blog: Blog; href?: string }) => {
  const { title, paragraph, author, tags, publishDate } = blog;
  const linkHref = href || "/blog-details";

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark sm:p-7">
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-sky-300">
            {tags[0] || "Artikel"}
          </span>
          <span className="text-xs text-body-color dark:text-body-color-dark">
            {publishDate}
          </span>
        </div>

        <h2 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link
            href={linkHref}
            className="transition-colors group-hover:text-primary dark:group-hover:text-sky-400"
          >
            {title}
          </Link>
        </h2>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
          {paragraph}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20 dark:text-sky-300">
            {(author.name || "SK").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {author.name}
            </p>
            <p className="text-xs text-body-color dark:text-body-color-dark">
              {author.designation}
            </p>
          </div>
        </div>

        <Link
          href={linkHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5 dark:text-sky-400"
        >
          Baca
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default SingleBlog;
