"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PLATTER_FAMILIES, selectedPlatter, platterDetailHref } from "@/lib/platter-families";
import { catalogText } from "@/lib/catalog-copy";
import { catalogProduct, SALAD_REQUESTS, languageIndex } from "@/lib/seafood-catalog";
import { feestdagenProduct, feestdagenBedrag } from "@/lib/feestdagen-producten";
import { requestMessage, requestTotal, supportsSplit } from "@/lib/catalog-request";
import { useCatalogRequest, updateCatalogRequest } from "@/lib/catalog-request-store";
import { whatsappLink } from "@/lib/bedrijf";

export function ProductQuantity({ slug, locale }: { slug: string; locale: string }) {
  const state = useCatalogRequest(), t = catalogText(locale), line = state.items[slug];
  const product = feestdagenProduct(slug), salad = SALAD_REQUESTS.find(s => s.slug === slug);
  const name = product ? catalogProduct(slug, locale).naam : salad!.names[languageIndex(locale)];
  function set(quantity: number) { updateCatalogRequest(current => ({ ...current, items: { ...current.items, [slug]: { quantity, split: current.items[slug]?.split ?? false } } })); }
  return <div className="request-product-controls" data-request-product={slug}>
    {!line ? <button type="button" className="request-add" disabled={!state.ready} onClick={() => set(1)} aria-label={`${product ? t.add : t.addWish}: ${name}`}>+ {product ? t.add : t.addWish}</button> : <>
      <div className="request-quantity" role="group" aria-label={`${t.qty}: ${name}`}>
        <span>{product?.categorie === "visschalen" ? t.fullPlatters : t.qty}</span>
        <button type="button" onClick={() => set(line.quantity - 1)} aria-label={`${t.less}: ${name}`}>−</button>
        <output aria-label={`${t.qty}: ${name}`}>{line.quantity}</output>
        <button type="button" disabled={line.quantity >= 99} onClick={() => set(line.quantity + 1)} aria-label={`${t.moreQty}: ${name}`}>+</button>
      </div>
      <p className="request-line-total">{product ? `${t.total}: ${feestdagenBedrag(product.prijsCents * line.quantity, locale)}` : t.unknown}</p>
    </>}
  </div>;
}

export function RequestListLink({ locale }: { locale: string }) {
  const state = useCatalogRequest(), t = catalogText(locale);
  const count = Object.values(state.items).reduce((n, line) => n + line.quantity, 0);
  return <a className="catalog-list-link" href="#aanvraag">{t.listLink}{count ? ` (${count})` : ""} ↓</a>;
}

/** Old shared/bookmarked family selections stay visible without altering the new request list. */
export function LegacyCatalogSelection({ locale }: { locale: string }) {
  const params = useSearchParams(), choices = PLATTER_FAMILIES.filter(family => params.has(family));
  if (!choices.length) return null;
  return <nav className="catalog-legacy-selection" aria-label={catalogText(locale).back}>
    <strong>{locale === "en" ? "Previously selected sizes" : locale === "de" ? "Zuvor gewählte Größen" : "Eerder gekozen formaten"}</strong>
    {choices.map(family => { const product = selectedPlatter(family, params); return <Link key={family} href={platterDetailHref(locale, product.slug, params.toString())}>{catalogProduct(product.slug, locale).naam} →</Link>; })}
  </nav>;
}

export function RequestSummary({ locale }: { locale: string }) {
  const state = useCatalogRequest(), t = catalogText(locale), total = requestTotal(state), entries = Object.entries(state.items);
  const message = requestMessage(state, locale);
  return <section id="aanvraag" className="catalog-request-summary" aria-labelledby="request-title">
    <div className="catalog-heading"><h2 id="request-title">{t.list}</h2><p>{t.keep}</p></div>
    {!entries.length ? <p>{t.empty}</p> : <>
      <ul className="request-lines">{entries.map(([slug, line]) => {
        const product = feestdagenProduct(slug), salad = SALAD_REQUESTS.find(s => s.slug === slug);
        return <li key={slug}>
          <div><h3>{product ? catalogProduct(slug, locale).naam : salad!.names[languageIndex(locale)]}</h3>
            {salad && <p className="request-muted">{t.containers} · {t.unknown}</p>}
            <ProductQuantity slug={slug} locale={locale} />
          </div>
          {supportsSplit(slug) && <label className="request-split"><input type="checkbox" checked={line.split} onChange={event => updateCatalogRequest(current => ({ ...current, items: { ...current.items, [slug]: { ...current.items[slug], split: event.target.checked } } }))} /> <span>{t.split}<small>{t.splitNote}</small></span></label>}
        </li>;
      })}</ul>
      <p className="request-muted mt-4">{t.fullNote}</p>
      <p className="request-total" aria-live="polite">{total.incomplete ? t.subtotal : t.total}: <strong>{feestdagenBedrag(total.cents, locale)}</strong></p>
      {total.incomplete && <p className="request-muted">{t.extrasNote}</p>}
      <label className="request-date">{t.date}<input type="date" value={state.date} onChange={event => updateCatalogRequest(current => ({ ...current, date: event.target.value }))} /><small>{t.dateHint}</small></label>
      <a className="knop knop-navy mt-5" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a>
      <p className="request-muted mt-3">{t.note}</p>
      <details className="mt-4"><summary>{t.draft}</summary><p className="request-draft" data-catalog-draft>{message}</p></details>
    </>}
  </section>;
}

export function CatalogBackLink({ locale, origin }: { locale: string; origin: string }) {
  const target = origin === "feestdagen" ? "feestdagen" : "visschalen";
  return <Link className="platter-back-link" href={`/${locale}/${target}#aanvraag`}>← {catalogText(locale).back}</Link>;
}
