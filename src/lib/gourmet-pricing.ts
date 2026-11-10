// Retail prices in cents per 100 g of cleaned fish.
export const gourmetRates = {
  salmon: 350, tuna: 500, cod: 350, "black-tigers": 250,
  halibut: 300, seabass: 300, squid: 275,
} as const;
export const MARINADE_CENTS_PER_100G = 25;
export const gourmetFishPhotos: Record<keyof typeof gourmetRates, string> = {
  salmon: "/images/editorial/gourmet-zalm-naturel.webp",
  tuna: "/images/editorial/gourmet-tonijn-naturel.webp",
  cod: "/images/editorial/gourmet-kabeljauw-naturel.webp",
  "black-tigers": "/images/schaaps/gepelde-black-tiger-garnalen.webp",
  halibut: "/images/editorial/gourmet-heilbot-naturel.webp",
  seabass: "/images/editorial/gourmet-zeebaars-naturel.webp",
  squid: "/images/editorial/gourmet-inktvisringen-naturel.webp",
};
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
  const surcharge = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(MARINADE_CENTS_PER_100G / 100);
  return locale === "en" ? `${weight} of seafood. Adjust the weight per variety. Optional marinade adds ${surcharge} per 100 g of the selected variety.`
    : locale === "de" ? `${weight} Fischauswahl. Gewicht je Sorte anpassbar. Auf Wunsch mit Marinade für zusätzlich ${surcharge} pro 100 g der gewählten Sorte.`
    : `${weight} vis naar keuze. Pas het gewicht per soort aan. Marinade kost ${surcharge} extra per 100 g van de gekozen soort.`;
}

export function gourmetOrderHref(locale: string, slug = "") {
  return `/${locale}/gourmetschotel${gourmetPortion(slug) ? "?formaat=" + slug : ""}`;
}
