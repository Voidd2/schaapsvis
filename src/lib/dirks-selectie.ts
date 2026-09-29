import offers from "../data/dirks-offers-2026-09-29.json";
import { siteLanguage } from "./language";

export type SelectieGroep = "borrelbox" | "klassiek" | "luxe" | "hapjes" | "bijzonder" | "barbecue" | "gourmet" | "los";
export type SelectieItem = {
  slug: string;
  groep: SelectieGroep;
  naam: string;
  foto: string;
  prijs: number;
  bronPrijs: number;
  personenVan?: number;
  personenTot?: number;
  alleenAanvraag?: boolean;
  perStuk?: boolean;
};

const groeps: Record<string, SelectieGroep> = {
  "borrelbox-groot-4-5-pers": "borrelbox", "borrelbox-klein-2-3-pers": "borrelbox", "borrelbox-luxe-2-4-pers": "borrelbox",
  "visschotel-klein-2-3-pers": "klassiek", "visschotel-klein-3-5-pers": "klassiek", "visschotel-middel-5-8-pers": "klassiek", "visschotel-groot-8-10-pers": "klassiek",
  "visschotel-luxe-2-3-pers": "luxe", "visschotel-luxe-3-5-pers": "luxe", "visschotel-luxe-5-8-pers": "luxe", "visschotel-luxe-8-10-pers": "luxe", "visschotel-luxe-10-14-pers": "luxe",
  "visschotel-hapjes-2-3-pers": "hapjes", "visschotel-hapjes-3-5-pers": "hapjes", "visschotel-hapjes-6-10-pers": "hapjes",
  "visschotel-kreeft": "bijzonder", "visschotel-glutenvrij-1-persoon": "bijzonder",
  "barbecuepakket": "barbecue", "barbecuepakket-xxl": "barbecue",
  "gourmet-trio-1-persoon": "gourmet", "gourmet-schotel-3-4-pers": "gourmet", "gourmetschotel-5-6-pers": "gourmet",
  "gourmetstukjes-tonijn": "los", "gourmet-stukjes-kabeljauw": "los", "gourmetstukjes-zalm": "los",
  "zalmspies": "los", "tonijnspies": "los", "gambaspies-in-knoflook": "los", "zalm-kabeljauwspies": "los", "vispakketje": "los",
};

const namen: Record<string, readonly [string, string, string]> = {
  "borrelbox-groot-4-5-pers": ["Borrelbox groot (4–5 personen)", "Large seafood sharing box (4–5 people)", "Große Fisch-Snackbox (4–5 Personen)"],
  "borrelbox-klein-2-3-pers": ["Borrelbox klein (2–3 personen)", "Small seafood sharing box (2–3 people)", "Kleine Fisch-Snackbox (2–3 Personen)"],
  "borrelbox-luxe-2-4-pers": ["Borrelbox luxe (2–4 personen)", "Deluxe seafood sharing box (2–4 people)", "Deluxe-Fisch-Snackbox (2–4 Personen)"],
  "visschotel-klein-2-3-pers": ["Visschotel klein (2–3 personen)", "Small seafood platter (2–3 people)", "Kleine Fischplatte (2–3 Personen)"],
  "visschotel-klein-3-5-pers": ["Visschotel klein (3–5 personen)", "Small seafood platter (3–5 people)", "Kleine Fischplatte (3–5 Personen)"],
  "visschotel-middel-5-8-pers": ["Visschotel middel (5–8 personen)", "Medium seafood platter (5–8 people)", "Mittlere Fischplatte (5–8 Personen)"],
  "visschotel-groot-8-10-pers": ["Visschotel groot (8–10 personen)", "Large seafood platter (8–10 people)", "Große Fischplatte (8–10 Personen)"],
  "visschotel-luxe-2-3-pers": ["Luxe visschotel (2–3 personen)", "Deluxe seafood platter (2–3 people)", "Deluxe-Fischplatte (2–3 Personen)"],
  "visschotel-luxe-3-5-pers": ["Luxe visschotel (3–5 personen)", "Deluxe seafood platter (3–5 people)", "Deluxe-Fischplatte (3–5 Personen)"],
  "visschotel-luxe-5-8-pers": ["Luxe visschotel (5–8 personen)", "Deluxe seafood platter (5–8 people)", "Deluxe-Fischplatte (5–8 Personen)"],
  "visschotel-luxe-8-10-pers": ["Luxe visschotel (8–10 personen)", "Deluxe seafood platter (8–10 people)", "Deluxe-Fischplatte (8–10 Personen)"],
  "visschotel-luxe-10-14-pers": ["Luxe visschotel (10–14 personen)", "Deluxe seafood platter (10–14 people)", "Deluxe-Fischplatte (10–14 Personen)"],
  "visschotel-hapjes-2-3-pers": ["Vishapjesschotel (2–3 personen)", "Seafood bites platter (2–3 people)", "Fischhäppchen-Platte (2–3 Personen)"],
  "visschotel-hapjes-3-5-pers": ["Vishapjesschotel (3–5 personen)", "Seafood bites platter (3–5 people)", "Fischhäppchen-Platte (3–5 Personen)"],
  "visschotel-hapjes-6-10-pers": ["Vishapjesschotel (6–10 personen)", "Seafood bites platter (6–10 people)", "Fischhäppchen-Platte (6–10 Personen)"],
  "visschotel-kreeft": ["Visschotel met kreeft", "Seafood platter with lobster", "Fischplatte mit Hummer"],
  "visschotel-glutenvrij-1-persoon": ["Visschotel met dieetwensen (1 persoon)", "Seafood platter with dietary requirements (1 person)", "Fischplatte mit Ernährungswünschen (1 Person)"],
  "barbecuepakket": ["Visbarbecuepakket", "Seafood barbecue pack", "Fisch-Grillpaket"],
  "barbecuepakket-xxl": ["Visbarbecuepakket XXL", "Seafood barbecue pack XXL", "Fisch-Grillpaket XXL"],
  "gourmet-trio-1-persoon": ["Visgourmet trio (1 persoon)", "Seafood gourmet trio (1 person)", "Fisch-Gourmet-Trio (1 Person)"],
  "gourmet-schotel-3-4-pers": ["Visgourmetschotel (3–4 personen)", "Seafood gourmet platter (3–4 people)", "Fisch-Gourmetplatte (3–4 Personen)"],
  "gourmetschotel-5-6-pers": ["Visgourmetschotel (5–6 personen)", "Seafood gourmet platter (5–6 people)", "Fisch-Gourmetplatte (5–6 Personen)"],
  "gourmetstukjes-tonijn": ["Gourmetstukjes tonijn", "Tuna pieces for gourmet grilling", "Thunfischstücke fürs Tischgrillen"],
  "gourmet-stukjes-kabeljauw": ["Gourmetstukjes kabeljauw", "Cod pieces for gourmet grilling", "Kabeljaustücke fürs Tischgrillen"],
  "gourmetstukjes-zalm": ["Gourmetstukjes zalm", "Salmon pieces for gourmet grilling", "Lachsstücke fürs Tischgrillen"],
  "zalmspies": ["Zalmspies", "Salmon skewer", "Lachsspieß"],
  "tonijnspies": ["Tonijnspies", "Tuna skewer", "Thunfischspieß"],
  "gambaspies-in-knoflook": ["Gambaspies met knoflook", "Prawn skewer with garlic", "Garnelenspieß mit Knoblauch"],
  "zalm-kabeljauwspies": ["Zalm-kabeljauwspies", "Salmon and cod skewer", "Lachs-Kabeljau-Spieß"],
  "vispakketje": ["Vispakketje voor de barbecue", "Seafood foil parcel for the barbecue", "Fischpäckchen für den Grill"],
};

const personen = (slug: string): [number, number] | undefined => {
  const range = slug.match(/(\d+)-(\d+)-pers$/);
  if (range) return [Number(range[1]), Number(range[2])];
  if (slug.endsWith("1-persoon")) return [1, 1];
  return undefined;
};

export const DIRKS_SELECTIE: SelectieItem[] = offers.offers.map((offer) => {
  const groep = groeps[offer.slug];
  const titel = namen[offer.slug];
  if (!groep || !titel) throw new Error(`Ontbrekende catalogustekst: ${offer.slug}`);
  const bereik = personen(offer.slug);
  return {
    slug: offer.slug,
    groep,
    naam: titel[0],
    foto: `/images/dirks/${offer.slug}.webp`,
    prijs: offer.targetCents / 100,
    bronPrijs: offer.sourceCents / 100,
    personenVan: bereik?.[0],
    personenTot: bereik?.[1],
    alleenAanvraag: offer.slug === "visschotel-glutenvrij-1-persoon" || offer.slug === "visschotel-kreeft",
    perStuk: ["zalmspies", "tonijnspies", "gambaspies-in-knoflook", "zalm-kabeljauwspies", "vispakketje"].includes(offer.slug),
  };
});

export function selectieNaam(slug: string, locale: string): string {
  const taal = siteLanguage(locale);
  const vertaling = namen[slug];
  if (!vertaling) throw new Error(`Ontbrekende vertaling: ${slug}`);
  return vertaling[taal === "en" ? 1 : taal === "de" ? 2 : 0];
}

export const DIRKS_VISSCHALEN = DIRKS_SELECTIE.filter((x) => !["barbecue", "gourmet", "los"].includes(x.groep));
export const DIRKS_BARBECUE = DIRKS_SELECTIE.filter((x) => ["barbecue", "gourmet", "los"].includes(x.groep));
