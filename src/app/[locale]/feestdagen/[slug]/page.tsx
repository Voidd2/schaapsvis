import { PlatterPhotoNote } from "@/components/PlatterPhotoNote";
import { platterPhotoAlt, platterPresentation, platterPrice } from "@/lib/platter-presentation";
import { Suspense } from "react";
import { connection } from "next/server";
import { PlatterNavigation } from "@/components/PlatterNavigation";
import { platterFamily, platterLabels, platterOverviewHref, platterDetailHref } from "@/lib/platter-families";
import { catalogProduct } from "@/lib/seafood-catalog";
import { ProductQuantity, RequestSummary, CatalogBackLink } from "@/components/catalog/RequestControls";
import { catalogText } from "@/lib/catalog-copy";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie } from "@/components/ui/Sectie";
import { BEDRIJF } from "@/lib/bedrijf";
import {
  FEESTDAGEN_PRODUCTEN,
  feestdagenProduct,
  gerelateerdeFeestdagenProducten,
} from "@/lib/feestdagen-producten";
import { kruimelSchema, paginaMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const LABELS = {
  nl: {
    home: "Home", selection: "Schaap’s selectie", season: "Feestdagen", price: "Prijs", order: "Vraag of bestel via WhatsApp",
    contents: "Samenstelling", ingredients: "Ingrediënten & allergenen", allergens: "Bevat de volgende allergenen",
    important: "Belangrijk bij allergieën", disclaimer: "Samenstelling en productetiketten kunnen wijzigen. Meld allergieën altijd bij uw aanvraag; de actuele productinformatie in de winkel is leidend.",
    related: "Gerelateerde producten", relatedIntro: "Meer feestelijke keuzes uit dezelfde selectie.", view: "Bekijk product",
    note: "Beschikbaarheid en afhaalmoment bevestigen we persoonlijk. De getoonde prijs hoort bij de genoemde uitvoering.",
  },
  en: {
    home: "Home", selection: "Schaap’s selection", season: "Festive season", price: "Price", order: "Ask or order on WhatsApp",
    contents: "Contents", ingredients: "Ingredients & allergens", allergens: "Contains the following allergens",
    important: "Important for allergies", disclaimer: "Contents and labels may change. Always mention allergies in your request; the current product information in store is decisive.",
    related: "Related products", relatedIntro: "More festive choices from this selection.", view: "View product",
    note: "We confirm availability and collection personally. The displayed price applies to the stated version.",
  },
  de: {
    home: "Startseite", selection: "Schaap’s Auswahl", season: "Festtage", price: "Preis", order: "Per WhatsApp anfragen oder bestellen",
    contents: "Zusammenstellung", ingredients: "Zutaten & Allergene", allergens: "Enthält folgende Allergene",
    important: "Wichtig bei Allergien", disclaimer: "Zusammenstellung und Etiketten können sich ändern. Bitte Allergien immer bei der Anfrage nennen; die aktuellen Produktinformationen im Geschäft sind maßgeblich.",
    related: "Ähnliche Produkte", relatedIntro: "Weitere festliche Produkte aus dieser Auswahl.", view: "Produkt ansehen",
    note: "Verfügbarkeit und Abholzeit bestätigen wir persönlich. Der angezeigte Preis gilt für die genannte Ausführung.",
  },
} as const;

export function generateStaticParams() {
  return ["nl", "en", "de"].flatMap((locale) => FEESTDAGEN_PRODUCTEN.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const source = feestdagenProduct(slug);
  if (!source) notFound();
  const product = catalogProduct(source.slug, locale);
  return paginaMetadata({
    locale,
    pad: `/feestdagen/${product.slug}`,
    title: `${product.naam} | Schaap’s Vishandel Leiden`,
    description: product.intro,
    image: product.afbeelding,
  });
}

export default async function FeestdagenProductPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const source = feestdagenProduct(slug);
  if (!source) notFound();
  const product = catalogProduct(source.slug, locale);
  const taal = locale === "en" || locale === "de" ? locale : "nl";
  const t = LABELS[taal];
  const family = platterFamily(slug);
  const note = family ? platterPresentation(locale).confirmation : t.note;
  // Render incoming selection context on the server too: the back link must
  // retain other families even before this page's JavaScript has loaded.
  const incoming = await searchParams;
  const origin = incoming.catalog === "feestdagen" ? "feestdagen" : incoming.catalog === "visschalen" ? "visschalen" : null;
  const selection = new URLSearchParams();
  if (family) {
    await connection();
    for (const [key, value] of Object.entries(incoming)) {
      for (const entry of Array.isArray(value) ? value : value === undefined ? [] : [value]) selection.append(key, entry);
    }
  }
  const related = gerelateerdeFeestdagenProducten(source).map(item => catalogProduct(item.slug, locale));
  const url = `${BEDRIJF.domein}/${locale}/feestdagen/${product.slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.naam,
    description: product.intro,
    image: `${BEDRIJF.domein}${product.afbeelding}`,
    url,
    brand: { "@type": "Brand", name: BEDRIJF.naam },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.prijsCents / 100).toFixed(2),
      availability: "https://schema.org/LimitedAvailability",
      url,
    },
  };

  return <>
    <JsonLd locale={locale} />
    <Schema data={[productSchema, kruimelSchema(locale, [
      { naam: t.home, pad: "/" },
      { naam: t.season, pad: "/feestdagen" },
      { naam: product.naam, pad: `/feestdagen/${product.slug}` },
    ])]} />

    {origin && <div className="section-wrap pt-6"><CatalogBackLink locale={locale} origin={origin} /></div>}
    {family && !origin && <div className="section-wrap pt-6"><Suspense fallback={<Link className="platter-back-link" href={platterOverviewHref(locale, slug, selection.toString())}>{platterLabels[taal].back}</Link>}><PlatterNavigation locale={taal} slug={slug} mode="back" /></Suspense></div>}
    <section className="bg-[#f7f3ec]">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 py-8 md:px-8 md:py-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
        <figure><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm">
          <Image src={product.afbeelding} alt={platterPhotoAlt(product, locale)} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className={family ? "object-contain" : "object-cover"} />
        </div>{family && <figcaption className="mt-3"><PlatterPhotoNote locale={locale} /></figcaption>}</figure>
        <div className="flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#527080]">
            <Link href={`/${locale}`}>{t.home}</Link> <span aria-hidden="true">/</span> <Link href={`/${locale}/feestdagen`}>{t.season}</Link>
          </nav>
          <p className="kapitaal mb-3">{t.season} · {t.selection}</p>
          <h1 className="text-[2.4rem] leading-[1.04] sm:text-[3.4rem]">{product.naam}</h1>
          <p className="mt-5 max-w-xl text-[1.08rem] leading-8 text-[#38515e]">{product.intro}</p>
          <div className="mt-7 border-y border-[#bfd6df] py-5">
            <p className="text-xs font-bold uppercase tracking-[.17em] text-[#527080]">{t.price}</p>
            <p className="mt-1 text-2xl font-bold text-[#a61f2b]">{platterPrice(product, locale)}</p>
          </div>
          {family && <Suspense fallback={null}><PlatterNavigation locale={taal} slug={slug} mode="size" /></Suspense>}
          <p className="mt-5 text-sm leading-6 text-[#527080]">{note}</p>
          {family && <Link className="mt-4 underline underline-offset-4" href={platterOverviewHref(locale, slug, selection.toString()).replace(/#.*$/, "#maatwerk")}>{platterPresentation(locale).custom}</Link>}
          <ProductQuantity key={slug} slug={slug} locale={locale} />
          <a href="#aanvraag" className="knop knop-rood mt-7 w-full sm:w-fit">{catalogText(locale).listLink} ↓</a>
        </div>
      </div>
    </section>

    <div className="section-wrap py-8"><RequestSummary locale={locale} /></div>
    <Sectie grond="papier">
      <div className="grid gap-10 lg:grid-cols-[1fr_.85fr] lg:gap-16">
        <div>
          <Kop label={t.ingredients} titel={t.contents} />
          <ul className="divide-y divide-[#d9e7ee] border-y border-[#d9e7ee]">
            {product.samenstelling.map((item) => <li key={item} className="flex gap-3 py-3.5 text-[#38515e]"><span aria-hidden="true" className="text-[#0a83ad]">✓</span>{item}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {product.besteltermijn && <span className="rounded-full bg-[#eaf7fc] px-4 py-2 text-sm font-semibold text-[#075b82]">{product.besteltermijn}</span>}
            {product.formaat && <span className="rounded-full bg-[#f7f3ec] px-4 py-2 text-sm font-semibold text-[#664d2f]">{product.formaat}</span>}
          </div>
        </div>
        <aside className="rounded-2xl bg-[#063f59] p-6 text-white sm:p-8">
          <p className="kapitaal kapitaal-licht mb-3">{t.ingredients}</p>
          <h2 className="text-2xl text-white">{t.allergens}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.allergenen.map((item) => <li key={item} className="rounded-full border border-white/35 bg-white/10 px-3 py-2 text-sm font-semibold">{item}</li>)}
          </ul>
          <div className="mt-7 border-t border-white/25 pt-6">
            <h3 className="text-lg text-white">{t.important}</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">{t.disclaimer}</p>
          </div>
        </aside>
      </div>
    </Sectie>

    <Sectie grond="zand">
      <Kop label={t.season} titel={t.related} intro={t.relatedIntro} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => <li key={item.slug} className="overflow-hidden rounded-xl bg-white shadow-sm">
          <Link href={origin ? `/${locale}/feestdagen/${item.slug}?catalog=${origin}` : platterDetailHref(locale, item.slug, selection.toString())} className="group block h-full">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#eaf7fc]">
              <Image src={item.afbeelding} alt={platterPhotoAlt(item, locale)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
            </div>
            <div className="p-5">
              {platterFamily(item.slug) && <p className="mb-4"><PlatterPhotoNote locale={locale} /></p>}
              <h3 className="text-xl group-hover:underline">{item.naam}</h3>
              <p className="mt-2 font-bold text-[#a61f2b]">{platterPrice(item, locale)}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#075b82] underline underline-offset-4">{t.view} →</span>
            </div>
          </Link>
        </li>)}
      </ul>
    </Sectie>

    <PaginaSlot titel={product.naam} tekst={note} knoppen={[
      { label: catalogText(locale).listLink, href: "#aanvraag" },
      { label: t.season, href: `/${locale}/feestdagen`, soort: "lijn" },
    ]} />
  </>;
}
