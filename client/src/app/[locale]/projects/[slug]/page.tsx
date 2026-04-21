import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  projects,
  getProjectBySlug,
  type ProjectLocale,
} from "@/lib/projects";

export function generateStaticParams() {
  return projects.flatMap((project) =>
    ["ru", "tj", "en"].map((locale) => ({
      locale,
      slug: project.slug,
    })),
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const l = locale as ProjectLocale;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToProjects")}
      </Link>

      {project.coverImage && (
        <div className="aspect-video relative bg-gray-100 rounded-2xl mb-10 overflow-hidden shadow-sm">
          <Image
            src={project.coverImage}
            alt={project.title[l]}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-sm font-semibold text-[var(--color-primary)]">
          {project.period[l]}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-sm font-medium text-[var(--color-accent)]">
          {project.status[l]}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-8 text-[var(--color-secondary)]">
        {project.title[l]}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 p-6 rounded-2xl bg-gray-50 border border-[var(--color-border)]">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-light)] mb-1 font-semibold">
            {t("donor")}
          </p>
          <p className="text-sm font-medium text-[var(--color-text)]">{project.donor[l]}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-light)] mb-1 font-semibold">
            {t("location")}
          </p>
          <p className="text-sm font-medium text-[var(--color-text)]">{project.location[l]}</p>
        </div>
      </div>

      <p className="text-lg leading-relaxed text-[var(--color-text)] mb-12">
        {project.intro[l]}
      </p>

      <div className="space-y-12">
        {project.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">
              {section.title[l]}
            </h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="text-[var(--color-text)] leading-relaxed mb-4">
                {p[l]}
              </p>
            ))}
            {section.bullets && (
              <div className="space-y-6">
                {section.bullets.map((b, i) => (
                  <div key={i} className="card flex gap-5 items-start">
                    {b.icon && (
                      <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-2xl">
                        {b.icon}
                      </div>
                    )}
                    <div>
                      {b.title && (
                        <h3 className="font-bold text-lg mb-2 text-[var(--color-primary)]">
                          {b.title[l]}
                        </h3>
                      )}
                      <p className="text-[var(--color-text-light)] leading-relaxed">
                        {b.text[l]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {project.closing && (
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20">
          <p className="text-[var(--color-text)] leading-relaxed italic">
            🙌 {project.closing[l]}
          </p>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToProjects")}
        </Link>
      </div>
    </article>
  );
}
