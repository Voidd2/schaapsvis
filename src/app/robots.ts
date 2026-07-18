import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Tijdens de onderhouds-/previewfase (slot staat aan): weer alle crawlers en
  // publiceer de sitemap NIET. Zo ligt de volledige site-structuur (producten,
  // categorieën, artikelen) niet al open voor concurrenten vóór de live-gang.
  const maintenance = process.env.MAINTENANCE_MODE !== "off";
  if (maintenance) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://www.schaapsvishandel.nl/sitemap.xml",
  };
}
