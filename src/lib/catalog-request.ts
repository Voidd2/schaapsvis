import { calendarDate, validPickupDate } from "./pickup-date";
import { feestdagenProduct, feestdagenBedrag } from "./feestdagen-producten";
import { catalogProduct, SALAD_REQUESTS, languageIndex } from "./seafood-catalog";
import { platterSizeLabel } from "./platter-families";
import { catalogText } from "./catalog-copy";

export type RequestLine = { quantity: number; split: boolean };
export type CatalogRequest = { items: Record<string, RequestLine>; date: string };
export function supportsSplit(slug: string) { return feestdagenProduct(slug)?.categorie === "visschalen" && Number(slug.match(/-(\d+)-pers$/)?.[1]) >= 5; }
export function normalizeRequest(raw: unknown): CatalogRequest {
  const result: CatalogRequest = { items: {}, date: "" };
  if (!raw || typeof raw !== "object") return result;
  const value = raw as Partial<CatalogRequest>;
  if (value.items && typeof value.items === "object") for (const [slug, line] of Object.entries(value.items)) {
    if (!feestdagenProduct(slug) && !SALAD_REQUESTS.some(s => s.slug === slug)) continue;
    if (!line || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) continue;
    result.items[slug] = { quantity: line.quantity, split: line.split === true && supportsSplit(slug) };
  }
  if (typeof value.date === "string" && calendarDate(value.date)) result.date = value.date;
  return result;
}
export function requestTotal(request: CatalogRequest) {
  let cents = 0, incomplete = false;
  for (const [slug, line] of Object.entries(normalizeRequest(request).items)) {
    const product = feestdagenProduct(slug);
    if (product) cents += product.prijsCents * line.quantity;
    else incomplete = true;
    if (line.split) incomplete = true;
  }
  return { cents, incomplete };
}
export function requestMessage(request: CatalogRequest, locale: string) {
  const clean = normalizeRequest(request), t = catalogText(locale), total = requestTotal(clean);
  const lines = Object.entries(clean.items).map(([slug, line]) => {
    const source = feestdagenProduct(slug);
    if (!source) { const salad = SALAD_REQUESTS.find(s => s.slug === slug)!; return `${line.quantity} × ${salad.names[languageIndex(locale)]} (${t.containers}) — ${t.unknown}`; }
    const product = catalogProduct(slug, locale);
    return `${product.naam}\n${source.categorie === "visschalen" ? `${platterSizeLabel(slug, locale)} ${t.perPlatter}\n${t.fullPlatters}` : `${t.qty} (${source.eenheid === "per 100 gram" ? t.grams : product.eenheid})`}: ${line.quantity}\n${feestdagenBedrag(source.prijsCents, locale)} × ${line.quantity} = ${feestdagenBedrag(source.prijsCents * line.quantity, locale)}${line.split ? `\n${t.split}. ${t.splitNote}` : ""}`;
  });
  return [t.greeting, ...lines, `${total.incomplete ? t.subtotal : t.total}: ${feestdagenBedrag(total.cents, locale)}`, ...(total.incomplete ? [t.extrasNote] : []), ...(clean.date && validPickupDate(clean.date) ? [`${t.date}: ${new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", {dateStyle:"long",timeZone:"UTC"}).format(new Date(`${clean.date}T12:00:00Z`))}`] : [t.pickup]), t.note].join("\n\n");
}
