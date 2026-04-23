import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://caravanofhope.tj";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Корвони Умед | Caravan of Hope | Караван Надежды",
    template: "%s | Корвони Умед — Caravan of Hope",
  },
  description:
    "Корвони Умед (Caravan of Hope, Караван Надежды) — общественная организация в Таджикистане, с 2009 года защищающая права женщин и детей, борющаяся с гендерным насилием и торговлей людьми. Кризисный центр, профессиональное обучение, социальное кафе Чатр.",
  applicationName: "Корвони Умед",
  keywords: [
    "Корвони Умед",
    "Корвони умед",
    "Caravan of Hope",
    "Caravan Of Hope",
    "Караван Надежды",
    "Караван надежды",
    "Korvoni Umed",
    "Korvoni umed",
    "Umeda Sadriddinova",
    "Умеда Садриддинова",
    "женская организация Таджикистан",
    "помощь женщинам Душанбе",
    "кризисный центр Душанбе",
    "домашнее насилие Таджикистан",
    "торговля людьми Таджикистан",
    "NGO Tajikistan women",
    "Dushanbe shelter",
    "Чатр кафе",
    "Cafe Chatr",
    "caravanofhope.tj",
  ],
  authors: [{ name: "Корвони Умед / Caravan of Hope" }],
  creator: "Корвони Умед",
  publisher: "Корвони Умед",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Корвони Умед — Caravan of Hope",
    title: "Корвони Умед | Caravan of Hope | Караван Надежды",
    description:
      "Общественная организация Корвони Умед (Caravan of Hope) — защита прав женщин и детей в Таджикистане с 2009 года.",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1280,
        height: 860,
        alt: "Корвони Умед — Caravan of Hope",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Корвони Умед | Caravan of Hope | Караван Надежды",
    description:
      "Защита прав женщин и детей в Таджикистане с 2009 года. Корвони Умед — Caravan of Hope — Караван Надежды.",
    images: ["/images/logo.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      ru: `${SITE_URL}/ru`,
      "tg-TJ": `${SITE_URL}/tj`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/ru`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
