import { productHref } from "@/lib/product-href";
import { StaticResponsiveImage } from "./StaticResponsiveImage";
import { BEELD } from "@/lib/beeld";
import { Beeld } from "@/components/ui/Beeld";
import { ShopHours } from "@/components/shared/ShopHours";
import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "./JsonLd";
import { Schema } from "./Schema";
import { Sectie, Vragen } from "./ui/Sectie";
import { PaginaKop, PaginaSlot } from "./ui/PaginaKop";
import { localLocations, localPageCopy, localUI, type LocalPageKind } from "@/lib/local-pages-copy";
import { BEDRIJF } from "@/lib/bedrijf";
import { kruimelSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { localizedProduct } from "@/lib/product-localization";

function ProductLinks({ locale, slugs }: { locale: string; slugs: string[] }) {
  return <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
    {slugs.map(slug => {
      const product = localizedProduct(slug, locale);
      return product && <li key={slug}><Link className="underline underline-offset-4" href={productHref(locale, slug)}>{product.naam}</Link></li>;
    })}
  </ul>;
}

export function LocalLandingPage({kind,locale}:{kind:LocalPageKind;locale:string}){
 const c = localPageCopy(kind, locale);
 const u = localUI(locale);
 const app = kind === "too-good-to-go";
 const locations = localLocations(locale);
 const listedLocations = c.shop
   ? ["markt-woensdag", "markt"].flatMap(id => locations.filter(p => p.id === id))
   : locations.filter(p => app ? p.id === "winkel" : p.id !== "winkel");
 const shop = locations.find(p=>p.id==="winkel");
 const appUrl=locale==="en"?"https://www.toogoodtogo.com/en":locale==="de"?"https://www.toogoodtogo.com/de":"https://www.toogoodtogo.com/nl";
 const fish=[{slug:"kibbeling",src:"/images/editorial/kibbeling-schaapstray.png"},{slug:"haring",src:"/images/editorial/hollandse-nieuwe-uitjes.webp"},{slug:"varlaks-zalm",src:"/images/editorial/zalm.webp"}];
  const marktFotoAlt = locale === "de"
    ? { kraam: "Schaap’s Fischstand auf dem Leidener Markt mit Kundschaft", snijden: "Ein Mitarbeiter schneidet Hering am Marktstand" }
    : locale === "en"
      ? { kraam: "Schaap’s fish stall at Leiden market with customers", snijden: "A member of staff slicing herring at the market stall" }
      : { kraam: "De viskraam van Schaap’s op de Leidse markt met klanten", snijden: "Een medewerker snijdt haring aan de marktkraam" };
 const locatieKaarten = (
   <Sectie>
     <h2 id={c.shop ? "leidse-markten" : undefined} className="text-3xl mb-7 scroll-mt-32">{c.shop?.marketsHeading ?? u.locations}</h2>
     <div className="grid md:grid-cols-2 gap-6">
       {listedLocations.map(p => <article key={p.id} className="rounded-2xl p-7 bg-sky-50 border border-sky-100">
         <h3 className="text-2xl mb-3">{p.naam}</h3>
         <p>{p.adres}<br />{p.postcode} {p.plaats}</p>
         {p.id === "winkel" ? <ShopHours locale={locale} /> : <p className="font-semibold my-4">{p.dagen}</p>}
         <a href={p.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${u.route}: ${p.naam}`} className="knop knop-lijn">{u.route} →</a>
         {p.id === "voorschoten" && <Link className="block underline mt-4" href={`/${locale}/viswinkel-voorschoten`}>{locale === "de" ? "Mehr über unseren Freitagsstand" : locale === "en" ? "More about our Friday stall" : "Meer over onze vrijdagkraam"} →</Link>}
       </article>)}
     </div>
     {c.shop && <Link className="inline-block mt-6 underline font-semibold" href={`/${locale}/marktkraam-leiden`}>{c.shop.marketsLink} →</Link>}
   </Sectie>
 );
 const toonbank = BEELD.winkelToonbank;
 const toonbankAlt = locale === "de" || locale === "en" ? toonbank.vertalingen[locale].alt : toonbank.alt;
 return <><JsonLd locale={locale}/>
  {c.shop && <Schema data={{
    "@context": "https://schema.org", "@type": "WebPage",
    "@id": `${BEDRIJF.domein}/${locale}/viswinkel-leiden#webpage`,
    url: `${BEDRIJF.domein}/${locale}/viswinkel-leiden`, name: c.title, description: c.description, inLanguage: locale,
    mainEntity: { "@id": `${BEDRIJF.domein}/#winkel` },
    isPartOf: { "@id": `${BEDRIJF.domein}/#website` },
    primaryImageOfPage: { "@type": "ImageObject", url: BEDRIJF.domein + toonbank.bestand },
  }} />}
  <Schema data={[kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.name,pad:`/${kind}`}])]}/>
  <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.name}]} label={app?"Too Good To Go · Leiden":u.since} titel={c.title} intro={c.intro} zijkant={c.shop && shop ? <div className="min-w-0">
    <address className="font-semibold not-italic">{shop.adres}, {shop.postcode} {shop.plaats}</address>
    <ShopHours locale={locale} />
  </div> : undefined} knoppen={kind==="viswinkel-leiden" && shop ? [{label:u.route,href:shop.mapsUrl,extern:true},{label:BEDRIJF.telefoon.weergave,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}] : app?[{label:u.app,href:appUrl,extern:true},{label:u.shop,href:`/${locale}/bezoek-ons`,soort:"lijn"}]:[{label:u.range,href:`/${locale}/assortiment`},{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true,soort:"lijn"}]}/>
  {kind !== "viswinkel-leiden" && locatieKaarten}
  <Sectie smal={app}><div className={app ? "" : "grid items-center gap-8 lg:grid-cols-2 lg:gap-14"}>
    {!app && (kind === "marktkraam-leiden" ? (
      <div className="relative aspect-video w-full overflow-hidden border-b-2 border-[var(--sand-diep)]" role="group" aria-label={locale === "en" ? "Photos of our Leiden market stall" : locale === "de" ? "Fotos von unserem Leidener Marktstand" : "Foto’s van onze marktkraam in Leiden"}>
        <Image src="/images/schaaps/schaaps-viskraam.webp" alt={marktFotoAlt.kraam} fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-y-0 right-0 w-[38%] overflow-hidden border-l-4 border-white shadow-lg">
          <Image src="/images/schaaps/haringkraam-aan-het-water.webp" alt={marktFotoAlt.snijden} fill sizes="(max-width: 800px) 38vw, 19vw" className="object-cover" style={{ objectPosition: "64% 56%" }} />
        </div>
      </div>
    ) : <div id="toonbank" className="scroll-mt-28"><StaticResponsiveImage src={toonbank.bestand}
        alt={toonbankAlt} width={1200} height={650} sizes="(max-width: 1023px) 100vw, 50vw"
        className="block w-full h-auto rounded-md" loading="lazy" /></div>)}
    <div>
      <h2 className="text-3xl mb-4">{c.heading}</h2>
      <div className="lees">{c.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
      {c.shop ? <>
        <ProductLinks locale={locale} slugs={["kabeljauwfilet", "varlaks-zalm", "creuse-oesters"]} />
        <h2 className="text-3xl mt-8 mb-4">{c.shop.lunchHeading}</h2>
        <p className="leading-relaxed">{c.shop.lunchText}</p>
        <ProductLinks locale={locale} slugs={["broodje-haring", "kibbeling", "lekkerbek"]} />
        <Link className="mt-4 inline-block underline underline-offset-4" href={`/${locale}/blog/kibbeling-vs-lekkerbek-het-verschil`}>{c.shop.guideLink} →</Link>
      </> : <div className="flex flex-wrap gap-5 mt-7">
        <Link className="underline" href={`/${locale}/varlaks#certificaten`}>{u.cert}</Link>
        {!app && <><Link className="underline" href={`/${locale}/recepten`}>{u.recipes}</Link><Link className="underline" href={`/${locale}/viskalender`}>{u.calendar}</Link></>}
      </div>}
    </div>
  </div></Sectie>
  {kind === "viswinkel-leiden" && locatieKaarten}
  {!app&&!c.shop&&<Sectie grond="zand"><h2 className="text-3xl mb-7">{u.fish}</h2><div className="grid md:grid-cols-3 gap-6">{fish.map(f=>{const p=localizedProduct(f.slug,locale)!;return <article className="recipe-card" key={f.slug}><Link href={productHref(locale, f.slug)}><Image src={f.src} alt={`${p.naam} — ${u.serving}`} width={1200} height={800} sizes="(max-width:768px) 100vw,33vw" className="w-full aspect-[3/2] object-cover"/><div className="recipe-card-body"><h3 className="text-xl mb-3">{p.naam}</h3><p>{p.desc}</p></div></Link></article>;})}</div></Sectie>}
  {app&&c.steps&&<Sectie grond="zand"><h2 className="text-3xl mb-7">{u.steps}</h2><ol className="grid md:grid-cols-3 gap-8">{c.steps.map(([title,text],i)=><li key={title} className="border-t-2 border-sky-700 pt-5"><p className="kapitaal mb-3">{u.step} {i+1}</p><h3 className="text-xl mb-3">{title}</h3><p>{text}</p></li>)}</ol></Sectie>}

  <Sectie smal={kind !== "viswinkel-leiden"} grond="zand">
    <div className={kind === "viswinkel-leiden" ? "grid items-start gap-8 lg:grid-cols-2 lg:gap-14" : undefined}>
      <div><h2 className="text-3xl mb-6">{u.questions}</h2><Vragen vragen={c.questions}/></div>
      {kind === "viswinkel-leiden" && <Beeld naam="oestersInDeWinkel" verhouding="liggend" klasse="[&_img]:origin-right [&_img]:scale-150" streep="var(--navy)" />}
    </div>
  </Sectie>
  <PaginaSlot titel={app?u.shop:u.budget} tekst={u.policy} knoppen={[{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true},{label:u.platter,href:`/${locale}/visschalen`,soort:"lijn"}]}/>
 </>;
}
