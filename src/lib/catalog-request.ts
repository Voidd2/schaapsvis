import { cartOptions, selectionQuote, type CartSelection } from "./cart-selection";
import { calendarDate, validPickupDate } from "./pickup-date";
import { feestdagenProduct, feestdagenBedrag } from "./feestdagen-producten";
import { catalogProduct, languageIndex } from "./seafood-catalog";
import { catalogText } from "./catalog-copy";
import { cartText } from "./cart-copy";
import { saladLine } from "./salad-extras";
export type RequestLine = { quantity: number };
export type CatalogRequest = { items: Record<string, RequestLine>; reselect?: boolean; date: string; selections?: CartSelection[]; wishes?: string };
export function normalizeRequest(raw: unknown): CatalogRequest {
  const result: CatalogRequest = { items: {}, date: "" };
  if (!raw || typeof raw !== "object") return result;
  const value = raw as Partial<CatalogRequest>;
  if (value.reselect === true) result.reselect = true;
  if (value.items && typeof value.items === "object") for (const [slug, line] of Object.entries(value.items)) {
    const category = feestdagenProduct(slug)?.categorie;
    if (category === "visschalen" || category === "gourmet") { result.reselect = true; continue; }
    if (!feestdagenProduct(slug) && !saladLine(slug)) continue;
    if (!line || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) continue;
    // Whitelist fields: legacy split flags are intentionally discarded.
    result.items[slug] = { quantity: line.quantity };
  }
  if (Array.isArray(value.selections)) {
    const ids = new Set<string>();
    for (const entry of value.selections) {
      if (!entry || typeof entry.id !== "string" || !/^[a-zA-Z0-9-]{1,64}$/.test(entry.id) || ids.has(entry.id)) continue;
      if (typeof entry.options !== "string" || entry.options.length > 8000) continue;
      const options = cartOptions(new URLSearchParams(entry.options));
      if (!selectionQuote(new URLSearchParams(options), "nl")) { result.reselect = true; continue; }
      const note = typeof entry.note === "string" ? entry.note.trim().slice(0, 2400) : "";
      (result.selections ??= []).push({ id: entry.id, options, ...(note ? { note } : {}), ...(entry.needsNote ? { needsNote: true } : {}) });
      ids.add(entry.id);
    }
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
    const price = product?.prijsCents ?? saladLine(slug)?.cents;
    if (price != null) cents += price * line.quantity;
    else incomplete = true;
  }
  for (const line of clean.selections ?? []) {
    const quote = selectionQuote(new URLSearchParams(line.options), "nl")!;
    cents += quote.cents;
    incomplete ||= quote.incomplete || !!line.note || !!line.needsNote;
  }
  return { cents, incomplete };
}
export function requestMessage(request: CatalogRequest, locale: string) {
  const clean = normalizeRequest(request), t = catalogText(locale), c = cartText(locale), total = requestTotal(clean);
  const lines = Object.entries(clean.items).map(([slug, line]) => {
    const source = feestdagenProduct(slug);
    if (!source) {
      const salad = saladLine(slug)!;
      if (salad.cents !== null) return `${line.quantity} × 100 g ${salad.names[languageIndex(locale)]} · ${feestdagenBedrag(salad.cents * line.quantity, locale)}`;
      return `${line.quantity}× ${salad.names[languageIndex(locale)]} (${t.containers}) — ${t.unknown}`; }
    const product = catalogProduct(slug, locale);
    const amount = source.eenheid === "per 100 gram" ? `${line.quantity} × 100 g` : `${line.quantity}×`;
    return `${amount} ${product.naam}\n${feestdagenBedrag(source.prijsCents, locale)} ${source.categorie === "visschalen" ? t.perPlatter : product.eenheid} = ${feestdagenBedrag(source.prijsCents * line.quantity, locale)}`;
  });
  for (const line of clean.selections ?? []) {
    const quote = selectionQuote(new URLSearchParams(line.options), locale)!;
    lines.push([quote.title, ...quote.lines, ...(line.note ? [line.note] : []), (quote.incomplete ? c.subtotal : c.line) + ": " + feestdagenBedrag(quote.cents, locale)].join("\n"));
  }
  const date = clean.date && validPickupDate(clean.date) ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", {dateStyle:"long",timeZone:"UTC"}).format(new Date(`${clean.date}T12:00:00Z`)) : c.undecided;
  return [c.greeting, ...lines, `${c.pickup}: ${date}`, ...(clean.wishes?.trim() ? [`${c.wishHeading}:\n${clean.wishes.trim()}`] : []), `${c.subtotal}: ${feestdagenBedrag(total.cents, locale)}`, ...(total.incomplete ? [c.unconfirmed] : []), c.ending].join("\n\n");
}
