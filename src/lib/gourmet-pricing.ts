// Retail prices in cents per 100 g of cleaned fish.
export const gourmetRates = {
  salmon: 350, tuna: 500, cod: 350, "black-tigers": 250,
  halibut: 300, seabass: 300, squid: 275,
} as const;
export const MARINADE_CENTS_PER_100G = 25;
export const presetFish = ["salmon", "tuna", "cod", "black-tigers"] as const;
export const GOURMET_RETAIL_CENTS_PER_100G = presetFish.map(id => gourmetRates[id]);
export const LOOSE_GOURMET_FISH_INDEX: Record<string, number> = { "gourmetstukjes-zalm": 0, "gourmetstukjes-tonijn": 1, "gourmet-stukjes-kabeljauw": 2 };
// Net seafood weights, excluding marinade. Composition/prices chosen with owner authorisation.
export const GOURMET_PORTIONS = {
  "gourmet-trio-1-persoon": { grams: [100, 100, 100, 0], people: [1, 1] },
  "gourmet-schotel-3-4-pers": { grams: [300, 200, 300, 200], people: [3, 4] },
  "gourmetschotel-5-6-pers": { grams: [450, 300, 450, 300], people: [5, 6] },
} as const;
export function gourmetPortion(slug: string) { return Object.hasOwn(GOURMET_PORTIONS, slug) ? GOURMET_PORTIONS[slug as keyof typeof GOURMET_PORTIONS] : undefined; }
export function gourmetPriceCents(slug: keyof typeof GOURMET_PORTIONS) {
  const portion = GOURMET_PORTIONS[slug];
  return Math.round(portion.grams.reduce<number>((sum, grams, i) => sum + grams * GOURMET_RETAIL_CENTS_PER_100G[i], 0) / 100);
}
export function gourmetPortionText(slug: string, locale: string) {
  const portion = gourmetPortion(slug);
  if (!portion) return "";
  const grams = portion.grams.reduce<number>((sum, weight) => sum + weight, 0);
  const weight = grams === 1000 ? "1 kg" : grams === 1500 ? (locale === "en" ? "1.5 kg" : "1,5 kg") : `${grams} g`;
  return locale === "en" ? `${weight} of seafood in standard tubs. Choose the weight and marinade for each variety.`
    : locale === "de" ? `${weight} Fisch und Meeresfrüchte in Standardschalen. Gewicht und Marinade je Sorte wählbar.`
    : `${weight} aan vis in standaardbakjes. Gewicht en marinade kiest u per soort.`;
}

export function gourmetOrderHref(locale: string, slug = "") {
  return `/${locale}/gourmetschotel${gourmetPortion(slug) ? "?formaat=" + slug : ""}`;
}
