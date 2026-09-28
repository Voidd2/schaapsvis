import { products } from "./assortiment-data";

// Redactionele volgorde, geen gemeten verkoopcijfers. Pas aan met winkeldata.
export const FAVORIETEN = ["varlaks-zalm", "kibbeling", "haring", "zalmfilet", "lekkerbek", "kabeljauwfilet", "gerookte-zalm-high-seas"];
export const gesorteerdAssortiment = [...products].sort((a, b) => {
  const rang = (slug: string) => { const i = FAVORIETEN.indexOf(slug); return i < 0 ? 999 : i; };
  return rang(a.slug) - rang(b.slug) || a.naam.localeCompare(b.naam, "nl");
});
