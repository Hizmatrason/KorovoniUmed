import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DonateContent />;
}

function DonateContent() {
  const t = useTranslations("donate");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">{t("title")}</h1>
      <p className="text-lg text-[var(--color-text-light)] mb-8">{t("description")}</p>

      <div className="card text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-[var(--color-text-light)]">{t("placeholder")}</p>
      </div>
    </div>
  );
}
