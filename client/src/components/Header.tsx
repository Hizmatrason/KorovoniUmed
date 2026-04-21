"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/services" as const, label: t("services") },
    { href: "/projects" as const, label: t("projects") },
    { href: "/news" as const, label: t("news") },
    { href: "/chatr" as const, label: t("chatr") },
    { href: "/map" as const, label: t("map") },
    { href: "/donate" as const, label: t("donate") },
  ];

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt="Korvoni Umed"
              width={80}
              height={54}
              className="object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-[var(--color-border)]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
