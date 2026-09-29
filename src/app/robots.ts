import { MetadataRoute } from "next";
import { siteOpSlot } from "@/lib/siteAccess";

// Bij elk verzoek opnieuw bepalen, niet één keer bij het bouwen. Anders blijft
// er "Disallow: /" staan nadat de site is opengezet, tot iemand toevallig
// opnieuw deployt — en zolang dat er staat komt de site simpelweg niet in
// Google.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // Twee redenen om alles te weren: de site staat achter het slot, of dit is
  // een preview-deploy. Zo'n voorbeeld-adres mag nooit in Google terechtkomen —
  // dat wordt een tweede versie van de site die met de echte concurreert.
  //
  // Staat het slot erop, dan komt een crawler hier overigens niet eens: de
  // proxy zet er het wachtwoordscherm voor. Dit blijft staan als tweede slot,
  // voor het geval iemand die uitzondering ooit versoepelt.
  const preview = process.env.VERCEL_ENV === "preview";
  if (siteOpSlot() || preview) {
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
        userAgent: ["Claude-SearchBot", "Claude-User", "ClaudeBot"],
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
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
