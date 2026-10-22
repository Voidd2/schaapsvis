import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getVoeding, getSeizoen, CATEGORIE_KLEUR } from "@/lib/assortiment-data";
import { localizedProduct, CATEGORY_NAMES, siteLanguage } from "@/lib/product-localization";
import { productCopy, productNote } from "@/lib/product-copy";
import { productAvailability } from "@/lib/product-availability";
import { getPrijs, formatPrijs } from "@/lib/prijzen";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF } from "@/lib/bedrijf";
import { recepten } from "@/lib/recepten";
import { localizeRecipe } from "@/lib/recipe-localization";
import { recipeLabel } from "@/lib/recipe-copy";
import { bestelContact } from "@/lib/bestel-contact";
import { productPhoto } from "@/lib/product-beeld";
import { receptBeeld } from "@/lib/recepten";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";

type Props = {params: Promise<{locale: string; slug: string}>};
export function generateStaticParams() { return products.map(p => ({slug: p.slug})); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = localizedProduct(slug, locale);
  if (!product) return {};
  const c = productCopy(locale);
  return paginaMetadata({locale, pad: `/assortiment/${slug}`, title: `${product.naam} | ${c.range} Leiden`, description: `${product.naam}: ${productAvailability(product,locale).label}. ${product.desc}`.slice(0, 160), image: productPhoto(product)?.src || "/og-image.png"});
}
export default async function ProductDetailPage({params}: Props) {
  const {locale, slug} = await params;
  const lang = siteLanguage(locale), product = localizedProduct(slug, lang);
  if (!product) notFound();
  const c = productCopy(lang), category = CATEGORY_NAMES[lang][product.categorie], photo = productPhoto(product,lang), voeding = getVoeding(slug);
  const seizoen = productNote(getSeizoen(slug), lang), prijs = getPrijs(slug);
  const availability = productAvailability(product,lang);
  const isPlatter = ["visschaal", "feestschotel"].includes(slug), isSalmon = !product.highlight && /zalm|lax/.test(slug);
  const action = {label: isPlatter ? c.platter : bestelContact(lang).label, href: isPlatter ? `/${lang}/visschalen` : bestelContact(lang, product.naam).href, extern: !isPlatter};
  const ownRecipes = recepten.filter(r => r.hoofdproduct === slug).slice(0, 4).map(r => localizeRecipe(r,lang));
  const recipeIdeasByProduct: Record<string, string[]> = {
    kabeljauwfilet: ["gebakken-kabeljauw-botersaus", "kabeljauw-zeekraal-venkel", "kabeljauw-oven-tomaat-olijven", "snelle-viscurry-kabeljauw"],
    scholfilet: ["gegrilde-schol", "gebakken-schol-tomaat-olijven"],
    "hollandse-garnalen": ["garnalensalade-pompoen", "witlof-garnalen-oesterzwam", "toast-hollandse-garnalen-avocado"],
    haring: ["broodje-haring-uitjes", "krieltjessalade-haring"],
    "gerookte-zalm-high-seas": ["zomerse-zalmsalade", "pasta-gerookte-zalm-roomsaus", "gerookte-zalm-rolletjes-roomkaas"],
    tonijnfilet: ["tonijnsteak-grillen-sesam", "tonijntartaar-avocado", "pasta-verse-tonijn-tomaat"],
    wijtingfilet: ["gebakken-wijting-citroen", "viskoekjes-wijting"],
    "fine-de-claire-oesters": ["oesters-sjalottenazijn"],
    kibbeling: ["kibbeling-ravigotesaus-salade"],
    lekkerbek: ["lekkerbek-koolsalade"],
    vissoep: ["vissoep-rouille-croutons"],
    "varlaks-zalm": ["zalm-citroen-dille", "teriyaki-zalm-rijst", "zalm-traybake-groenten"],
  };
  const recipeIdeas = ownRecipes.length ? ownRecipes : (recipeIdeasByProduct[slug] || [])
    .map(recipeSlug => recepten.find(r => r.slug === recipeSlug))
    .filter((r): r is (typeof recepten)[number] => Boolean(r))
    .map(r => localizeRecipe(r, lang));
  const nutritionRows = voeding ? [[c.energy, `${voeding.kcal} kcal / ${voeding.kj} kJ`], [c.fat, `${voeding.vet} g`], [c.saturated, `${voeding.verzadigd} g`], [c.carbs, `${voeding.koolhydraten} g`], [c.sugars, `${voeding.suikers} g`], [c.protein, `${voeding.eiwit} g`], [c.salt, `${voeding.zout} g`]] : [];
  // Informational catalogue: no unverified stock status or online-sale offers.
  const productSchema = {"@context":"https://schema.org", "@type":"Product", name:product.naam, description:product.desc, category, brand:{"@type":"Brand", name:BEDRIJF.naam}, image:photo ? `${BEDRIJF.domein}${photo.src}` : undefined, url:`${BEDRIJF.domein}/${lang}/assortiment/${slug}`};
  return <>
    <Schema data={[productSchema, kruimelSchema(lang, [{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.range,pad:"/assortiment"},{naam:product.naam,pad:`/assortiment/${slug}`}])]} />
    <PaginaKop className="product-page-heading" kruimels={[{naam:BEDRIJF.naamKort,href:`/${lang}`},{naam:c.range,href:`/${lang}/assortiment`},{naam:product.naam}]} label={[category,product.badge,product.omega3?"Omega-3":null].filter(Boolean).join(" · ")} titel={product.naam} knoppen={[{label:c.browse,href:`/${lang}/assortiment`,soort:"lijn"}]} feiten={[{label:c.available,waarde:availability.label},{label:c.price,waarde:prijs?`${formatPrijs(prijs,lang)} — ${c.guidePrice}`:c.dailyPrice},...(seizoen?[{label:c.best,waarde:seizoen}]:[])]} />
    <Sectie grond="papier"><div className="mx-auto max-w-4xl">
      {photo && <div className="relative mx-auto w-full max-w-3xl aspect-[4/3] flex items-center justify-center" style={{backgroundColor:"#fff",borderBottom:`3px solid ${CATEGORIE_KLEUR[product.categorie]}`}}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) calc(100vw - 40px), 768px" priority className={`w-full h-full ${photo.editorial?(photo.whole?"object-contain":"object-cover"):"object-contain"}`} />
      </div>}
      <div className="mx-auto max-w-3xl pt-7">
        <p className="text-lg leading-relaxed">{product.desc}</p>
        <p className="mt-5 pl-5" style={{borderLeft:`2px solid ${availability.unavailable?"#be123c":"var(--navy)"}`}}>{availability.note}</p>
        {isSalmon && <Link href={`/${lang}/varlaks`} className="block mt-6 pl-5" style={{borderLeft:"2px solid var(--seafoam)"}}><p className="kapitaal mb-2">{c.alternative}</p><p className="font-semibold underline">{c.salmon}</p><p className="text-sm mt-2 leading-relaxed">{c.salmonNote}</p></Link>}
        {seizoen && <div className="mt-7 pl-5" style={{borderLeft:"2px solid var(--seafoam)"}}><p><strong>{c.season}:</strong> {seizoen}</p></div>}
      </div>
    </div></Sectie>
    <Sectie grond="zand"><div className="mx-auto max-w-3xl">
      <h2 className="text-2xl mb-3">{c.nutrition}</h2>{voeding?<><p className="kapitaal mb-4">{c.per100}</p><table className="w-full"><tbody>{nutritionRows.map(([label,value],i)=><tr key={label} className="border-b border-sky-100"><th scope="row" className={`py-2.5 text-left font-normal ${[2,4].includes(i)?"pl-6":""}`}>{label}</th><td className="py-2.5 text-right">{value}</td></tr>)}</tbody></table><p className="text-sm mt-3">{c.nutritionNote}</p></>:<p>{c.nutritionRequest}</p>}
      {prijs && <p className="text-sm mt-6">{formatPrijs(prijs,lang)} — {c.priceNote}</p>}
      <div className="mt-8 border-t border-sky-100 pt-7"><h2 className="text-xl mb-3">{c.ingredients}</h2><p className="mb-4 leading-relaxed">{product.ingredienten}</p>{product.bevat.length>0 && <p className="kapitaal mb-4">{c.contains}: {product.bevat.join(" · ")}</p>}<p className="text-sm leading-relaxed">{c.allergenNote}</p></div>
    </div></Sectie>
    <Sectie grond="papier"><div className="mx-auto max-w-5xl"><p className="kapitaal mb-2">{c.inspiration}</p><h2 className="text-2xl mb-3">{c.cooking}</h2><p className="mb-6">{c.ideas}</p>
      {recipeIdeas.length > 0 ? <div className="mb-8"><h3 className="text-xl mb-3">{c.recipes}</h3><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recipeIdeas.map(r=>{const image=receptBeeld(r);return <li key={r.slug} className="overflow-hidden rounded-xl border border-sky-100 bg-white"><Link href={`/${lang}/recepten/${r.slug}`} className="block h-full"><div className="relative aspect-[3/2] w-full bg-sky-50">{image.src&&<Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover" />}</div><div className="p-4"><span className="font-semibold underline">{r.title}</span><p className="text-sm mt-2">{r.tijd} · {recipeLabel(r.moeilijkheid,lang)}</p></div></Link></li>})}</ul></div> : <p className="mb-4">{c.noRecipe}</p>}
      <Link href={`/${lang}/recepten`} className="underline font-semibold">{c.recipes} →</Link><p className="mt-3">{c.recipesNote}</p>
    </div></Sectie>
    <PaginaSlot titel={`${c.looking} ${lang === "de" ? product.naam : product.naam.toLowerCase()}?`} tekst={c.orderNote} knoppen={[action,{label:c.hours,href:`/${lang}/bezoek-ons`,soort:"lijn"},{label:BEDRIJF.telefoon.weergave,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}]} />
  </>;
}

