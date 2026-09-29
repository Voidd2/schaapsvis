import { products } from "./assortiment-data";
import { productAvailability } from "./product-availability";

export interface CatalogProduct {
  id: string;
  naam: string;
  beschrijving: string;
  categorie: CatalogCategorie;
  eenheid: string;
  info?: string;
  tip?: string;
  zoekwoorden?: string[];
  beschikbaar: boolean;
}

export type CatalogCategorie =
  | "bereid"
  | "schaal"
  | "gerookt"
  | "zeewier"
  | "vers"
  | "salades"
  | "soepen"
  | "schotels";

export const CATEGORIE_LABELS: Record<CatalogCategorie, string> = {
  bereid: "Bereid & gebakken",
  schaal: "Schaal- & schelpdieren",
  gerookt: "Gerookt & gezouten",
  zeewier: "Zeewier & zeekraal",
  vers: "Verse vissen",
  salades: "Vissalades",
  soepen: "Soepen",
  schotels: "Visschotels (op bestelling)",
};

// Keep the legacy admin view in sync with the public, owner-approved assortment.
export const CATALOG: CatalogProduct[] = products.map((p) => ({
  id: p.slug,
  naam: p.naam,
  beschrijving: p.desc,
  categorie: ({ "verse-vis": "vers", "gerookte-vis": "gerookt", "schaal-schelp": "schaal", vissalades: "salades", bereid: "bereid", zeegroenten: "zeewier" } as const)[p.categorie],
  eenheid: "op aanvraag",
  info: productAvailability(p, "nl").note,
  beschikbaar: p.beschikbaar !== "unavailable",
}));
// Legacy export for admin panel compatibility
export const PRODUCTEN = CATALOG.map((p) => ({
  id: p.id,
  naam: p.naam,
  beschrijving: p.beschrijving,
  categorie: p.categorie as string,
  eenheid: p.eenheid,
  beschikbaar: p.beschikbaar,
  opmerking: p.tip,
}));

export type Product = (typeof PRODUCTEN)[number];
