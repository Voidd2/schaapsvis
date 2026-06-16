import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page || ""}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
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
