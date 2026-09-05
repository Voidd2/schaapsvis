import { MetadataRoute } from "next";

// Bij elk verzoek opnieuw bepalen, niet één keer bij het bouwen. Anders blijft
// er "Disallow: /" staan nadat MAINTENANCE_MODE op "off" is gezet, tot iemand
// toevallig opnieuw deployt — en zolang dat er staat komt de site simpelweg
// niet in Google.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // Twee redenen om alles te weren: de site staat achter het slot, of dit is
  // een preview-deploy. Zo'n voorbeeld-adres mag nooit in Google terechtkomen —
  // dat wordt een tweede versie van de site die met de echte concurreert.
  const maintenance = process.env.MAINTENANCE_MODE === "on";
  const preview = process.env.VERCEL_ENV === "preview";
  if (maintenance || preview) {
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
