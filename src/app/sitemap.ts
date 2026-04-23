import { MetadataRoute } from "next";

const baseUrl = "https://schaapsvis.nl";
const locales = ["nl", "en", "de"] as const;

const pages = [
  "",
  "/ons-verhaal",
  "/varlaks-biologische-zalm",
  "/assortiment",
  "/bezoek-ons",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const url =
        locale === "nl" ? `${baseUrl}${page || "/"}` : `${baseUrl}/${locale}${page || ""}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
