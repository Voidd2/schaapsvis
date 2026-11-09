import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import { Suspense } from "react";
import Link from "next/link";
import { catalogProduct, MAIN_PLATTERS, GOURMET, DELICACIES, FEATURED, SECONDARY, SALAD_REQUESTS, languageIndex } from "@/lib/seafood-catalog";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { SALAD_PORTION_CENTS } from "@/lib/salad-extras";
import { catalogText } from "@/lib/catalog-copy";
import { platterPhotoAlt, platterPrice, platterPresentation } from "@/lib/platter-presentation";
import { isDeliTrio } from "@/lib/deli-trio";
import { DeliTrio, ProductQuantity, LegacyCatalogSelection } from "./RequestControls";
import { CatalogPhoto, GiftRequest, GourmetRequest } from "./CatalogEnhancements";

import { giftCopy } from "@/lib/gift-copy";
import { giftRequestCopy } from "@/lib/gift-request";
import { gourmetPortionText } from "@/lib/gourmet-pricing";

type Props = { locale: string; festive?: boolean };
function ProductCard({ slug, locale, festive, featured = false }: Props & { slug: string; featured?: boolean }) {
  const product = catalogProduct(slug, locale), t = catalogText(locale), isPlatter = product.categorie === "visschalen" || product.categorie === "gourmet";
  const href = `/${locale}/feestdagen/${slug}?catalog=${festive ? "feestdagen" : "visschalen"}`;
  const legacyAnchor = slug === MAIN_PLATTERS[0] ? "schalen-klassiek" : slug === MAIN_PLATTERS[3] ? "schalen-luxe" : slug === MAIN_PLATTERS[4] ? "schalen-hapjes" : undefined;
  return <article id={legacyAnchor ?? slug} className={`seafood-card${featured ? " seafood-featured-card" : ""}`} data-catalog-card={slug}>
    {isPlatter && <header className="platter-card-heading"><h3><Link href={href}>{product.naam}</Link></h3><p className="seafood-price">{platterPrice(product, locale)}</p></header>}
    <CatalogPhoto src={product.afbeelding} alt={platterPhotoAlt(product, locale)} name={product.naam} locale={locale} platter={isPlatter} />
    <div className="seafood-card-body">
      {isPlatter && <p className="text-sm">{platterPresentation(locale).photoText}</p>}
      {!isPlatter && <h3><Link href={href}>{product.naam}</Link></h3>}
      <p>{product.intro}</p>
      {product.categorie === "gourmet" && <p className="text-sm">{gourmetPortionText(slug, locale)}</p>}
      {!isPlatter && <p className="seafood-price">{platterPrice(product, locale)}</p>}
      <Link className="seafood-detail" href={href}>{t.view} →</Link>
      {isDeliTrio(slug) ? <DeliTrio key={slug} locale={locale} slug={slug} product={product.naam} /> : <ProductQuantity product={product.naam} slug={slug} locale={locale} />}
    </div>
  </article>;
}
function Featured(props: Props) {
  const t = catalogText(props.locale);
  return <section className="seafood-featured" aria-label={t.favorites}>
    <div className="seafood-featured-title"><p className="kapitaal">{t.favoriteLabel}</p><h2>{t.favorites}</h2><span aria-hidden="true">— ◇ —</span></div>
    <ProductCard {...props} slug={FEATURED} featured />
  </section>;
}
export function SeafoodCatalog({ locale, festive = false }: Props) {
  const t = catalogText(locale), props = { locale, festive };
  return <div className="seafood-catalog section-wrap">
    <Suspense fallback={null}><LegacyCatalogSelection locale={locale} /></Suspense>
    {festive && <Featured {...props} />}
    <section id="visschalen" className="seafood-section" aria-labelledby="main-platters-title">
      <div className="catalog-heading"><h2 id="main-platters-title">{t.platters}</h2>{festive && <p>{t.platterIntro}</p>}</div>

      <div className="seafood-grid">{MAIN_PLATTERS.map(slug => <ProductCard key={slug} {...props} slug={slug} />)}</div>
    </section>
    {festive && <GiftIdeas locale={locale} />}
    {!festive && <Featured {...props} />}
    {[{ id: "gourmet", title: t.gourmet, intro: t.gourmetIntro, products: GOURMET }, { id: "delicatessen", title: t.delicacies, intro: t.delicaciesIntro, products: DELICACIES }].map(section => <section key={section.id} id={section.id} className="seafood-section">
      <div className="catalog-heading"><h2>{section.title}</h2><p>{section.intro}</p></div>
      {section.id === "gourmet" && <GourmetRequest locale={locale} />}
      <div className="seafood-grid">{section.products.map(slug => <ProductCard key={slug} {...props} slug={slug} />)}</div>
      {section.id === "gourmet" && <><Link className="inline-block mt-4 underline" href={`/${locale}/blog/welke-vis-voor-gourmet`}>{locale==="nl"?"Welke vis past in een gourmetpannetje?":locale==="en"?"Which fish work in a tabletop grill pan?":"Welcher Fisch passt ins Tischgrillpfännchen?"} →</Link></>}
    </section>)}
    <section id="salades" className="seafood-salads seafood-section">
      <div className="catalog-heading"><h2>{t.salads}</h2><p>{t.saladIntro}</p></div>
      <div className="seafood-salad-grid">{SALAD_REQUESTS.map(salad => <article key={salad.slug}>
        <Image src={salad.image} alt={`${t.saladPhoto}: ${salad.names[languageIndex(locale)]}`} width={600} height={450} sizes="(max-width: 640px) 50vw, 25vw" />
        <small>{t.saladPhoto}</small>
        <h3>{salad.names[languageIndex(locale)]}</h3><p className="seafood-price">{feestdagenBedrag(SALAD_PORTION_CENTS, locale)} / 100 g</p>
        {salad.productSlug && <Link className="seafood-detail" href={`/${locale}/assortiment/${salad.productSlug}`}>{t.view} →</Link>}
        <ProductQuantity product={salad.names[languageIndex(locale)]} slug={salad.slug} locale={locale} />
      </article>)}</div>
      <p className="request-muted mt-5">{t.saladNote}</p>
    </section>
    {!festive && <GiftIdeas locale={locale} />}
    <details className="catalog-secondary"><summary>{t.more}</summary><p>{t.moreIntro}</p>
      <div className="seafood-grid">{SECONDARY.map(slug => <ProductCard key={slug} {...props} slug={slug} />)}</div>
    </details>
    <div className="catalog-custom-banner"><div><h2>{t.custom}</h2><p>{locale === "en" ? "A larger group or a different selection? Tell us your wishes." : locale === "de" ? "Eine größere Runde oder andere Zusammenstellung? Nennen Sie uns Ihre Wünsche." : "Een groter gezelschap of een andere samenstelling? Vertel ons uw wensen."}</p></div><Link className="knop knop-lijn-licht" href={festive ? `/${locale}/visschalen#maatwerk` : "#maatwerk"}>{t.custom} →</Link></div>
  </div>;
}

function GiftIdeas({ locale }: { locale:string }) {
 const c = giftCopy(locale), t = giftRequestCopy(locale);
 return <section id="geschenken" className="catalog-gifts seafood-section" aria-labelledby="gift-title"><div className="catalog-heading"><h2 id="gift-title">{c.options}</h2><p>{c.note}</p></div><div className="seafood-grid">{[0,2,3].map(index => { const [name, description, image, alt] = c.items[index]; return <article key={name}><Image src={image} alt={alt} width={1200} height={800} sizes="(max-width:640px) 100vw, 33vw" /><p className="mt-2 text-sm">{index === 2 ? t.trioExample : t.example}</p><h3>{name}</h3><p>{description}</p>{index === 3 && <p className="seafood-price">{c.priceNote}</p>}<GiftRequest locale={locale} product={name} kind={index === 0 ? "package" : index === 2 ? "trio" : "custom"} /></article>; })}</div></section>;
}
