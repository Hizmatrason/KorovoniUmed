import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("activities");

  const services = [
    {
      key: "shelter" as const,
      href: "/projects/vahdat-protection" as const,
      color: "var(--color-primary)",
      icon: (
        <svg className="w-10 h-10" style={{ color: "var(--color-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: "training" as const,
      href: "/projects/rudaki-rule-of-law" as const,
      color: "var(--color-secondary)",
      icon: (
        <svg className="w-10 h-10" style={{ color: "var(--color-secondary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      key: "cafe" as const,
      href: "/chatr" as const,
      color: "var(--color-accent)",
      icon: (
        <svg className="w-10 h-10" style={{ color: "var(--color-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.704 2.704 0 003 15.546M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      ),
    },
    {
      key: "awareness" as const,
      href: "/news" as const,
      color: "var(--color-primary)",
      icon: (
        <svg className="w-10 h-10" style={{ color: "var(--color-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-12">{t("title")}</h1>
      <div className="space-y-8">
        {services.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="block card flex gap-6 items-start group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="shrink-0 w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              {s.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {t(`${s.key}.title`)}
              </h2>
              <p className="text-[var(--color-text-light)]">{t(`${s.key}.description`)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
