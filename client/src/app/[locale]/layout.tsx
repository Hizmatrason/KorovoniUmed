import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StickyHelpButton from "@/components/StickyHelpButton";

const GA_MEASUREMENT_ID = "G-TTLZFHKWTC";
const SITE_URL = "https://caravanofhope.tj";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ru: {
    title: "Корвони Умед | Caravan of Hope | Караван Надежды — помощь женщинам в Таджикистане",
    description:
      "Корвони Умед (Caravan of Hope, Караван Надежды) — общественная организация в Таджикистане, с 2009 года защищает права женщин и детей, борется с гендерным насилием и торговлей людьми. Кризисный центр в Душанбе, профессиональное обучение, социальное кафе Чатр.",
  },
  tj: {
    title: "Корвони Умед | Caravan of Hope — кумак ба занон дар Тоҷикистон",
    description:
      "Корвони Умед (Caravan of Hope) — ташкилоти ҷамъиятӣ дар Тоҷикистон, ки аз соли 2009 ҳуқуқҳои занон ва кӯдаконро ҳифз мекунад, бо зӯроварии гендерӣ ва савдои одамон мубориза мебарад.",
  },
  en: {
    title: "Korvoni Umed | Caravan of Hope — Women's Rights NGO in Tajikistan",
    description:
      "Caravan of Hope (Korvoni Umed) is a Tajikistan-based public organization protecting women's and children's rights since 2009. Crisis center in Dushanbe, vocational training, and Café Chatr social enterprise.",
  },
};

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "tj" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ru;
  const url = `${SITE_URL}/${locale}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${SITE_URL}/ru`,
        "tg-TJ": `${SITE_URL}/tj`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ru`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Корвони Умед — Caravan of Hope",
      title: meta.title,
      description: meta.description,
      locale,
      images: [{ url: "/images/logo.jpg", width: 1280, height: 860, alt: "Korvoni Umed — Caravan of Hope" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/logo.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`@/messages/ru.json`)).default;
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Корвони Умед",
    alternateName: [
      "Caravan of Hope",
      "Караван Надежды",
      "Korvoni Umed",
      "Корвони умед",
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpg`,
    foundingDate: "2009",
    founder: {
      "@type": "Person",
      name: "Умеда Садриддинова",
      alternateName: "Umeda Sadriddinova",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Душанбе",
      addressCountry: "TJ",
    },
    areaServed: {
      "@type": "Country",
      name: "Tajikistan",
    },
    sameAs: [
      "https://www.instagram.com/korvoni_umed/",
      "https://www.facebook.com/korvoni.umed/",
      "https://t.me/korvoniumed",
    ],
    description:
      "Общественная организация в Таджикистане, защищающая права женщин и детей с 2009 года. Кризисный центр, профессиональное обучение, социальное кафе Чатр.",
  };

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <StickyHelpButton />
        </NextIntlClientProvider>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
