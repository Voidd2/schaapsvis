import { assemblyQuote, byAgreement, delicacyMode, language, platterFish, saladCounter, weightQuote, type Assembly } from "./counter-selection";
import { isDeliTrio } from "./deli-trio";
import { feestdagenBedrag } from "./feestdagen-producten";
import { giftCopy } from "./gift-copy";
import { gourmetFish, gourmetLanguage, gourmetQuote, gourmetRequestCopy } from "./gourmet-request";
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
  "assembly", "gourmet", "platter", "fish-trio", "salad-trio", "deluxe-salad", "package", "gift-trio", "custom",
  "own", "yes", "standard", "premium", "luxury", "salads", "mixed", "advice", "tubs", "house-salmon",
  ...platterFish.map(f => f.id), ...saladCounter.map(f => f.id), ...gourmetFish.map(f => f.id),
]);
export function cartOptions(data: URLSearchParams) {
  const options = new URLSearchParams();
  for (const [key, value] of data) {
    if (key === "slug" && (isDeliTrio(value) || value === "zalmslaatje-de-luxe")) options.set(key, value);
    if (/^(kind|mode|selection|presentation|packaging|choice[0-2]|box|fish)$/.test(key) && optionCodes.has(value)) options.append(key, value);
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
    const giftIndex = mode === "package" ? 0 : mode === "gift-trio" ? 2 : mode === "custom" ? 3 : null;
    if (giftIndex === null && (!(isDeliTrio(slug) || slug === "zalmslaatje-de-luxe") || mode !== delicacyMode(slug))) return null;
    const quote = assemblyQuote(mode, locale, data);
    if (!quote) return null;
    const title = giftIndex !== null ? giftCopy(locale).items[giftIndex][0] : catalogProduct(slug, locale).naam;
    return { title, lines: quote.lines, cents: quote.total, incomplete: false };
  }
  const fish = data.getAll("fish"), people = data.get("people") || "";
  if (kind === "gourmet") {
    const packaging = data.get("packaging");
    if (!/^[1-9]\d*$/.test(people) || Number(people) > 200 || (packaging !== "standard" && packaging !== "premium")) return null;
    const portions = Object.fromEntries(fish.map(id => [id, data.get("weight-" + id) ?? ""]));
    const quote = gourmetQuote(portions, packaging);
    if (!quote) return null;
    const t = gourmetRequestCopy(locale), lang = gourmetLanguage(locale);
    return { title: ["Visgourmet op maat","Custom seafood gourmet platter","Gourmetplatte nach Wunsch"][language(locale)],
      lines: [t.people + ": " + people, ...quote.lines.map(row => row.fish[lang] + " · " + row.weight + " g · " + money(row.cents)),
        t[packaging] + " · " + (quote.total === null ? byAgreement(locale) : t.free)], cents: quote.subtotal, incomplete: quote.total === null };
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
