import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MapContent />;
}

function MapContent() {
  const t = useTranslations("map");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">{t("title")}</h1>
      <p className="text-[var(--color-text-light)] mb-8">{t("description")}</p>
      <div className="card overflow-hidden" style={{ height: "500px" }}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=68.72%2C38.53%2C68.82%2C38.60&layer=mapnik&marker=38.5598%2C68.7738"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          title="Dushanbe Map"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold mb-1">Korvoni Umed</h3>
          <p className="text-sm text-[var(--color-text-light)]">
            Dushanbe, Tajikistan
          </p>
          <p className="text-sm text-[var(--color-text-light)]">
            +992 900 00 12 22
          </p>
        </div>
      </div>
    </div>
  );
}
