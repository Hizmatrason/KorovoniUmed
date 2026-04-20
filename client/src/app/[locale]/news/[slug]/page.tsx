"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Link } from "@/i18n/routing";
import { api, type NewsDetail } from "@/lib/api";

function imgSrc(url: string) {
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248"}${url}`;
}

export default function NewsDetailPage() {
  const locale = useLocale();
  const t = useTranslations("news");
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<NewsDetail | null>(null);

  useEffect(() => {
    api.getNewsDetail(slug).then(setNews).catch(console.error);
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  /* Loading state */
  if (!news)
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-pulse">
        <div className="aspect-video bg-[var(--color-border)] rounded-2xl mb-8" />
        <div className="h-8 bg-[var(--color-border)] rounded w-2/3 mb-4" />
        <div className="h-4 bg-[var(--color-border)] rounded w-1/4 mb-10" />
        <div className="space-y-3">
          <div className="h-4 bg-[var(--color-border)] rounded" />
          <div className="h-4 bg-[var(--color-border)] rounded w-5/6" />
          <div className="h-4 bg-[var(--color-border)] rounded w-4/6" />
        </div>
      </div>
    );

  const title = locale === "tj" ? news.titleTj : locale === "en" ? news.titleEn : news.titleRu;
  const content = locale === "tj" ? news.contentTj : locale === "en" ? news.contentEn : news.contentRu;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToNews") || "Все новости"}
      </Link>

      {/* Cover image */}
      {news.imageUrl && (
        <div className="aspect-video bg-gray-100 rounded-2xl mb-8 overflow-hidden shadow-sm">
          <img
            src={imgSrc(news.imageUrl)}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta */}
      {news.publishedAt && (
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-[var(--color-primary)] rounded-full" />
          <p className="text-sm font-medium text-[var(--color-primary)]">
            {formatDate(news.publishedAt)}
          </p>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-8 text-[var(--color-secondary)]">
        {title}
      </h1>

      {/* Divider */}
      <hr className="border-[var(--color-border)] mb-8" />

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-headings:text-[var(--color-secondary)] prose-a:text-[var(--color-primary)] prose-img:rounded-xl prose-img:shadow-md">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Bottom nav */}
      <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToNews") || "Все новости"}
        </Link>
      </div>
    </article>
  );
}
