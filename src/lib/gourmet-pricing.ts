// Retail basis supplied by owner, 5 November 2026: salmon, tuna, cod, prawns.
export const GOURMET_RETAIL_CENTS_PER_100G = [350, 350, 350, 275] as const;
export const GOURMET_PREPARATION_RANGE_CENTS = [500, 1500] as const;
export const LOOSE_GOURMET_FISH_INDEX: Record<string, number> = { "gourmetstukjes-zalm": 0, "gourmetstukjes-tonijn": 1, "gourmet-stukjes-kabeljauw": 2 };
// Net seafood weights, excluding marinade. Composition/prices chosen with owner authorisation.
export const GOURMET_PORTIONS = {
  "gourmet-trio-1-persoon": { grams: [100, 100, 100, 0], preparationCents: 500, people: [1, 1] },
  "gourmet-schotel-3-4-pers": { grams: [300, 200, 300, 200], preparationCents: 900, people: [3, 4] },
  "gourmetschotel-5-6-pers": { grams: [450, 300, 450, 300], preparationCents: 1225, people: [5, 6] },
} as const;
export function gourmetPortion(slug: string) { return GOURMET_PORTIONS[slug as keyof typeof GOURMET_PORTIONS]; }
export function gourmetPriceCents(slug: keyof typeof GOURMET_PORTIONS) {
  const portion = GOURMET_PORTIONS[slug];
  return Math.round(portion.grams.reduce<number>((sum, grams, i) => sum + grams * GOURMET_RETAIL_CENTS_PER_100G[i], 0) / 100) + portion.preparationCents;
}
export function gourmetPortionText(slug: string, locale: string) {
  const portion = gourmetPortion(slug);
  if (!portion) return "";
  const grams = portion.grams.reduce<number>((sum, weight) => sum + weight, 0);
  const weight = grams === 1000 ? "1 kg" : grams === 1500 ? (locale === "en" ? "1.5 kg" : "1,5 kg") : `${grams} g`;
  return locale === "en" ? `${weight} of seafood in total, excluding marinade. Platter and preparation included; side dishes not included.`
    : locale === "de" ? `${weight} Fisch und Meeresfrüchte insgesamt, ohne Marinade. Platte und Zubereitung inklusive; ohne Beilagen.`
    : `${weight} ${portion.grams[3] ? "vis en garnalen" : "vis"} in totaal, exclusief marinade. Inclusief schaal en bereiding; zonder bijgerechten.`;
}
