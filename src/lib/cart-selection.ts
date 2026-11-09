import { eelChoices, isPlatterMode, platterIngredients, platterMenu, platterModes } from "./platter-menu";
import { assemblyQuote, delicacyMode, language, platterFish, saladCounter, weightQuote, type Assembly } from "./counter-selection";
import { isDeliTrio } from "./deli-trio";
import { feestdagenBedrag } from "./feestdagen-producten";
import { giftCopy } from "./gift-copy";
import { gourmetFish, gourmetLines, gourmetQuote, gourmetRequestCopy } from "./gourmet-request";
import { inquiryText } from "./platter-inquiry";
import { catalogProduct } from "./seafood-catalog";

export type CartSelection = {
  id: string;
  options: string;
  note?: string;
  needsNote?: boolean;
};
type Quote = { title: string; lines: string[]; cents: number; incomplete: boolean };

// Only option codes and numeric values enter session storage. User-entered notes stay in memory.
const optionCodes = new Set<string>([
  "plaice", "whiting", "prawns", "assembly", "gourmet", "platter", "fish-trio", "salad-trio", "deluxe-salad", "package", "gift-trio", "custom",
  "shop", ...platterModes, ...Object.keys(platterIngredients), "own", "yes", "standard", "premium", "luxury", "salads", "mixed", "advice", "tubs", "house-salmon",
  ...platterFish.map(f => f.id), ...saladCounter.map(f => f.id), ...gourmetFish.map(f => f.id),
]);
export function cartOptions(data: URLSearchParams) {
  const options = new URLSearchParams();
  for (const [key, value] of data) {
    if (key === "slug" && (isDeliTrio(value) || value === "zalmslaatje-de-luxe")) options.set(key, value);
    if (/^(kind|mode|selection|presentation|packaging|choice[0-2]|box|fish)$/.test(key) && optionCodes.has(value)) options.append(key, value);
    if (key.startsWith("swap-") && Object.hasOwn(platterIngredients,key.slice(5)) && (value === "shop" || Object.hasOwn(platterIngredients,value))) options.set(key,value);
    if (key === "marinade" && gourmetFish.some(fish => fish.id === value)) options.append(key, value);
    if (key === "eelChoice" && Object.hasOwn(eelChoices, value)) options.set(key, value);
    if (key === "size" && /^(own|[012])$/.test(value)) options.set(key, value);
    if ((key === "budget" || key === "voucher") && /^\d{1,8}(?:[.,]\d{1,2})?$/.test(value)) options.set(key, value);
    if ((key === "people" || key.startsWith("weight-") && optionCodes.has(key.slice(7))) && /^\d{1,6}$/.test(value)) options.set(key, value);
  }
  return options.toString();
}

export function selectionQuote(data: URLSearchParams, locale: string): Quote | null {
  const kind = data.get("kind"), money = (cents: number) => feestdagenBedrag(cents, locale);
  if (kind === "assembly") {
    const mode = data.get("mode") as Assembly, slug = data.get("slug") ?? "";
    if (isPlatterMode(mode)) {
      const quote = assemblyQuote(mode,locale,data);
      return quote && { title:platterMenu[mode].names[language(locale)], lines:quote.lines, cents:quote.total, incomplete:false };
    }
    const giftIndex = mode === "gift-trio" ? 1 : mode === "custom" ? 2 : null;
    if (giftIndex === null && (!(isDeliTrio(slug) || slug === "zalmslaatje-de-luxe") || mode !== delicacyMode(slug))) return null;
    const quote = assemblyQuote(mode, locale, data);
    if (!quote) return null;
    const title = giftIndex !== null ? giftCopy(locale).items[giftIndex][0] : catalogProduct(slug, locale).naam;
    return { title, lines: quote.lines, cents: quote.total, incomplete: false };
  }
  const fish = data.getAll("fish"), people = data.get("people") || "";
  if (kind === "gourmet") {
    if (!/^[1-9]\d*$/.test(people) || Number(people) > 200 || data.get("packaging") !== "standard") return null;
    const portions = Object.fromEntries(fish.map(id => [id, data.get("weight-" + id) ?? ""]));
    const quote = gourmetQuote(portions, data.getAll("marinade"));
    if (!quote) return null;
    const t = gourmetRequestCopy(locale);
    return { title: t.summary,
      lines: [t.people + ": " + people, ...gourmetLines(quote, locale), t.standard + " · " + t.free],
      cents: quote.total, incomplete: false };
  }
  if (kind !== "platter") return null;
  const t = inquiryText(locale);
  const selection = data.get("selection") as keyof typeof t.kinds;
  const presentation = data.get("presentation") as keyof typeof t.presentations;
  if (!Object.hasOwn(t.kinds, selection) || !Object.hasOwn(t.presentations, presentation)) return null;
  if (selection !== "salads" && !/^[1-9]\d*$/.test(people)) return null;
  const ingredients = selection === "salads" ? saladCounter : [...platterFish, ...saladCounter];
  const quote = weightQuote(data, ingredients, locale);
  if (!quote) return null;
  const lines = [t.kinds[selection], ...quote.lines, t.presentations[presentation]];
  if (people && selection !== "salads") lines.push(t.people + ": " + people);
  const budget = data.get("budget");
  if (budget) lines.push(t.budgetMessage + ": " + money(Math.round(Number(budget.replace(",", ".")) * 100)));
  const title = ["Visschaal op maat", "Custom seafood platter", "Fischplatte nach Wunsch"][language(locale)];
  return { title, lines, cents: quote.cents, incomplete: true };
}
