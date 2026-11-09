import { COUNTER_RATES, GIFT_BOX, STANDARD_FISH_TRIO, TRIO_GRAMS } from "./gift-pricing";
import { giftPackageContents, giftVoucherCents, giftRequestCopy } from "./gift-request";
import { packagePriceCents } from "./gift-pricing";
import { SALAD_PORTION_CENTS } from "./salad-extras";
import { PRIJZEN } from "./prijzen";
import { feestdagenBedrag } from "./feestdagen-producten";
import { whatsappLink } from "./bedrijf";

export const language = (locale: string) => locale === "de" ? 2 : locale === "en" ? 1 : 0;
export type CounterItem = {id:string; names: readonly string[]; rate:number | null};
export const fishCounter: CounterItem[] = [
  {id:"salmon",names:["Gerookte zalm","Smoked salmon","Räucherlachs"],rate:COUNTER_RATES.salmon},
  {id:"eel",names:["Gerookte paling","Smoked eel","Räucheraal"],rate:COUNTER_RATES.eel},
  {id:"shrimp",names:["Hollandse garnalen","Dutch shrimp","Nordseegarnelen"],rate:COUNTER_RATES.shrimp},
  {id:"mackerel",names:["Gerookte makreelfilet","Smoked mackerel fillet","Räuchermakrelenfilet"],rate:COUNTER_RATES.mackerel},
  {id:"gravlax",names:["Gravad lax met dille","Dill-cured gravlax","Graved Lachs mit Dill"],rate:Math.round(PRIJZEN["gravad-lax"].euro * 10)},
  {id:"belly",names:["Gerookte zalmbuikjes","Smoked salmon belly","Geräucherte Lachsbauchstreifen"],rate:COUNTER_RATES.belly},
];
export const saladCounter: CounterItem[] = [
  {id:"crab",names:["Krabsalade","Crab salad","Krabbensalat"],rate:SALAD_PORTION_CENTS},
  {id:"mango",names:["Krab-mangosalade","Crab and mango salad","Krabben-Mango-Salat"],rate:SALAD_PORTION_CENTS},
  {id:"wasabi",names:["Zalm-wasabisalade","Salmon and wasabi salad","Lachs-Wasabi-Salat"],rate:SALAD_PORTION_CENTS},
  {id:"tuna-salad",names:["Tonijnsalade","Tuna salad","Thunfischsalat"],rate:SALAD_PORTION_CENTS},
  {id:"spicy",names:["Pikante tonijnsalade","Spicy tuna salad","Pikanter Thunfischsalat"],rate:SALAD_PORTION_CENTS},
  {id:"herring",names:["Haring-mosterdsalade","Herring and mustard salad","Herings-Senf-Salat"],rate:250},
];
export const deluxeSalads: CounterItem[] = [{id:"house-salmon",names:["Huisgemaakte zalmsalade","House salmon salad","Hausgemachter Lachssalat"],rate:null}, ...saladCounter];
export const platterFish = [...fishCounter,
  {id:"tuna",names:["Tonijn","Tuna","Thunfisch"],rate:null},
  {id:"other",names:["Andere vissoort","Another fish","Andere Fischart"],rate:null}];
export type Values = Pick<URLSearchParams,"get"|"getAll">;
export const unit = (locale:string) => ["per 100 g","per 100 g","pro 100 g"][language(locale)];
export const byAgreement = (locale:string) => ["Prijs in overleg","Price on request","Preis auf Anfrage"][language(locale)];
export function weightQuote(data: Values, items: CounterItem[], locale:string, step = 1) {
  const selected = new Set(data.getAll("fish"));
  const lines: string[] = [];
  let cents = 0, grams = 0, unpriced = false;
  for (const item of items) {
    if (!selected.has(item.id)) continue;
    const raw = data.get("weight-" + item.id) ?? "100";
    const weight = Number(raw);
    if (!/^\d+$/.test(raw) || weight < step || weight > 100000 || weight % step !== 0) return null;
    const cost = item.rate === null ? null : Math.round(weight * item.rate / 100);
    const price = cost === null ? byAgreement(locale) : `${feestdagenBedrag(item.rate!,locale)} ${unit(locale)} · ${feestdagenBedrag(cost,locale)}`;
    lines.push(`${item.names[language(locale)]} · ${weight} g · ${price}`);
    cents += cost ?? 0;
    grams += weight;
    if (cost === null) unpriced = true;
  }
  return {lines,cents,grams,unpriced};
}

export type Assembly = "fish-trio" | "salad-trio" | "deluxe-salad" | "package" | "gift-trio" | "custom";
export function delicacyMode(slug:string): Assembly {
  if (slug === "zalmslaatje-de-luxe") return "deluxe-salad";
  return slug === "salade-trio" ? "salad-trio" : "fish-trio";
}
export function assemblyQuote(mode:Assembly, locale:string, data: Values) {
  const lang = language(locale), money = (v:number) => feestdagenBedrag(v,locale);
  const size = data.get("size") ?? "own";
  const fishTrio = mode === "fish-trio" || mode === "gift-trio";
  const salad = mode === "salad-trio" || mode === "deluxe-salad";
  const gift = mode === "package" || mode === "custom" || mode === "gift-trio";
  const extras = weightQuote(data,salad ? saladCounter : fishCounter,locale,fishTrio || salad ? 100 : 1);
  if (!extras) return null;
  const lines: string[] = [];
  let total = extras.cents;
  if (fishTrio || salad) {
    const items = mode === "deluxe-salad" ? deluxeSalads : salad ? saladCounter : fishCounter;
    const required = mode === "deluxe-salad" ? 1 : 3;
    const ids = Array.from({length:required},(_,i) => data.get("choice"+i));
    if (new Set(ids).size !== required) return null;
    const choices = ids.map(id => items.find(item => item.id === id));
    if (choices.some(item => !item)) return null;
    const base = mode === "salad-trio" ? 1199 : STANDARD_FISH_TRIO;
    lines.push(choices.map(item => item!.names[lang]).join(", ") + (fishTrio ? ` · 3 × ${TRIO_GRAMS[0]} g` : "") + " · " + money(base));
    total += base;
  } else if (mode === "package" && size !== "own") {
    if (!/^[012]$/.test(size)) return null;
    const contents = giftPackageContents(locale,Number(size))!;
    const base = packagePriceCents(Number(size))!;
    total += base;
    lines.push(giftRequestCopy(locale).sizes[Number(size)] + " · " + money(base), ...contents.lines);
  } else if (!extras.grams) return null;
  lines.push(...extras.lines);
  if (gift) {
    const box = data.get("box") === "yes";
    lines.push(box ? boxLabel(locale) + " · " + money(GIFT_BOX) : ["Zonder cadeaudoos","Without gift box","Ohne Geschenkbox"][lang]);
    if (box) total += GIFT_BOX;
    const raw = data.get("voucher")?.trim();
    if (raw) {
      const voucher = giftVoucherCents(raw);
      if (voucher === null) return null;
      total += voucher;
      lines.push(giftRequestCopy(locale).voucherLine + " · " + money(voucher));
    }
  }
  return {lines,total};
}
export const boxLabel = (locale:string) => ["Cadeaudoos","Gift box","Geschenkbox"][language(locale)];
export function assemblyLink(mode:Assembly,locale:string,product:string,data:Values) {
  const quote = assemblyQuote(mode,locale,data);
  if (!quote) return null;
  const t = giftRequestCopy(locale), wishes = data.get("wishes")?.trim().slice(0,700);
  return whatsappLink([t.greeting,product,...quote.lines,`${["Totaal","Total","Gesamt"][language(locale)]}: ${feestdagenBedrag(quote.total,locale)}`,
    ...(wishes ? [t.wishesLine + ": " + wishes] : []),t.note].join("\n"));
}
