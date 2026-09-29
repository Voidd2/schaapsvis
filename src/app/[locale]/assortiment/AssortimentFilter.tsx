"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, MessageCircle, SlidersHorizontal } from "lucide-react";
import { useLocale } from "next-intl";
import type { Product, Categorie } from "@/lib/assortiment-data";
import { productPhoto } from "@/lib/product-beeld";
import { ProductPhotoCredit } from "@/components/ProductPhotoCredit";
import { matchesQuery } from "@/lib/search";
import { bestelContact } from "@/lib/bestel-contact";
import { productAvailability } from "@/lib/product-availability";

const copy = {
  nl: {
    all: "Alles", search: "Welke vis zoekt u?", popular: "Favorieten eerst", az: "Naam A–Z",
    detail: "Productinformatie", count: "producten", empty: "Niets gevonden? Vraag het ons gerust via WhatsApp.",
    favorites: "Begin met onze favorieten", favoritesSub: "Een paar vertrouwde keuzes uit onze toonbank.",
    browse: "Het hele assortiment", browseSub: "Kijk rustig rond. Voor beschikbaarheid en uw wensen helpen we u graag via WhatsApp.", photoNote: "Foto’s zijn voorbeelden. De vis, bereiding en presentatie bij ons kunnen afwijken.",
    categories: ["Verse vis", "Gerookte vis", "Schaal- & schelpdieren", "Vissalades", "Bereid & snacks", "Zeegroenten"],
  },
  en: {
    all: "All", search: "Which fish are you looking for?", popular: "Favourites first", az: "Name A–Z",
    detail: "Product information", count: "products", empty: "Can't find it? Ask us on WhatsApp.",
    favorites: "Start with our favourites", favoritesSub: "A few familiar favourites from our fish counter.",
    browse: "Explore our full range", browseSub: "Take a look around. Ask us on WhatsApp about availability and your wishes.", photoNote: "Photos are examples. The fish, preparation and presentation in our shop may differ.",
    categories: ["Fresh fish", "Smoked fish", "Shellfish", "Fish salads", "Prepared & snacks", "Sea vegetables"],
  },
  de: {
    all: "Alle", search: "Welchen Fisch suchen Sie?", popular: "Favoriten zuerst", az: "Name A–Z",
    detail: "Produktinformationen", count: "Produkte", empty: "Nicht gefunden? Fragen Sie uns per WhatsApp.",
    favorites: "Unsere Favoriten entdecken", favoritesSub: "Einige bewährte Favoriten aus unserer Fischtheke.",
    browse: "Das gesamte Sortiment", browseSub: "Schauen Sie sich in Ruhe um. Fragen zu Verfügbarkeit und Wünschen beantworten wir gerne per WhatsApp.", photoNote: "Die Fotos sind Beispiele. Fisch, Zubereitung und Präsentation bei uns können abweichen.",
    categories: ["Frischer Fisch", "Räucherfisch", "Schalentiere", "Fischsalate", "Zubereitet & Snacks", "Meeresgemüse"],
  },
};

const categories: Categorie[] = ["verse-vis", "gerookte-vis", "schaal-schelp", "vissalades", "bereid", "zeegroenten"];
const featuredSlugs = ["varlaks-zalm", "kibbeling", "haring"];

export function AssortimentFilter({ localized }: { localized: Product[] }) {
  const locale = useLocale();
  const c = copy[locale as keyof typeof copy] ?? copy.nl;
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const found = localized.filter(p =>
    (category === "all" || p.categorie === category) && (!query || matchesQuery(p, query)));
  if (sort === "az") found.sort((a, b) => a.naam.localeCompare(b.naam, locale));
  const showFeatured = category === "all" && !query.trim() && sort === "popular";
  const featured = featuredSlugs.map(slug => localized.find(p => p.slug === slug)!);
  const rows = showFeatured ? found.filter(p => !featuredSlugs.includes(p.slug)) : found;

  return <div className="collection section-wrap">
    {showFeatured && <section className="collection-favorites" aria-labelledby="favorites-title">
      <div className="collection-section-heading"><div><p className="kapitaal">{locale === "nl" ? "Schaap’s selectie" : locale === "de" ? "Schaap’s Auswahl" : "Schaap’s selection"}</p><h2 id="favorites-title">{c.favorites}</h2></div><p>{c.favoritesSub}</p></div>
      <div className="favorite-grid">{featured.map((p, i) => {
        const photo = productPhoto(p,locale)!;
        return <article key={p.slug} className="favorite-card">
          <Link href={`/${locale}/assortiment/${p.slug}`} className="favorite-image">
            <Image src={photo.src} width={700} height={500} sizes="(max-width: 700px) 100vw, 33vw"
              alt={photo.alt} className={photo.editorial ? "editorial" : ""} />
            <span className="favorite-number">0{i + 1}</span>
          </Link>
          <div className="favorite-heading"><div><p>{c.categories[categories.indexOf(p.categorie)]}</p><h3><Link href={`/${locale}/assortiment/${p.slug}`}>{p.naam}</Link></h3></div><ArrowUpRight size={22} aria-hidden="true" /></div>
          <p className="text-sm font-semibold mb-3">{productAvailability(p,locale).label}</p>
          <a href={bestelContact(locale, p.naam).href} className="collection-whatsapp"><MessageCircle size={16} aria-hidden="true" />{bestelContact(locale).label}</a>
        </article>;
      })}</div>
    </section>}

    <section className="collection-browse" aria-labelledby="browse-title">
      <div className="collection-section-heading"><div><p className="kapitaal">{c.count}</p><h2 id="browse-title">{c.browse}</h2></div><p>{c.browseSub}</p></div>
      <div className="collection-tools">
        <label className="collection-search"><Search size={20} aria-hidden="true" /><span className="sr-only">{c.search}</span><input type="search" placeholder={c.search} value={query} onChange={e => setQuery(e.target.value)} /></label>
        <label className="collection-sort"><SlidersHorizontal size={17} aria-hidden="true" /><span className="sr-only">{c.popular}</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="popular">{c.popular}</option><option value="az">{c.az}</option></select></label>
      </div>
      <div className="collection-tabs" role="group" aria-label={c.browse}>{["all", ...categories].map((id, i) =>
        <button key={id} onClick={() => setCategory(id)} aria-pressed={category === id} className={category === id ? "active" : ""}>{i === 0 ? c.all : c.categories[i - 1]}</button>)}</div>
      <p className="collection-photo-note">{c.photoNote}</p>
      <p className="collection-count" role="status">{found.length} {c.count}</p>
      <div className="collection-list">{rows.map(p => {
        const photo = productPhoto(p,locale);
        const stock = productAvailability(p,locale);
        const platter = ["visschaal", "feestschotel"].includes(p.slug);
        return <article key={p.slug} className="collection-item">
          <div className="collection-item-main">
            {photo && <Link href={`/${locale}/assortiment/${p.slug}`} tabIndex={-1} className="collection-thumb"><Image src={photo.src} alt={photo.alt} width={800} height={570} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 45vw, 30vw" className={`${photo.editorial ? "editorial" : ""} ${photo.whole ? "whole-product" : ""}`} /></Link>}
            <div className="collection-item-copy"><p className="collection-category">{c.categories[categories.indexOf(p.categorie)]}</p><h3><Link href={`/${locale}/assortiment/${p.slug}`}>{p.naam}</Link></h3><p className="collection-description">{p.desc}</p></div>
          </div>
          <div className={`collection-item-stock mt-3 mb-3 text-sm leading-relaxed ${stock.unavailable?"text-rose-700":"text-slate-700"}`} data-stock={p.beschikbaar}>
            <p className="font-semibold">{stock.label}</p><p className="mt-1">{stock.note}</p>
          </div>
          {photo?.credit && <div className="collection-item-credit"><ProductPhotoCredit photo={photo} locale={locale} /></div>}
          <div className="collection-item-actions">
            <Link href={`/${locale}/assortiment/${p.slug}`}>{c.detail}<ArrowUpRight size={14} aria-hidden="true" /></Link>
            {platter ? <Link href={`/${locale}/visschalen`}>{locale === "nl" ? "Visschaal samenstellen" : locale === "de" ? "Fischplatte zusammenstellen" : "Create a seafood platter"}</Link>
              : <a href={bestelContact(locale, p.naam).href} className="collection-whatsapp"><MessageCircle size={15} aria-hidden="true" />{bestelContact(locale).label}</a>}
          </div>
        </article>;
      })}</div>
      {!found.length && <div className="collection-empty"><p>{c.empty}</p><a className="knop knop-rood" href={bestelContact(locale).href}>{bestelContact(locale).label}</a></div>}
    </section>
  </div>;
}
