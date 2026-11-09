"use client";

import { productHref } from "@/lib/product-href";
import { useSearchParams } from "next/navigation";
import { useInteractive } from "@/lib/use-interactive";
import Link from "next/link";
import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import { Search, ArrowUpRight, MessageCircle, SlidersHorizontal } from "lucide-react";
import { useLocale } from "next-intl";
import type { Product, Categorie } from "@/lib/assortiment-data";
import { productPhoto } from "@/lib/product-beeld";
import { matchesQuery } from "@/lib/search";
import { bestelContact } from "@/lib/bestel-contact";
import { productAvailability } from "@/lib/product-availability";

const copy = {
  nl: {
    all: "Alles", search: "Welke vis zoekt u?", popular: "Favorieten eerst", az: "Naam A–Z", more: "Toon meer producten",
    detail: "Productinformatie", singular: "product", count: "producten", empty: "Geen producten gevonden. Probeer een andere zoekterm of vraag het ons via WhatsApp.",
    favorites: "Begin met onze favorieten", favoritesSub: "Een paar vertrouwde keuzes uit onze toonbank.",
    browse: "Het hele assortiment", browseSub: "Kijk rustig rond. Voor beschikbaarheid en uw wensen helpen we u graag via WhatsApp.", photoNote: "Bekijk per product de beschikbaarheid, voedingsinformatie en passende recepten.",
    categories: ["Verse vis", "Gerookte vis", "Schaal- & schelpdieren", "Vissalades", "Bereid & snacks", "Zeegroenten"],
  },
  en: {
    all: "All", search: "Which fish are you looking for?", popular: "Favourites first", az: "Name A–Z", more: "Show more products",
    detail: "Product information", singular: "product", count: "products", empty: "No products found. Try another search or ask us on WhatsApp.",
    favorites: "Start with our favourites", favoritesSub: "A few familiar favourites from our fish counter.",
    browse: "Explore our full range", browseSub: "Take a look around. Ask us on WhatsApp about availability and your wishes.", photoNote: "See availability, nutrition information and recipe ideas on each product page.",
    categories: ["Fresh fish", "Smoked fish", "Shellfish", "Fish salads", "Prepared & snacks", "Sea vegetables"],
  },
  de: {
    all: "Alle", search: "Welchen Fisch suchen Sie?", popular: "Favoriten zuerst", az: "Name A–Z", more: "Weitere Produkte anzeigen",
    detail: "Produktinformationen", singular: "Produkt", count: "Produkte", empty: "Keine Produkte gefunden. Versuchen Sie einen anderen Suchbegriff oder fragen Sie uns per WhatsApp.",
    favorites: "Unsere Favoriten entdecken", favoritesSub: "Einige bewährte Favoriten aus unserer Fischtheke.",
    browse: "Das gesamte Sortiment", browseSub: "Schauen Sie sich in Ruhe um. Fragen zu Verfügbarkeit und Wünschen beantworten wir gerne per WhatsApp.", photoNote: "Auf jeder Produktseite finden Sie Verfügbarkeit, Nährwertangaben und passende Rezeptideen.",
    categories: ["Frischer Fisch", "Räucherfisch", "Schalentiere", "Fischsalate", "Zubereitet & Snacks", "Meeresgemüse"],
  },
};

const categories: Categorie[] = ["verse-vis", "gerookte-vis", "schaal-schelp", "vissalades", "bereid", "zeegroenten"];
// The salmon is already the hero image at the top of this page. Keep the
// selection focused on other everyday counter favourites instead of showing
// salmon twice in the first viewport.
const featuredSlugs = ["kabeljauwfilet", "lekkerbek", "zeebaarsfilet", "creuse-oesters"];
const stapleSlugs = new Set(["varlaks-zalm", "kibbeling", "lekkerbek", "haring", "broodje-haring", "kabeljauwfilet", "zeebaarsfilet"]);

export function AssortimentFilter({ localized }: { localized: Product[] }) {
  const interactive = useInteractive();
  const locale = useLocale();
  const c = copy[locale as keyof typeof copy] ?? copy.nl;
  const params = useSearchParams();
  const requestedCategory = params.get("categorie") ?? "all";
  const category = categories.includes(requestedCategory as Categorie) ? requestedCategory : "all";
  const query = params.get("zoek") ?? "";
  const sort = params.get("sortering") === "az" ? "az" : "popular";
  const requestedCount = Number(params.get("aantal"));
  const visibleCount = Number.isSafeInteger(requestedCount) && requestedCount >= 14 ? Math.min(requestedCount, localized.length) : 14;
  // Next's native history integration updates useSearchParams without a server
  // round trip. Replace the current entry: typing must never fill Back history.
  function updateFilter(changes: Record<string, string>) {
    const next = new URL(window.location.href);
    for (const [key, value] of Object.entries(changes)) {
      if (!value || (key === "categorie" && value === "all") || (key === "sortering" && value === "popular") || (key === "aantal" && value === "14")) next.searchParams.delete(key);
      else next.searchParams.set(key, value);
    }
    window.history.replaceState(null, "", next.pathname + next.search + next.hash);
  }
  const found = localized.filter(p =>
    (category === "all" || p.categorie === category) && (!query || matchesQuery(p, query)));
  if (sort === "az") found.sort((a, b) => a.naam.localeCompare(b.naam, locale));
  const showFeatured = category === "all" && !query.trim() && sort === "popular";
  const featured = featuredSlugs.map(slug => localized.find(p => p.slug === slug)!);
  const rows = showFeatured ? found.filter(p => !featuredSlugs.includes(p.slug)) : found;
  const visibleRows = rows.slice(0, visibleCount);

  const moreParams = new URLSearchParams(params.toString());
  moreParams.set("aantal", String(Math.min(visibleCount + 18, rows.length)));
  return <div className="collection section-wrap">
    <section className="collection-browse" aria-labelledby="browse-title">
      <div className="collection-section-heading"><div><p className="kapitaal">{c.count}</p><h2 id="browse-title">{c.browse}</h2></div><p>{c.browseSub}</p></div>
      <div className="collection-tools">
        <label className="collection-search"><Search size={20} aria-hidden="true" /><span className="sr-only">{c.search}</span><input disabled={!interactive} type="search" placeholder={c.search} value={query} onChange={e => updateFilter({zoek:e.target.value, aantal:"14"})} /></label>
        <label className="collection-sort"><SlidersHorizontal size={17} aria-hidden="true" /><span className="sr-only">{c.popular}</span><select disabled={!interactive} value={sort} onChange={e => updateFilter({sortering:e.target.value, aantal:"14"})}><option value="popular">{c.popular}</option><option value="az">{c.az}</option></select></label>
      </div>
      <div className="collection-tabs" role="group" aria-label={c.browse}>{["all", ...categories].map((id, i) =>
        <button disabled={!interactive} key={id} onClick={() => updateFilter({categorie:id, aantal:"14"})} aria-pressed={category === id} className={category === id ? "active" : ""}>{i === 0 ? c.all : c.categories[i - 1]}</button>)}</div>
      <details className="product-directory"><summary>{locale === "de" ? "Alle Produkte nach Kategorie" : locale === "en" ? "All products by category" : "Alle producten per categorie"}</summary><div>{categories.map((cat,i)=><section key={cat}><h3>{c.categories[i]}</h3><ul>{localized.filter(p=>p.categorie===cat).map(p=><li key={p.slug}><Link prefetch={false} href={productHref(locale, p.slug)}>{p.naam}</Link></li>)}</ul></section>)}</div></details>
      <p className="collection-photo-note">{c.photoNote}</p>
      <p className="collection-count" role="status">{found.length} {found.length === 1 ? c.singular : c.count}</p>
    </section>

    {showFeatured && <section className="collection-favorites" aria-labelledby="favorites-title">
      <div className="collection-section-heading"><div><p className="kapitaal">{locale === "nl" ? "Schaap’s selectie" : locale === "de" ? "Schaap’s Auswahl" : "Schaap’s selection"}</p><h2 id="favorites-title">{c.favorites}</h2></div><p>{c.favoritesSub}</p></div>
      <div className="favorite-grid">{featured.map((p, i) => {
        const photo = productPhoto(p,locale)!;
        return <article key={p.slug} className="favorite-card">
          <Link href={productHref(locale, p.slug)} className="favorite-image">
            <Image src={photo.src} width={700} height={500} sizes="(max-width: 700px) 100vw, 33vw"
              alt={photo.alt} className={photo.editorial ? "editorial" : ""} />
            <span className="favorite-number">0{i + 1}</span>
          </Link>
          <div className="favorite-heading"><div><p>{c.categories[categories.indexOf(p.categorie)]}</p><h3><Link href={productHref(locale, p.slug)}>{p.naam}</Link></h3></div><ArrowUpRight size={22} aria-hidden="true" /></div>
          <p className="text-sm font-semibold mb-3">{productAvailability(p,locale).label}</p>
          {p.slug === "creuse-oesters" && <a href={bestelContact(locale, p.naam).href} className="collection-whatsapp"><MessageCircle size={16} aria-hidden="true" />{locale === "nl" ? "Grotere bestelling? App ons" : locale === "de" ? "Größere Bestellung? Schreiben Sie uns" : "Larger order? Message us"}</a>}
        </article>;
      })}</div>
    </section>}

    <section className="collection-results" aria-label={c.browse}>
      <div id="collection-results-list" className="collection-list">{visibleRows.map(p => {
        const photo = productPhoto(p,locale);
        const stock = productAvailability(p,locale);
        const platter = ["visschaal", "feestschotel"].includes(p.slug);
        return <article id={`product-${p.slug}`} key={p.slug} className="collection-item">
          <div className="collection-item-main">
            {photo && <Link href={productHref(locale, p.slug)} tabIndex={-1} className="collection-thumb"><Image src={photo.src} alt={photo.alt} width={800} height={570} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 45vw, 30vw" className={`${photo.editorial ? "editorial" : ""} ${photo.whole ? "whole-product" : ""}`} /></Link>}
            <div className="collection-item-copy"><p className="collection-category">{c.categories[categories.indexOf(p.categorie)]}</p><h3><Link href={productHref(locale, p.slug)}>{p.naam}</Link></h3><p className="collection-description">{p.desc}</p></div>
          </div>
          <div className={`collection-item-stock mt-3 mb-3 text-sm leading-relaxed ${stock.unavailable?"text-rose-700":"text-slate-700"}`} data-stock={p.beschikbaar}>
            <p className="font-semibold">{stock.label}</p>
          </div>
          <div className="collection-item-actions">
            <Link href={productHref(locale, p.slug)}>{c.detail}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            {platter ? <Link href={`/${locale}/visschalen`}>{locale === "nl" ? "Visschaal samenstellen" : locale === "de" ? "Fischplatte zusammenstellen" : "Create a seafood platter"}</Link>
              : (p.slug === "creuse-oesters" || p.slug === "fine-de-claire-oesters")
                ? <a href={bestelContact(locale, p.naam).href} className="collection-whatsapp"><MessageCircle size={15} aria-hidden="true" />{locale === "nl" ? "Grotere bestelling? App ons" : locale === "de" ? "Größere Bestellung? Schreiben Sie uns" : "Larger order? Message us"}</a>
                : !stapleSlugs.has(p.slug) && !["always", "dagelijks"].includes(p.beschikbaar ?? "")
                  ? <a href={bestelContact(locale, p.naam).href} className="collection-whatsapp"><MessageCircle size={15} aria-hidden="true" />{bestelContact(locale).label}</a>
                  : null}
          </div>
        </article>;
      })}</div>
      {rows.length > visibleRows.length && <a className="collection-load-more" href={`/${locale}/assortiment?${moreParams}#product-${rows[visibleRows.length].slug}`}>{c.more} ↓</a>}
      {!found.length && <div className="collection-empty"><p>{c.empty}</p><a className="knop knop-rood" href={bestelContact(locale).href}>{bestelContact(locale).label}</a></div>}
    </section>
  </div>;
}

