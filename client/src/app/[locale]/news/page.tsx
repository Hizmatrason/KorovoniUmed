"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api, type NewsListItem, type PagedResult } from "@/lib/api";

function imgSrc(url: string) {
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248"}${url}`;
}

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [data, setData] = useState<PagedResult<NewsListItem> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getNews(page).then(setData).catch(console.error);
  }, [page]);

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

  /* Loading skeleton */
  if (!data)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-12">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-[var(--color-border)] rounded-2xl mb-4" />
              <div className="h-5 bg-[var(--color-border)] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[var(--color-border)] rounded w-full mb-2" />
              <div className="h-3 bg-[var(--color-border)] rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-[var(--color-secondary)] mb-3">{t("title")}</h1>
        <div className="w-16 h-1 rounded-full bg-[var(--color-primary)]" />
      </div>

      {data.items.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto w-16 h-16 text-[var(--color-border)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
          </svg>
          <p className="text-lg text-[var(--color-text-light)]">{t("noNews")}</p>
        </div>
      ) : (
        <>
          {/* Featured first article */}
          {data.items.length > 0 && page === 1 && (
            <Link
              href={`/news/${data.items[0].slug}` as any}
              className="group block mb-12 rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="grid md:grid-cols-2">
                {data.items[0].imageUrl ? (
                  <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                    <img
                      src={imgSrc(data.items[0].imageUrl)}
                      alt={getTitle(data.items[0])}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video md:aspect-auto md:h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                    <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                    </svg>
                  </div>
                )}
                <div className="p-8 flex flex-col justify-center">
                  {data.items[0].publishedAt && (
                    <p className="text-sm font-medium text-[var(--color-primary)] mb-3">
                      {formatDate(data.items[0].publishedAt)}
                    </p>
                  )}
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {getTitle(data.items[0])}
                  </h2>
                  {getSummary(data.items[0]) && (
                    <p className="text-[var(--color-text-light)] leading-relaxed line-clamp-4">
                      {getSummary(data.items[0])}
                    </p>
                  )}
                  <span className="mt-4 text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("readMore") || "Читать далее"} →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of articles in grid */}
          {(page === 1 ? data.items.slice(1) : data.items).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(page === 1 ? data.items.slice(1) : data.items).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}` as any}
                  className="group block rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                    <h2 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {getTitle(item)}
                    </h2>
                    {getSummary(item) && (
                      <p className="text-sm text-[var(--color-text-light)] leading-relaxed line-clamp-3">
                        {getSummary(item)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalCount > data.pageSize && (
            <div className="flex justify-center gap-2 mt-14">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-bg)] transition-colors"
              >
                ←
              </button>
              {Array.from({ length: Math.ceil(data.totalCount / data.pageSize) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === i + 1
                      ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
                      : "border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(Math.ceil(data.totalCount / data.pageSize), page + 1))}
                disabled={page === Math.ceil(data.totalCount / data.pageSize)}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-30 hover:bg-[var(--color-bg)] transition-colors"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
