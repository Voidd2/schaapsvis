import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getVoeding, getSeizoen, getViswijzer, CATEGORIE_KLEUR } from "@/lib/assortiment-data";
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
  const seizoen = productNote(getSeizoen(slug), lang), viswijzer = productNote(getViswijzer(slug), lang), prijs = getPrijs(slug);
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
  const articles = /zalm|lax/.test(slug) ? [
    ["wilde-zalm-vs-kweekzalm-waarom-wij-varlaks-kiezen", lang === "de" ? "Wildlachs und Zuchtlachs" : lang === "en" ? "Wild salmon and farmed salmon" : "Wilde zalm en kweekzalm"],
    ["is-biologische-zalm-gezonder-omega-3", lang === "de" ? "Bio-Lachs und Omega-3" : lang === "en" ? "Organic salmon and omega-3" : "Biologische zalm en omega-3"],
  ] : [];
  articles.push(["verse-vis-bewaren-en-bereiden-tips", lang === "de" ? "Fisch aufbewahren und zubereiten" : lang === "en" ? "Storing and preparing fish" : "Verse vis bewaren en bereiden"]);
  const nutritionRows = voeding ? [[c.energy, `${voeding.kcal} kcal / ${voeding.kj} kJ`], [c.fat, `${voeding.vet} g`], [c.saturated, `${voeding.verzadigd} g`], [c.carbs, `${voeding.koolhydraten} g`], [c.sugars, `${voeding.suikers} g`], [c.protein, `${voeding.eiwit} g`], [c.salt, `${voeding.zout} g`]] : [];
  // Informational catalogue: no unverified stock status or online-sale offers.
  const productSchema = {"@context":"https://schema.org", "@type":"Product", name:product.naam, description:product.desc, category, brand:{"@type":"Brand", name:BEDRIJF.naam}, image:photo ? `${BEDRIJF.domein}${photo.src}` : undefined, url:`${BEDRIJF.domein}/${lang}/assortiment/${slug}`};
  return <>
    <Schema data={[productSchema, kruimelSchema(lang, [{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.range,pad:"/assortiment"},{naam:product.naam,pad:`/assortiment/${slug}`}])]} />
    <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${lang}`},{naam:c.range,href:`/${lang}/assortiment`},{naam:product.naam}]} label={[category,product.badge,product.omega3?"Omega-3":null].filter(Boolean).join(" · ")} titel={product.naam} intro={product.desc} knoppen={[action,{label:c.browse,href:`/${lang}/assortiment`,soort:"lijn"}]} feiten={[{label:c.available,waarde:availability.label},{label:c.price,waarde:prijs?`${formatPrijs(prijs,lang)} — ${c.guidePrice}`:c.dailyPrice},...(seizoen?[{label:c.best,waarde:seizoen}]:[])]} />
    <Sectie grond="papier"><div className={`grid ${photo?"lg:grid-cols-[0.95fr_1.05fr]":"max-w-3xl"} gap-10 lg:gap-16`}>
      {(photo || product.beschikbaar !== "dagelijks" || isSalmon) && <div>
        {photo && <div className="relative w-full aspect-[4/3] flex items-center justify-center" style={{backgroundColor:"#fff",borderBottom:`3px solid ${CATEGORIE_KLEUR[product.categorie]}`}}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) calc(100vw - 40px), 45vw" loading="lazy" className={`w-full h-full ${photo.editorial?(photo.whole?"object-contain":"object-cover"):"object-contain"}`} />
        </div>}
        <p className="mt-6 pl-5" style={{borderLeft:`2px solid ${availability.unavailable?"#be123c":"var(--navy)"}`}}>{availability.note}</p>
        {isSalmon && <Link href={`/${lang}/varlaks`} className="block mt-6 pl-5" style={{borderLeft:"2px solid var(--seafoam)"}}><p className="kapitaal mb-2">{c.alternative}</p><p className="font-semibold underline">{c.salmon}</p><p className="text-sm mt-2 leading-relaxed">{c.salmonNote}</p></Link>}
      </div>}
      <div><p className="kapitaal mb-2">{c.inspiration}</p><h2 className="text-2xl mb-3">{c.cooking}</h2><p className="mb-6">{c.ideas}</p><p className="kapitaal mb-2">{c.blog}</p><ul className="mb-7">{articles.map(([article,label])=><li key={article} className="border-b border-sky-100"><Link href={`/${lang}/blog/${article}`} className="block py-3 underline font-semibold">{label} →</Link></li>)}</ul>
        {recipeIdeas.length > 0 ? <div className="mb-8"><h2 className="text-xl mb-3">{c.recipes}</h2><ul className="grid gap-4 sm:grid-cols-2">{recipeIdeas.map(r=>{const image=receptBeeld(r);return <li key={r.slug} className="overflow-hidden rounded-xl border border-sky-100 bg-white"><Link href={`/${lang}/recepten/${r.slug}`} className="block h-full"><div className="relative aspect-[3/2] w-full bg-sky-50">{image.src&&<Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 24vw" className="object-cover" />}</div><div className="p-4"><span className="font-semibold underline">{r.title}</span><p className="text-sm mt-2">{r.tijd} · {recipeLabel(r.moeilijkheid,lang)}</p></div></Link></li>})}</ul></div> : <p className="mb-4">{c.noRecipe}</p>}
        <Link href={`/${lang}/recepten`} className="underline font-semibold">{c.recipes} →</Link><p className="mt-3">{c.recipesNote}</p>
      </div>
    </div></Sectie>
    <Sectie grond="zand"><div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      <div><h2 className="text-2xl mb-3">{c.ingredients}</h2><p className="mb-4 leading-relaxed">{product.ingredienten}</p>{product.bevat.length>0 && <p className="kapitaal mb-4">{c.contains}: {product.bevat.join(" · ")}</p>}<p className="text-sm leading-relaxed">{c.allergenNote}</p>{(seizoen||viswijzer) && <div className="mt-8 pl-5" style={{borderLeft:"2px solid var(--seafoam)"}}>{seizoen && <p className="mb-3"><strong>{c.season}:</strong> {seizoen}</p>}{viswijzer && <p><strong>VISwijzer:</strong> {viswijzer}</p>}</div>}</div>
      <div><h2 className="text-2xl mb-3">{c.nutrition}</h2>{voeding?<><p className="kapitaal mb-4">{c.per100}</p><table className="w-full"><tbody>{nutritionRows.map(([label,value],i)=><tr key={label} className="border-b border-sky-100"><th scope="row" className={`py-2.5 text-left font-normal ${[2,4].includes(i)?"pl-6":""}`}>{label}</th><td className="py-2.5 text-right">{value}</td></tr>)}</tbody></table><p className="text-sm mt-3">{c.nutritionNote}</p></>:<p>{c.nutritionRequest}</p>}{prijs && <p className="text-sm mt-6">{formatPrijs(prijs,lang)} — {c.priceNote}</p>}</div>
    </div><Link href={`/${lang}/assortiment`} className="inline-block mt-10 underline font-semibold">← {c.back}</Link></Sectie>
    <PaginaSlot titel={`${c.looking} ${lang === "de" ? product.naam : product.naam.toLowerCase()}?`} tekst={c.orderNote} knoppen={[action,{label:c.hours,href:`/${lang}/bezoek-ons`,soort:"lijn"},{label:BEDRIJF.telefoon.weergave,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}]} />
  </>;
}

