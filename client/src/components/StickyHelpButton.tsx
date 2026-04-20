"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function StickyHelpButton() {
  const t = useTranslations("common");

  return (
    <Link
      href="/#request-form"
      className="fixed bottom-6 right-6 z-50 btn-cta shadow-lg flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      {t("needHelp")}
    </Link>
  );
}
