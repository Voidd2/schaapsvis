import { products } from "./assortiment-data";

// Redactionele volgorde, geen gemeten verkoopcijfers. Pas aan met winkeldata.
export const FAVORIETEN = ["kabeljauwfilet", "lekkerbek", "zeebaarsfilet", "creuse-oesters"];
const VOORRAADSGROEP: Record<string, number> = {
  always: 0, dagelijks: 0, "shop-always": 0,
  usually: 1, "shop-and-cart-usually": 1, "shop-often": 1, "shop-only": 1,
  current: 2, sometimes: 2, "shop-often-cart-request": 2, "shop-sometimes-or-request": 2,
  "oyster-choice": 2, quality: 2, "smokehouse-quality": 2, "sometimes-request": 2,
  "op bestelling": 3, request: 3, "live-request": 3, "rare-request": 3, "request-bunch": 3,
  unavailable: 4,
};
export const gesorteerdAssortiment = [...products].sort((a, b) => {
  const voorraadRang = (beschikbaar?: string) => VOORRAADSGROEP[beschikbaar ?? "current"] ?? 2;
  return voorraadRang(a.beschikbaar) - voorraadRang(b.beschikbaar) || a.naam.localeCompare(b.naam, "nl");
});
