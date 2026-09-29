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

const copy = {
  nl: {
    all: "Alles", search: "Welke vis zoekt u?", popular: "Favorieten eerst", az: "Naam A–Z",
    detail: "Productinformatie", count: "producten", empty: "Niets gevonden? Vraag het ons gerust via WhatsApp.",
    favorites: "Begin met onze favorieten", favoritesSub: "Een paar vertrouwde keuzes uit onze toonbank.",
    browse: "Het hele assortiment", browseSub: "Kijk rustig rond. Voor beschikbaarheid en uw wensen helpen we u graag via WhatsApp.",
    categories: ["Verse vis", "Gerookte vis", "Schaal- & schelpdieren", "Vissalades", "Bereid & snacks"],
  },
  en: {
    all: "All", search: "Which fish are you looking for?", popular: "Favourites first", az: "Name A–Z",
    detail: "Product information", count: "products", empty: "Can't find it? Ask us on WhatsApp.",
    favorites: "Start with our favourites", favoritesSub: "A few familiar favourites from our fish counter.",
    browse: "Explore our full range", browseSub: "Take a look around. Ask us on WhatsApp about availability and your wishes.",
    categories: ["Fresh fish", "Smoked fish", "Shellfish", "Fish salads", "Prepared & snacks"],
  },
  de: {
    all: "Alle", search: "Welchen Fisch suchen Sie?", popular: "Favoriten zuerst", az: "Name A–Z",
    detail: "Produktinformationen", count: "Produkte", empty: "Nicht gefunden? Fragen Sie uns per WhatsApp.",
    favorites: "Unsere Favoriten entdecken", favoritesSub: "Einige bewährte Favoriten aus unserer Fischtheke.",
    browse: "Das gesamte Sortiment", browseSub: "Schauen Sie sich in Ruhe um. Fragen zu Verfügbarkeit und Wünschen beantworten wir gerne per WhatsApp.",
    categories: ["Frischer Fisch", "Räucherfisch", "Schalentiere", "Fischsalate", "Zubereitet & Snacks"],
  },
};

const categories: Categorie[] = ["verse-vis", "gerookte-vis", "schaal-schelp", "vissalades", "bereid"];
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
      <p className="collection-count" role="status">{found.length} {c.count}</p>
      <div className="collection-list">{rows.map(p => {
        const photo = productPhoto(p,locale);
        const platter = ["visschaal", "feestschotel"].includes(p.slug);
        return <article key={p.slug} className="collection-item">
          <div className="collection-item-main">
            <div><p className="collection-category">{c.categories[categories.indexOf(p.categorie)]}</p><h3><Link href={`/${locale}/assortiment/${p.slug}`}>{p.naam}</Link></h3><p className="collection-description">{p.desc}</p></div>
            {photo && <Link href={`/${locale}/assortiment/${p.slug}`} tabIndex={-1} className="collection-thumb"><Image src={photo.src} alt={photo.alt} width={600} height={450} sizes="(max-width: 600px) calc(100vw - 40px), 210px" className={`${photo.editorial ? "editorial" : ""} ${photo.whole ? "whole-product" : ""}`} /></Link>}
          </div>
          <ProductPhotoCredit photo={photo} locale={locale} />
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
