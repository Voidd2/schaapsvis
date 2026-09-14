import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { products } from "@/lib/assortiment-data";
import { recepten } from "@/lib/recepten";
import { GEMEENTEN } from "@/lib/bezorging";
import { BEDRIJF } from "@/lib/bedrijf";
import { LOCALES } from "@/lib/seo";
import { siteOpSlot } from "@/lib/siteAccess";

const basis = BEDRIJF.domein;

/**
 * De sitemap.
 *
 * Twee regels waar het vaak misgaat en die hier wél kloppen:
 *
 * 1. `lastModified` staat op een vaste datum en niet op "nu". Zet je daar de
 *    requesttijd neer, dan lijkt élke pagina bij elk bezoek net gewijzigd en
 *    negeert Google het veld — precies het tegenovergestelde van wat je wilt.
 * 2. Alleen pagina's die in álle drie de talen bestaan krijgen hreflang-
 *    verwijzingen naar die talen. Verwijzen naar een Duitse versie die er niet
 *    is, kost je de koppeling tussen de versies die er wél zijn.
 */
const LAATSTE_WIJZIGING = new Date("2026-09-04");

/** Pagina's die in nl, en én de bestaan. */
const MEERTALIG = [
  { pad: "", prioriteit: 1.0, frequentie: "weekly" as const },
  { pad: "/bezorgen", prioriteit: 0.95, frequentie: "weekly" as const },
  { pad: "/visschalen", prioriteit: 0.95, frequentie: "weekly" as const },
  { pad: "/bestellen", prioriteit: 0.9, frequentie: "weekly" as const },
  { pad: "/assortiment", prioriteit: 0.9, frequentie: "weekly" as const },
  { pad: "/bezoek-ons", prioriteit: 0.85, frequentie: "monthly" as const },
  { pad: "/biologische-vis", prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/varlaks", prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/ons-verhaal", prioriteit: 0.7, frequentie: "yearly" as const },
  { pad: "/contact", prioriteit: 0.6, frequentie: "yearly" as const },
];

/**
 * Pagina's die maar in één taal geschreven zijn. Die zetten we ook maar één
 * keer in de sitemap: een Duitse verwijzing naar een Nederlandse tekst is geen
 * vertaling, en Google behandelt zo'n verkeerde koppeling als een fout.
 */
const EENTALIG: { taal: "nl" | "de"; pad: string; prioriteit: number; paar?: { taal: "nl" | "de"; pad: string } }[] = [
  {
    taal: "nl",
    pad: "/viswinkel-leiden",
    prioriteit: 0.8,
    paar: { taal: "de", pad: "/frischer-fisch-leiden" },
  },
  {
    taal: "de",
    pad: "/frischer-fisch-leiden",
    prioriteit: 0.75,
    paar: { taal: "nl", pad: "/viswinkel-leiden" },
  },
  { taal: "nl", pad: "/marktkraam-leiden", prioriteit: 0.7 },
  { taal: "nl", pad: "/viswinkel-voorschoten", prioriteit: 0.7 },
  { taal: "nl", pad: "/viskalender", prioriteit: 0.6 },
  { taal: "nl", pad: "/blog", prioriteit: 0.6 },
  { taal: "nl", pad: "/recepten", prioriteit: 0.6 },
  { taal: "nl", pad: "/too-good-to-go", prioriteit: 0.5 },
];

function meertaligeAlternates(pad: string) {
  const talen: Record<string, string> = {};
  for (const taal of LOCALES) talen[taal] = `${basis}/${taal}${pad}`;
  talen["x-default"] = `${basis}/nl${pad}`;
  return { languages: talen };
}

// Net als robots.txt bij elk verzoek opnieuw bepalen; anders blijft een lege
// sitemap staan nadat de site is opengezet.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  // Staat het slot erop, dan valt er niets te indexeren. De proxy houdt een
  // crawler hier sowieso weg; dit is het tweede slot.
  if (siteOpSlot()) return [];

  const regels: MetadataRoute.Sitemap = [];

  // ── Vaste pagina's, in alle drie de talen ────────────────────────────────
  for (const { pad, prioriteit, frequentie } of MEERTALIG) {
    const alternates = meertaligeAlternates(pad);
    for (const taal of LOCALES) {
      regels.push({
        url: `${basis}/${taal}${pad}`,
        lastModified: LAATSTE_WIJZIGING,
        changeFrequency: frequentie,
        priority: prioriteit,
        alternates,
      });
    }
  }

  // ── Bezorgpagina's per gemeente ──────────────────────────────────────────
  for (const gemeente of GEMEENTEN) {
    const pad = `/bezorgen/${gemeente.slug}`;
    const alternates = meertaligeAlternates(pad);
    for (const taal of LOCALES) {
      regels.push({
        url: `${basis}/${taal}${pad}`,
        lastModified: LAATSTE_WIJZIGING,
        changeFrequency: "monthly",
        priority: 0.85,
        alternates,
      });
    }
  }

  // ── Productpagina's ──────────────────────────────────────────────────────
  for (const product of products) {
    const pad = `/assortiment/${product.slug}`;
    const alternates = meertaligeAlternates(pad);
    for (const taal of LOCALES) {
      regels.push({
        url: `${basis}/${taal}${pad}`,
        lastModified: LAATSTE_WIJZIGING,
        changeFrequency: "monthly",
        priority: 0.65,
        alternates,
      });
    }
  }

  // ── Pagina's in één taal ────────────────────────────────────────────────
  for (const { taal, pad, prioriteit, paar } of EENTALIG) {
    const talen: Record<string, string> = { [taal]: `${basis}/${taal}${pad}` };
    if (paar) talen[paar.taal] = `${basis}/${paar.taal}${paar.pad}`;
    talen["x-default"] = talen.nl ?? `${basis}/${taal}${pad}`;
    regels.push({
      url: `${basis}/${taal}${pad}`,
      lastModified: LAATSTE_WIJZIGING,
      changeFrequency: "monthly",
      priority: prioriteit,
      alternates: { languages: talen },
    });
  }

  // ── Artikelen en recepten: alleen Nederlands, dus geen hreflang ──────────
  for (const post of blogPosts) {
    regels.push({
      url: `${basis}/nl/blog/${post.slug}`,
      lastModified: new Date(post.datum),
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  for (const recept of recepten) {
    regels.push({
      url: `${basis}/nl/recepten/${recept.slug}`,
      lastModified: LAATSTE_WIJZIGING,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return regels;
}
