import { MetadataRoute } from "next";

// Bij elk verzoek opnieuw bepalen, niet één keer bij het bouwen. Anders blijft
// er "Disallow: /" staan nadat MAINTENANCE_MODE op "off" is gezet, tot iemand
// toevallig opnieuw deployt — en zolang dat er staat komt de site simpelweg
// niet in Google.
export const dynamic = "force-dynamic";

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
