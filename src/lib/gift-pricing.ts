import { PRIJZEN } from "./prijzen";

export const packedRate = (counterCentsPer100g: number) => counterCentsPer100g + 25;
export const TRIO_GRAMS = [40, 60, 80] as const;
export const GIFT_PACKAGE_GRAMS = [[150, 75, 75, 0], [200, 150, 150, 0], [300, 200, 200, 100]] as const;

// Counter prices in cents per 100 g, including the shop’s smoked salmon belly rate.
const shrimp = 795, eel = 850, salmon = 595, mackerel = 495, belly = 275;
export const COUNTER_RATES = { shrimp, eel, salmon, mackerel, belly };
export const STANDARD_FISH_TRIO = 1895;
export const FISH_TRIO_PORTION = 80;
export const SALAD_TRIO_PORTION = 120;
export const GIFT_BOX = 395;
const gravlaxPerKg = Math.round(PRIJZEN["gravad-lax"].euro * 100);
export const PACKAGE_EXTRAS = [packedRate(Math.round(gravlaxPerKg / 10)), packedRate(shrimp)] as const;
export const trioRates = [shrimp, eel, salmon, mackerel].map(packedRate);
const packageRates = [salmon, eel, mackerel, belly].map(packedRate);

export function trioPriceCents(size: number, fish: readonly number[] = [0, 1, 2]) {
  const grams = TRIO_GRAMS[size];
  if (!grams || fish.length !== 3 || new Set(fish).size !== 3 ||
    fish.some(index => !Number.isInteger(index) || trioRates[index] === undefined)) return null;
  return Math.round(grams * fish.reduce((sum, i) => sum + trioRates[i], 0) / 100);
}

export function packagePriceCents(size: number, extras: readonly number[] = []) {
  const portions = GIFT_PACKAGE_GRAMS[size];
  if (!portions || new Set(extras).size !== extras.length ||
    extras.some(index => !Number.isInteger(index) || PACKAGE_EXTRAS[index] === undefined)) return null;
  const fish = portions.reduce<number>((sum, grams, i) => sum + grams * packageRates[i], 0);
  return Math.round(fish / 100) + extras.reduce((sum, i) => sum + PACKAGE_EXTRAS[i], 0);
}
