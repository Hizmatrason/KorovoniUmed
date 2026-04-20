import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import HelpRequestForm from "@/components/HelpRequestForm";
import HeroCarousel from "@/components/HeroCarousel";
import LatestNews from "@/components/LatestNews";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* About Short */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-lg text-center max-w-3xl mx-auto text-[var(--color-text-light)]">
          {t("about.description")}
        </p>
      </section>

      {/* Activities */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--color-primary)]">
            {t("activities.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shelter */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{t("activities.shelter.title")}</h3>
              <p className="text-sm text-[var(--color-text-light)]">{t("activities.shelter.description")}</p>
            </div>

            {/* Training */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{t("activities.training.title")}</h3>
              <p className="text-sm text-[var(--color-text-light)]">{t("activities.training.description")}</p>
            </div>

            {/* Cafe */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.704 2.704 0 003 15.546M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{t("activities.cafe.title")}</h3>
              <p className="text-sm text-[var(--color-text-light)]">{t("activities.cafe.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <LatestNews />

      {/* Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-[var(--color-text-light)] mb-6">{t("about.partners")}</p>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">EU</span>
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">US Embassy</span>
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">INL</span>
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">Netherlands Embassy</span>
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">Danish Relief</span>
          <span className="text-2xl font-bold text-[var(--color-text-light)] opacity-60">Atlas Free</span>
        </div>
      </section>

      {/* Request Form */}
      <section id="request-form" className="bg-white py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <HelpRequestForm />
        </div>
      </section>
    </div>
  );
}
