import { calendarDate, validPickupDate } from "./pickup-date";
import { feestdagenProduct, feestdagenBedrag } from "./feestdagen-producten";
import { catalogProduct, SALAD_REQUESTS, languageIndex } from "./seafood-catalog";
import { catalogText } from "./catalog-copy";
import { cartText } from "./cart-copy";
export type RequestLine = { quantity: number };
export type CatalogRequest = { items: Record<string, RequestLine>; date: string; wishes?: string };
export function normalizeRequest(raw: unknown): CatalogRequest {
  const result: CatalogRequest = { items: {}, date: "" };
  if (!raw || typeof raw !== "object") return result;
  const value = raw as Partial<CatalogRequest>;
  if (value.items && typeof value.items === "object") for (const [slug, line] of Object.entries(value.items)) {
    if (!feestdagenProduct(slug) && !SALAD_REQUESTS.some(s => s.slug === slug)) continue;
    if (!line || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) continue;
    // Whitelist fields: legacy split flags are intentionally discarded.
    result.items[slug] = { quantity: line.quantity };
  }
  if (typeof value.date === "string" && calendarDate(value.date)) result.date = value.date;
  if (typeof value.wishes === "string" && value.wishes.trim()) result.wishes = value.wishes.slice(0, 1000);
  return result;
}
export function requestTotal(request: CatalogRequest) {
  const clean = normalizeRequest(request);
  let cents = 0, incomplete = !!clean.wishes?.trim();
  for (const [slug, line] of Object.entries(clean.items)) {
    const product = feestdagenProduct(slug);
    if (product) cents += product.prijsCents * line.quantity;
    else incomplete = true;
  }
  return { cents, incomplete };
}
export function requestMessage(request: CatalogRequest, locale: string) {
  const clean = normalizeRequest(request), t = catalogText(locale), c = cartText(locale), total = requestTotal(clean);
  const lines = Object.entries(clean.items).map(([slug, line]) => {
    const source = feestdagenProduct(slug);
    if (!source) { const salad = SALAD_REQUESTS.find(s => s.slug === slug)!; return `${line.quantity}× ${salad.names[languageIndex(locale)]} (${t.containers}) — ${t.unknown}`; }
    const product = catalogProduct(slug, locale);
    return `${line.quantity}× ${product.naam}\n${feestdagenBedrag(source.prijsCents, locale)} ${source.categorie === "visschalen" ? t.perPlatter : product.eenheid} = ${feestdagenBedrag(source.prijsCents * line.quantity, locale)}`;
  });
  const date = clean.date && validPickupDate(clean.date) ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", {dateStyle:"long",timeZone:"UTC"}).format(new Date(`${clean.date}T12:00:00Z`)) : c.undecided;
  return [c.greeting, ...lines, `${c.pickup}: ${date}`, ...(clean.wishes?.trim() ? [`${c.wishHeading}:\n${clean.wishes.trim()}`] : []), `${c.subtotal}: ${feestdagenBedrag(total.cents, locale)}`, ...(total.incomplete ? [c.unconfirmed] : []), c.ending].join("\n\n");
}
