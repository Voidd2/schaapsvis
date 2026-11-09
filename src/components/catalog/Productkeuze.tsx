"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { validPickupDate } from "@/lib/pickup-date";
import { usePickupToday } from "@/lib/use-pickup-date";
import { PLATTER_FAMILIES, selectedPlatter, platterDetailHref } from "@/lib/platter-families";
import { catalogText } from "@/lib/catalog-copy";
import { cartText } from "@/lib/cart-copy";
import { catalogProduct, languageIndex } from "@/lib/seafood-catalog";
import { feestdagenProduct, feestdagenBedrag } from "@/lib/feestdagen-producten";
import { requestMessage, requestTotal } from "@/lib/catalog-request";
import { useCatalogRequest, updateCatalogRequest } from "@/lib/catalog-request-store";
import { saladLine } from "@/lib/salad-extras";
import { whatsappLink } from "@/lib/bedrijf";

export function ProductQuantity({ slug, locale }: { slug: string; locale: string }) {
  const state = useCatalogRequest(), t = catalogText(locale), c = cartText(locale), line = state.items[slug];
  const product = feestdagenProduct(slug), salad = saladLine(slug);
  const name = product ? catalogProduct(slug, locale).naam : salad!.names[languageIndex(locale)];
  function set(quantity: number) { updateCatalogRequest(current => ({ ...current, items: { ...current.items, [slug]: { quantity } } })); }
  return <div className="request-product-controls" data-request-product={slug}>
    {!line ? <button type="button" className="request-add" disabled={!state.ready} onClick={() => set(1)} aria-label={`${c.add}: ${name}`}>+ {c.add}</button> : <div className="request-quantity" role="group" aria-label={`${t.qty}: ${name}`}>
      <span>{product?.categorie === "visschalen" ? t.fullPlatters : product?.eenheid === "per 100 gram" || salad?.cents != null ? t.grams : t.qty}</span>
      <button type="button" onClick={() => set(line.quantity - 1)} aria-label={`${t.less}: ${name}`}>−</button>
      <output aria-label={`${t.qty}: ${name}`}>{line.quantity}</output>
      <button type="button" disabled={line.quantity >= 99} onClick={() => set(line.quantity + 1)} aria-label={`${t.moreQty}: ${name}`}>+</button>
    </div>}
  </div>;
}

/** Old shared/bookmarked family selections remain navigable. */
export function LegacyCatalogSelection({ locale }: { locale: string }) {
  const params = useSearchParams(), choices = PLATTER_FAMILIES.filter(family => params.has(family));
  if (!choices.length) return null;
  return <nav className="catalog-legacy-selection" aria-label={catalogText(locale).back}>
    <strong>{locale === "en" ? "Previously selected sizes" : locale === "de" ? "Zuvor gewählte Größen" : "Eerder gekozen formaten"}</strong>
    {choices.map(family => { const product = selectedPlatter(family, params); return <Link key={family} href={platterDetailHref(locale, product.slug, params.toString())}>{catalogProduct(product.slug, locale).naam} →</Link>; })}
  </nav>;
}

/** The single shared panel content. Wishes stay in memory, never in page URLs/storage. */
export function RequestSummary({ locale, hasPreviousSelection }: { locale: string; hasPreviousSelection: boolean }) {
  const state = useCatalogRequest(), t = catalogText(locale), c = cartText(locale), total = requestTotal(state), entries = Object.entries(state.items);
  const today = usePickupToday();
  const dateOK = !state.date || (!!today && validPickupDate(state.date));
  const message = requestMessage(state, locale);
  return <div className="cart-content">
    {hasPreviousSelection && <p className="request-muted mb-5">{locale === "en" ? "You also have an earlier, separate selection." : locale === "de" ? "Sie haben auch eine frühere, separate Auswahl." : "U heeft ook een eerdere, afzonderlijke selectie."} <Link className="underline" href={`/${locale}/bestellen`}>{locale === "en" ? "Review it here" : locale === "de" ? "Hier ansehen" : "Bekijk die hier"} →</Link></p>}
    {!entries.length ? <p className="cart-empty">{t.empty}</p> : <>
      <ul className="cart-lines">{entries.map(([slug, line]) => {
        const product = feestdagenProduct(slug), localized = product ? catalogProduct(slug, locale) : null, salad = saladLine(slug);
        const cents = product?.prijsCents ?? salad?.cents;
        const name = localized?.naam ?? salad!.names[languageIndex(locale)];
        return <li key={slug} data-cart-line={slug}>
          <h3>{name}</h3>
          <p className="cart-unit">{product ? `${feestdagenBedrag(product.prijsCents, locale)} ${product.categorie === "visschalen" ? t.perPlatter : localized!.eenheid}` : salad?.cents != null ? `${feestdagenBedrag(salad.cents, locale)} / 100 g` : `${t.unknown} · ${t.containers}`}</p>
          <ProductQuantity slug={slug} locale={locale} />
          <div className="cart-line-bottom"><button type="button" className="cart-remove" aria-label={`${t.remove}: ${name}`} onClick={() => updateCatalogRequest(current => { const items = { ...current.items }; delete items[slug]; return { ...current, items }; })}>{t.remove}</button>
            <strong data-line-total>{cents != null ? feestdagenBedrag(cents * line.quantity, locale) : t.unknown}</strong></div>
        </li>;
      })}</ul>
      <label className="request-date">{t.date}<input type="date" min={today || undefined} aria-invalid={!dateOK} aria-describedby={!dateOK ? "pickup-error" : undefined} value={state.date} onChange={event => updateCatalogRequest(current => ({ ...current, date: event.target.value }))} /><small>{t.dateHint}</small></label>
      {!dateOK && <p id="pickup-error" role="alert" className="text-red-800 mt-3">{c.dateError}</p>}
      <label className="cart-wishes">{c.wishes}<textarea rows={3} maxLength={1000} value={state.wishes ?? ""} placeholder={c.placeholder} onChange={event => updateCatalogRequest(current => ({ ...current, wishes: event.target.value }))} /></label>
      {state.wishes?.trim() && <p className="request-muted">{c.wishNote}</p>}
      <div className="cart-checkout">
        <p className="request-total" aria-live="polite">{c.subtotal}: <strong>{feestdagenBedrag(total.cents, locale)}</strong></p>
        {total.incomplete && <p className="request-muted">{c.unconfirmed}</p>}
        {dateOK ? <a className="knop knop-navy cart-submit" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{c.request}</a> : <button disabled className="knop knop-navy cart-submit opacity-50">{c.request}</button>}
        <p className="request-muted">{c.note}</p>
        <details><summary>{c.preview}</summary><p className="request-draft" data-catalog-draft>{message}</p></details>
      </div>
    </>}
  </div>;
}
