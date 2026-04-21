import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { projects, type ProjectLocale } from "@/lib/projects";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const l = locale as ProjectLocale;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-[var(--color-secondary)] mb-3">
          {t("title")}
        </h1>
        <div className="w-16 h-1 rounded-full bg-[var(--color-primary)]" />
        <p className="text-lg text-[var(--color-text-light)] mt-6 max-w-3xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}` as any}
            className="group block rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {project.coverImage ? (
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title[l]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[var(--color-primary)]">
                  {project.period[l]}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                <span className="text-white/80 text-sm font-semibold">
                  {project.period[l]}
                </span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-text-light)]">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location[l]}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                  {project.status[l]}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                {project.title[l]}
              </h2>
              <p className="text-sm text-[var(--color-text-light)] leading-relaxed line-clamp-3 mb-4">
                {project.summary[l]}
              </p>
              <span className="text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                {t("readMore")} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
