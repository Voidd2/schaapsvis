import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
import { CustomAssembly } from "./CustomAssembly";
import { platterMenu, platterModes, platterIngredients, servingCopy } from "@/lib/platter-menu";
import Link from "next/link";
import { catalogProduct, GOURMET, DELICACIES, FEATURED, SECONDARY, SALAD_REQUESTS, languageIndex } from "@/lib/seafood-catalog";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { catalogText } from "@/lib/catalog-copy";
import { platterPhotoAlt, platterPrice, platterPresentation } from "@/lib/platter-presentation";
import { isDeliTrio } from "@/lib/deli-trio";
import { DeliTrio, ProductQuantity } from "./RequestControls";
import { CatalogPhoto, GourmetOrderLink } from "./CatalogEnhancements";

import { giftCopy } from "@/lib/gift-copy";
import { giftRequestCopy } from "@/lib/gift-request";
import { gourmetPortionText } from "@/lib/gourmet-pricing";

type Props = { locale: string; festive?: boolean };
function ProductCard({ slug, locale, festive, featured = false }: Props & { slug: string; featured?: boolean }) {
  const product = catalogProduct(slug, locale), t = catalogText(locale), isPlatter = product.categorie === "visschalen" || product.categorie === "gourmet";
  const href = `/${locale}/feestdagen/${slug}?catalog=${festive ? "feestdagen" : "visschalen"}`;
  return <article id={slug} className={`seafood-card${featured ? " seafood-featured-card" : ""}`} data-catalog-card={slug}>
    {isPlatter && <header className="platter-card-heading"><h3><Link href={href}>{product.naam}</Link></h3><p className="seafood-price">{platterPrice(product, locale)}</p></header>}
    <CatalogPhoto src={product.afbeelding} alt={platterPhotoAlt(product, locale)} name={product.naam} locale={locale} platter={product.categorie === "visschalen"} />
    <div className="seafood-card-body">
      {product.categorie === "visschalen" && <p className="text-sm">{platterPresentation(locale).photoText}</p>}
      {!isPlatter && <h3><Link href={href}>{product.naam}</Link></h3>}
      <p>{product.intro}</p>
      {product.categorie === "gourmet" && <p className="text-sm">{gourmetPortionText(slug, locale)}</p>}
      {!isPlatter && <p className="seafood-price">{platterPrice(product, locale)}</p>}
      <Link className="seafood-detail" href={href}>{t.view} →</Link>
      {product.categorie === "gourmet" ? <GourmetOrderLink locale={locale} slug={slug} /> : isDeliTrio(slug) || slug === "zalmslaatje-de-luxe" ? <DeliTrio key={slug} locale={locale} slug={slug} product={product.naam} /> : <ProductQuantity product={product.naam} slug={slug} locale={locale} />}
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

    {festive && <Featured {...props} />}
    <section id="visschalen" className="seafood-section" aria-labelledby="main-platters-title">
      <div id="maatwerk" className="catalog-heading"><h2 id="main-platters-title">{t.platters}</h2><p>{t.platterIntro}</p></div>
      <div className="tier-grid">{platterModes.map(mode => {
        const tier = platterMenu[mode], i = languageIndex(locale);
        return <article key={mode} id={tier.anchor} className="seafood-card tier-card">
          <header className="platter-card-heading"><h3>{tier.names[i]}</h3>
            <p className="seafood-price">{feestdagenBedrag(tier.rate,locale)} {servingCopy.per[i]}</p>
          </header>
          <Image src={tier.photo} alt={tier.photoAlt[i]} width={900} height={600} sizes="(max-width:700px) 100vw, 50vw" />
          <div className="seafood-card-body">
            <p>{new Intl.ListFormat(locale).format(tier.fish.map(id => platterIngredients[id][i]))}.</p>
            <CustomAssembly locale={locale} mode={mode} product={tier.names[i]} />
          </div>
        </article>;
      })}</div>
      <p className="mt-4 max-w-3xl">{servingCopy.sizeNote[languageIndex(locale)]}</p>
    </section>
    {festive && <GiftIdeas locale={locale} />}
    {!festive && <Featured {...props} />}
    {[{ id: "gourmet", title: t.gourmet, intro: t.gourmetIntro, products: GOURMET }, { id: "delicatessen", title: t.delicacies, intro: t.delicaciesIntro, products: DELICACIES }].map(section => <section key={section.id} id={section.id} className="seafood-section">
      <div className="catalog-heading"><h2>{section.title}</h2><p>{section.intro}</p></div>
      {section.id === "gourmet" && <div id="gourmet-samenstellen" className="mb-5"><span id="gourmet-keuzes"/><GourmetOrderLink locale={locale}/></div>}
      <div className="seafood-grid">{section.products.map(slug => <ProductCard key={slug} {...props} slug={slug} />)}</div>
      {section.id === "gourmet" && <><Link className="inline-block mt-4 underline" href={`/${locale}/blog/welke-vis-voor-gourmet`}>{locale==="nl"?"Welke vis past in een gourmetpannetje?":locale==="en"?"Which fish work in a tabletop grill pan?":"Welcher Fisch passt ins Tischgrillpfännchen?"} →</Link></>}
    </section>)}
    <section id="salades" className="seafood-salads seafood-section">
      <div className="catalog-heading"><h2>{t.salads}</h2><p>{t.saladIntro}</p></div>
      <div className="seafood-salad-grid">{SALAD_REQUESTS.map(salad => <article key={salad.slug}>
        {salad.image && <Image src={salad.image} alt={salad.names[languageIndex(locale)]} width={600} height={450} sizes="(max-width: 640px) 50vw, 25vw" />}
        <h3>{salad.names[languageIndex(locale)]}</h3><p className="seafood-price">{feestdagenBedrag(salad.cents, locale)} / 100 g</p>
        {salad.productSlug && <Link className="seafood-detail" href={`/${locale}/assortiment/${salad.productSlug}`}>{t.view} →</Link>}
        <ProductQuantity product={salad.names[languageIndex(locale)]} slug={salad.slug} locale={locale} />
      </article>)}</div>
      <p className="request-muted mt-5">{t.saladNote}</p>
    </section>
    {!festive && <GiftIdeas locale={locale} />}
    <details className="catalog-secondary"><summary>{t.more}</summary><p>{t.moreIntro}</p>
      <div className="seafood-grid">{SECONDARY.map(slug => <ProductCard key={slug} {...props} slug={slug} />)}</div>
    </details>

  </div>;
}

function GiftIdeas({ locale }: { locale:string }) {
  const c = giftCopy(locale);
  const [name, description, image, alt] = c.items.trio;
  return <section id="geschenken" className="catalog-gifts seafood-section" aria-labelledby="gift-title">
    <div className="catalog-heading"><h2 id="gift-title">{c.options}</h2><p>{c.note}</p></div>
    <div className="seafood-grid"><article>
      <Image src={image} alt={alt} width={1200} height={800} sizes="(max-width:640px) 100vw, 33vw" />
      <p className="mt-2 text-sm">{giftRequestCopy(locale).trioExample}</p>
      <h3>{name}</h3><p>{description}</p>
      <p className="seafood-price">{feestdagenBedrag(catalogProduct("luxe-trio-klein",locale).prijsCents,locale)}</p>
      <CustomAssembly locale={locale} product={name} mode="gift-trio" />
    </article></div>
  </section>;
}
