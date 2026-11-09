import { packedRate, PACKAGE_EXTRAS, TRIO_GRAMS, trioRates } from "./gift-pricing";
import { feestdagenBedrag } from "./feestdagen-producten";
import { giftRequestCopy } from "./gift-request";
import { whatsappLink } from "./bedrijf";

const fish = [
  { id: "shrimp", rate: trioRates[0], names: ["Hollandse garnalen", "Dutch shrimp", "Nordseegarnelen"] },
  { id: "eel", rate: trioRates[1], names: ["Gerookte palingfilet", "Smoked eel fillet", "Räucheraalfilet"] },
  { id: "salmon", rate: trioRates[2], names: ["Gerookte zalmfilet", "Smoked salmon fillet", "Räucherlachsfilet"] },
  { id: "mackerel", rate: trioRates[3], names: ["Gerookte makreelfilet", "Smoked mackerel fillet", "Räuchermakrelenfilet"] },
  { id: "gravlax", rate: PACKAGE_EXTRAS[0], names: ["Gravad lax met dille", "Dill-cured gravlax", "Graved Lachs mit Dill"] },
];
const salads = [
  { id: "crab", rate: packedRate(350), names: ["Krabsalade", "Crab salad", "Krabbensalat"] },
  { id: "mango", rate: packedRate(350), names: ["Krab-mangosalade", "Crab and mango salad", "Krabben-Mango-Salat"] },
  { id: "tuna", rate: packedRate(350), names: ["Tonijnsalade", "Tuna salad", "Thunfischsalat"] },
  { id: "spicy", rate: packedRate(350), names: ["Pikante tonijnsalade", "Spicy tuna salad", "Pikanter Thunfischsalat"] },
  { id: "wasabi", rate: packedRate(350), names: ["Zalm-wasabisalade", "Salmon and wasabi salad", "Lachs-Wasabi-Salat"] },
  { id: "herring", rate: packedRate(250), names: ["Haring-mosterdsalade", "Herring and mustard salad", "Heringssalat mit Senf"] },
];
const sizes = ["luxe-trio-klein", "luxe-trio-middel", "luxe-vistrio"];
export const deliGroups = [fish, salads];
export const isDeliTrio = (slug: string) => sizes.includes(slug) || slug === "salade-trio";
export const deliLanguage = (locale: string) => locale === "en" ? 1 : locale === "de" ? 2 : 0;
export type Slot = { choice: string; grams: string };

export function initialSlots(slug: string): Slot[] {
  const size = sizes.indexOf(slug);
  if (size >= 0) return fish.slice(0, 3).map(item => ({ choice: item.id, grams: String(TRIO_GRAMS[size]) }));
  return Array.from({ length: 3 }, () => ({ choice: "", grams: "" }));
}

export function deliQuote(slots: Slot[]) {
  if (slots.length !== 3) return null;
  const lines = [];
  let weightedCents = 0, weight = 0;
  for (const slot of slots) {
    const item = deliGroups.flat().find(option => option.id === slot.choice);
    const grams = Number(slot.grams);
    if (!item || !/^\d+$/.test(slot.grams) || grams < 1) return null;
    weightedCents += grams * item.rate;
    if (!Number.isSafeInteger(weightedCents)) return null;
    weight += grams;
    lines.push({ item, grams });
  }
  return { lines, weight, cents: Math.round(weightedCents / 100) };
}

export function deliDraft(locale: string, product: string, slots: Slot[], wishes: string) {
  const quote = deliQuote(slots);
  if (!quote) return null;
  const lang = deliLanguage(locale), t = giftRequestCopy(locale);
  const lines = [t.greeting, product, ...quote.lines.map(({ item, grams }, i) =>
    `${i + 1}. ${item.names[lang]} · ${grams} g · ${feestdagenBedrag(item.rate, locale)} / 100 g`),
    `${quote.weight} g · ${feestdagenBedrag(quote.cents, locale)} · ${t.packaging}`];
  if (wishes.trim()) lines.push(`${t.wishesLine}: ${wishes.trim().slice(0, 700)}`, t.customCost);
  return whatsappLink([...lines, t.note].join("\n"));
}
