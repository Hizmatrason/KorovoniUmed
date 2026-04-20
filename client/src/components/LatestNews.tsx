"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api, type NewsListItem, type PagedResult } from "@/lib/api";

function imgSrc(url: string) {
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248"}${url}`;
}

export default function LatestNews() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [items, setItems] = useState<NewsListItem[]>([]);

  useEffect(() => {
    api.getNews(1, 3).then((data) => setItems(data.items)).catch(console.error);
  }, []);

  const getTitle = (item: NewsListItem) => {
    if (locale === "tj") return item.titleTj;
    if (locale === "en") return item.titleEn;
    return item.titleRu;
  };

  const getSummary = (item: NewsListItem) => {
    if (locale === "tj") return item.summaryTj;
    if (locale === "en") return item.summaryEn;
    return item.summaryRu;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  if (items.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-secondary)]">{t("title")}</h2>
            <div className="w-12 h-1 rounded-full bg-[var(--color-primary)] mt-2" />
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            {t("readMore") || "Все новости"} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}` as any}
              className="group block rounded-2xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {item.imageUrl ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imgSrc(item.imageUrl)}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                  </svg>
                </div>
              )}
              <div className="p-5">
                {item.publishedAt && (
                  <p className="text-xs font-medium text-[var(--color-primary)] mb-2">
                    {formatDate(item.publishedAt)}
                  </p>
                )}
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {getTitle(item)}
                </h3>
                {getSummary(item) && (
                  <p className="text-sm text-[var(--color-text-light)] leading-relaxed line-clamp-2">
                    {getSummary(item)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
