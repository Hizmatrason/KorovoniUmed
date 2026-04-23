import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import BankDetails from "@/components/BankDetails";

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DonateContent />;
}

function DonateContent() {
  const t = useTranslations("donate");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">{t("title")}</h1>
      <p className="text-lg text-[var(--color-text-light)] mb-10">{t("description")}</p>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-2">{t("bank.title")}</h2>
        <p className="text-[var(--color-text-light)]">{t("bank.subtitle")}</p>
      </div>

      <BankDetails />
    </div>
  );
}
