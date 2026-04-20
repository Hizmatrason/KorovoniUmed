"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  ru: "RU",
  tj: "TJ",
  en: "EN",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      {Object.entries(localeLabels).map(([loc, label]) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc as "ru" | "tj" | "en" })}
          className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
            locale === loc
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
