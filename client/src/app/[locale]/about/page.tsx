import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">{t("title")}</h1>

      {/* Hero description with photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-lg text-[var(--color-text-light)] mb-6">{t("description")}</p>
          <p className="text-[var(--color-text-light)]">{t("founder")}</p>
        </div>
        <div className="relative h-64 md:h-auto rounded-xl overflow-hidden">
          <Image
            src="/images/hero-5.jpg"
            alt="Korvoni Umed"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Mission */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-3 text-[var(--color-primary)]">{t("mission")}</h2>
        <p className="text-[var(--color-text-light)]">{t("missionText")}</p>
      </div>

      {/* History */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-3 text-[var(--color-primary)]">{t("history")}</h2>
        <p className="text-[var(--color-text-light)]">{t("historyText")}</p>
      </div>

      {/* What We Do - with photos */}
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">{t("whatWeDo")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="card overflow-hidden p-0">
          <div className="relative h-48">
            <Image src="/images/hero-6.jpg" alt="Shelter" fill className="object-cover" />
          </div>
          <div className="p-5">
            <h3 className="font-bold mb-2">{t("shelterDesc").split(",")[0]}</h3>
            <p className="text-sm text-[var(--color-text-light)]">{t("shelterDesc")}</p>
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="relative h-48">
            <Image src="/images/hero-4.jpg" alt="Training" fill className="object-cover" />
          </div>
          <div className="p-5">
            <h3 className="font-bold mb-2">{t("trainingDesc").split(",")[0]}</h3>
            <p className="text-sm text-[var(--color-text-light)]">{t("trainingDesc")}</p>
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="relative h-48 bg-gray-50 flex items-center justify-center">
            <Image src="/images/chatr_logo.jpg" alt="Cafe Chatr" width={200} height={120} className="object-contain" />
          </div>
          <div className="p-5">
            <h3 className="font-bold mb-2">{t("cafeDesc").split(",")[0]}</h3>
            <p className="text-sm text-[var(--color-text-light)]">{t("cafeDesc")}</p>
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="relative h-48">
            <Image src="/images/hero-4.jpg" alt="EU Training Centers" fill className="object-cover" />
          </div>
          <div className="p-5">
            <h3 className="font-bold mb-2 text-[var(--color-primary)]">{t("euTrainingTitle")}</h3>
            <p className="text-sm text-[var(--color-text-light)]">{t("euTrainingDesc")}</p>
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="card">
        <h2 className="text-xl font-bold mb-3 text-[var(--color-primary)]">Partners</h2>
        <p className="text-[var(--color-text-light)] mb-4">{t("partners")}</p>
        <div className="flex flex-wrap gap-6 items-center">
          <a href="https://www.un.org/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">UN</a>
          <a href="https://www.unfpa.org/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">UNFPA</a>
          <a href="https://www.unicef.org/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">UNICEF</a>
          <a href="https://www.unwomen.org/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">UN Women</a>
          <a href="https://www.spotlightinitiative.org/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">Spotlight Initiative</a>
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-8 flex flex-wrap gap-4">
        <a href="https://www.instagram.com/korvoni_umed/" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          Instagram
        </a>
        <a href="https://www.facebook.com/korvoni.umed/" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        <a href="https://t.me/korvoniumed" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>
      </div>
    </div>
  );
}
