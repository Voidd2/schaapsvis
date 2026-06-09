import { MetadataRoute } from "next";

const baseUrl = "https://schaapsvis.nl";
const locales = ["nl", "en", "de"] as const;

const pages = [
  "",
  "/ons-verhaal",
  "/varlaks",
  "/betere-vis",
  "/assortiment",
  "/bezoek-ons",
  "/contact",
  "/bestellen",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${page || ""}`;

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
