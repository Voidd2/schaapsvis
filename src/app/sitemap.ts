import { seasonalCatalogOpen, seasonalPathPaused } from "@/lib/seasonal-availability";
import { headers } from "next/headers";
import { isWorkerPreview } from "@/lib/preview-host";
import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { products } from "@/lib/assortiment-data";
import { recepten } from "@/lib/recepten";
import { productPhoto } from "@/lib/product-beeld";
import { legacyTrioSlugs } from "@/lib/seafood-catalog";
import { FEESTDAGEN_PRODUCTEN } from "@/lib/feestdagen-producten";

import { BEELD, vrijdagKraamFoto } from "@/lib/beeld";
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
// Route content changed in this release; unknown dates are omitted rather than invented.
const CONTENT_DATES: Record<string, string> = {
  "/visschalen": "2026-11-09",
  "/feestdagen": "2026-11-09",
  "/relatiegeschenken": "2026-11-09",
  "/recepten": "2026-11-09",
  "/assortiment": "2026-11-24",
  "/assortiment/kibbeling": "2026-11-24",
  "/blog": "2026-11-24",
};

const locatieBeelden: Record<string, string[]> = {
  "": [BEELD.winkelGevel.bestand, BEELD.kraamToonbank.bestand],
  "/bezoek-ons": [BEELD.winkelGevel.bestand, BEELD.hoogvlietVoorschoten.bestand],
  "/viswinkel-leiden": [BEELD.winkelToonbank.bestand],
  "/marktkraam-leiden": [BEELD.historieNu.bestand, BEELD.haringkraam.bestand, BEELD.marktVoorschoten.bestand],
  "/viswinkel-voorschoten": [
    BEELD.marktVoorschoten.bestand,
    vrijdagKraamFoto.bestand,
  ],
  "/varlaks": ["/images/varlaks/zalmfilet-1200.webp", BEELD.marktVoorschoten.bestand],
};

/** Pagina's die in nl, en én de bestaan. */
const MEERTALIG: {
  pad: string;
  prioriteit: number;
  frequentie: "weekly" | "monthly" | "yearly";
  gewijzigd?: Date;
}[] = [
  { pad: "", gewijzigd: new Date("2026-11-24"), prioriteit: 1.0, frequentie: "weekly" as const },

  { pad: "/visschalen", prioriteit: 0.95, frequentie: "weekly" as const },
  { pad: "/feestdagen", prioriteit: 0.95, frequentie: "weekly" as const, gewijzigd: new Date("2026-10-30") },
  { pad: "/feestdagen/verse-vis", prioriteit: 0.8, frequentie: "weekly" as const },
  { pad: "/relatiegeschenken", prioriteit: 0.8, frequentie: "weekly" as const, gewijzigd: new Date("2026-10-30") },

  { pad: "/assortiment", prioriteit: 0.9, frequentie: "weekly" as const },
  { pad: "/gourmetschotel", prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/barbecue-gourmet", prioriteit: 0.8, frequentie: "monthly" as const, gewijzigd: new Date("2026-10-21") },
  { pad: "/bezoek-ons", gewijzigd: new Date("2026-11-23"), prioriteit: 0.85, frequentie: "monthly" as const },
  { pad: "/varlaks", gewijzigd: new Date("2026-11-23"), prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/ons-verhaal", prioriteit: 0.7, frequentie: "yearly" as const },
  { pad: "/contact", gewijzigd: new Date("2026-11-24"), prioriteit: 0.6, frequentie: "yearly" as const },
  { pad: "/recepten", prioriteit: 0.6, frequentie: "monthly" as const },
  { pad: "/blog", prioriteit: 0.6, frequentie: "monthly" as const },
  { pad: "/viskalender", gewijzigd: new Date("2026-11-24"), prioriteit: 0.6, frequentie: "monthly" as const },
  { pad: "/viswinkel-voorschoten", gewijzigd: new Date("2026-11-24"), prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/viswinkel-leiden", gewijzigd: new Date("2026-11-24"), prioriteit: 0.8, frequentie: "monthly" as const },
  { pad: "/studentenkorting", gewijzigd: new Date("2026-11-24"), prioriteit: 0.6, frequentie: "monthly" as const },
  { pad: "/aanbiedingen", prioriteit: 0.6, frequentie: "monthly" as const },
  { pad: "/marktkraam-leiden", gewijzigd: new Date("2026-11-24"), prioriteit: 0.7, frequentie: "monthly" as const },
  { pad: "/too-good-to-go", gewijzigd: new Date("2026-11-24"), prioriteit: 0.5, frequentie: "monthly" as const },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Staat het slot erop, dan valt er niets te indexeren. De proxy houdt een
  // crawler hier sowieso weg; dit is het tweede slot.
  if (siteOpSlot() || isWorkerPreview((await headers()).get("host"))) return [];

  const regels: MetadataRoute.Sitemap = [];

  // ── Vaste pagina's, in alle drie de talen ────────────────────────────────
  for (const { pad, prioriteit, frequentie, gewijzigd } of MEERTALIG) {
    if (seasonalPathPaused(pad)) continue;
    const alternates = meertaligeAlternates(pad);
    for (const taal of LOCALES) {
      regels.push({
        url: `${basis}/${taal}${pad}`,
        lastModified: CONTENT_DATES[pad] ? new Date(CONTENT_DATES[pad]) : gewijzigd,
        changeFrequency: frequentie,
        priority: prioriteit,
        alternates,
        images: locatieBeelden[pad]?.map(src => basis + src),
      });
    }
  }

  // ── Productpagina's ──────────────────────────────────────────────────────
  for (const product of products) {
    if (product.slug === "varlaks-zalm") continue; // The campaign page is its canonical product page.
    const pad = `/assortiment/${product.slug}`;
    for (const taal of LOCALES) {
      regels.push({url: `${basis}/${taal}${pad}`, lastModified: CONTENT_DATES[pad] ? new Date(CONTENT_DATES[pad]) : undefined, changeFrequency: "monthly", priority: 0.65, alternates: meertaligeAlternates(pad), images: productPhoto(product) ? [basis + productPhoto(product)!.src] : undefined});
    }
  }

  // ── Feestdagenproducten ──────────────────────────────────────────────────
  for (const product of seasonalCatalogOpen ? FEESTDAGEN_PRODUCTEN : []) {
    if (product.categorie === "visschalen") continue;
    if (legacyTrioSlugs.includes(product.slug)) continue;
    const pad = `/feestdagen/${product.slug}`;
    for (const taal of LOCALES) {
      regels.push({
        url: `${basis}/${taal}${pad}`,
        lastModified: new Date("2026-11-03"),
        changeFrequency: "weekly",
        priority: 0.72,
        alternates: meertaligeAlternates(pad),
        images: [`${basis}${product.afbeelding}`],
      });
    }
  }

  // ── Volledig vertaalde artikelen en recepten ─────────────────────────────
  for (const post of blogPosts) {
    const pad = `/blog/${post.slug}`;
    for (const taal of LOCALES) regels.push({url:`${basis}/${taal}${pad}`,lastModified:new Date(post.bijgewerkt ?? post.datum),changeFrequency:"yearly",priority:0.5,alternates:meertaligeAlternates(pad),images:post.fotoUrl ? [basis + post.fotoUrl] : undefined});
  }

  for (const recept of recepten) {
    const pad = `/recepten/${recept.slug}`;
    for (const taal of LOCALES) regels.push({url:`${basis}/${taal}${pad}`,lastModified:recept.bijgewerkt ? new Date(recept.bijgewerkt) : undefined,changeFrequency:"yearly",priority:0.5,alternates:meertaligeAlternates(pad),images:recept.fotoUrl ? [basis + recept.fotoUrl] : undefined});
  }

  return regels;
}
