import type { MetadataRoute } from "next";

const SITE_URL = "https://caravanofhope.tj";
const LOCALES = ["ru", "tj", "en"] as const;
const ROUTES = [
  "",
  "/about",
  "/services",
  "/projects",
  "/projects/vahdat-protection",
  "/projects/rudaki-rule-of-law",
  "/chatr",
  "/donate",
  "/news",
  "/map",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      const url = `${SITE_URL}/${locale}${route}`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: route === "/news" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route.startsWith("/projects/") ? 0.7 : 0.8,
        alternates: {
          languages: {
            ru: `${SITE_URL}/ru${route}`,
            "tg-TJ": `${SITE_URL}/tj${route}`,
            en: `${SITE_URL}/en${route}`,
          },
        },
      });
    }
  }
  return entries;
}
