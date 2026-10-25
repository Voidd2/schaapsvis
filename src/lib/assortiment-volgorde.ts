import { products } from "./assortiment-data";

// Redactionele volgorde, geen gemeten verkoopcijfers. Pas aan met winkeldata.
export const FAVORIETEN = ["kabeljauwfilet", "lekkerbek", "zeebaarsfilet", "creuse-oesters"];
export const gesorteerdAssortiment = [...products].sort((a, b) => {
  const rang = (slug: string) => { const i = FAVORIETEN.indexOf(slug); return i < 0 ? 999 : i; };
  return Number(a.beschikbaar==="unavailable")-Number(b.beschikbaar==="unavailable") || rang(a.slug) - rang(b.slug) || a.naam.localeCompare(b.naam, "nl");
});
