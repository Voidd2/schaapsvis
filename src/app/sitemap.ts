import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { products } from "@/lib/assortiment-data";

const baseUrl = "https://www.schaapsvishandel.nl";
const locales = ["nl", "en", "de"] as const;

const pages = [
  "",
  "/ons-verhaal",
  "/varlaks",
  "/biologische-vis",
  "/blog",
  "/assortiment",
  "/bezoek-ons",
  "/contact",
  "/bestellen",
  "/viskalender",
  "/viswinkel-leiden",
  "/frischer-fisch-leiden",
  "/marktkraam-leiden",
  "/viswinkel-voorschoten",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    const languages: Record<string, string> = {
      nl: `${baseUrl}/nl${page}`,
      en: `${baseUrl}/en${page}`,
      de: `${baseUrl}/de${page}`,
      "x-default": `${baseUrl}/nl${page}`,
    };
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Productdetailpagina's (assortiment) — met hreflang-alternates
  for (const p of products) {
    const seg = `/assortiment/${p.slug}`;
    const languages: Record<string, string> = {
      nl: `${baseUrl}/nl${seg}`,
      en: `${baseUrl}/en${seg}`,
      de: `${baseUrl}/de${seg}`,
      "x-default": `${baseUrl}/nl${seg}`,
    };
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${seg}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  // Blogartikelen
  for (const post of blogPosts) {
    entries.push({
      url: `${baseUrl}/nl/blog/${post.slug}`,
      lastModified: new Date(post.datum),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
