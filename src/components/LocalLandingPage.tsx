import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "./JsonLd";
import { Schema } from "./Schema";
import { Sectie, Vragen } from "./ui/Sectie";
import { PaginaKop, PaginaSlot } from "./ui/PaginaKop";
import { localLocations, localPageCopy, localUI, type LocalPageKind } from "@/lib/local-pages-copy";
import { BEDRIJF } from "@/lib/bedrijf";
import { kruimelSchema, vraagSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { localizedProduct } from "@/lib/product-localization";

export function LocalLandingPage({kind,locale}:{kind:LocalPageKind;locale:string}){
 const c=localPageCopy(kind,locale),u=localUI(locale),app=kind==="too-good-to-go",locations=localLocations(locale).filter(p=>kind!=="marktkraam-leiden"||p.id!=="winkel");
 const appUrl=locale==="en"?"https://www.toogoodtogo.com/en":locale==="de"?"https://www.toogoodtogo.com/de":"https://www.toogoodtogo.com/nl";
 const fish=[{slug:"kibbeling",src:"/images/editorial/kibbeling.webp"},{slug:"haring",src:"/images/editorial/hollandse-nieuwe-uitjes.webp"},{slug:"varlaks-zalm",src:"/images/editorial/zalm.webp"}];
 return <><JsonLd locale={locale}/><Schema data={[vraagSchema(c.questions),kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.name,pad:`/${kind}`}])]}/>
  <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.name}]} label={app?"Too Good To Go · Leiden":u.since} titel={c.title} intro={c.intro} knoppen={app?[{label:u.app,href:appUrl,extern:true},{label:u.shop,href:`/${locale}/bezoek-ons`,soort:"lijn"}]:[{label:u.range,href:`/${locale}/assortiment`},{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true,soort:"lijn"}]}/>
  <Sectie smal><h2 className="text-3xl mb-6">{c.heading}</h2><div className="lees">{c.paragraphs.map(p=><p key={p}>{p}</p>)}</div><div className="flex flex-wrap gap-5 mt-7"><Link className="underline" href={`/${locale}/biologische-vis`}>{u.cert}</Link>{!app&&<><Link className="underline" href={`/${locale}/recepten`}>{u.recipes}</Link><Link className="underline" href={`/${locale}/viskalender`}>{u.calendar}</Link></>}</div></Sectie>
  {!app&&<Sectie grond="zand"><h2 className="text-3xl mb-7">{u.fish}</h2><div className="grid md:grid-cols-3 gap-6">{fish.map(f=>{const p=localizedProduct(f.slug,locale)!;return <article className="recipe-card" key={f.slug}><Link href={`/${locale}/assortiment/${f.slug}`}><Image src={f.src} alt={`${p.naam} — ${u.serving}`} width={1200} height={800} sizes="(max-width:768px) 100vw,33vw" className="w-full aspect-[3/2] object-cover"/><div className="recipe-card-body"><h3 className="text-xl mb-3">{p.naam}</h3><p>{p.desc}</p></div></Link></article>;})}</div></Sectie>}
  {app&&c.steps&&<Sectie grond="zand"><h2 className="text-3xl mb-7">{u.steps}</h2><ol className="grid md:grid-cols-3 gap-8">{c.steps.map(([title,text],i)=><li key={title} className="border-t-2 border-sky-700 pt-5"><p className="kapitaal mb-3">{u.step} {i+1}</p><h3 className="text-xl mb-3">{title}</h3><p>{text}</p></li>)}</ol></Sectie>}
  <Sectie><h2 className="text-3xl mb-7">{u.locations}</h2><div className="grid md:grid-cols-2 gap-6">{(app?locations.filter(p=>p.id==="winkel"):locations).map(p=><article key={p.id} className="rounded-2xl p-7 bg-sky-50 border border-sky-100"><h3 className="text-2xl mb-3">{p.naam}</h3><p>{p.adres}<br/>{p.postcode} {p.plaats}</p><p className="font-semibold my-4">{p.dagen}</p><a href={p.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline">{u.route} →</a>{p.id==="voorschoten"&&<Link className="block underline mt-4" href={`/${locale}/viswinkel-voorschoten`}>{locale==="de"?"Mehr über unseren Freitagsstand":locale==="en"?"More about our Friday stall":"Meer over onze vrijdagkraam"} →</Link>}</article>)}</div></Sectie>
  <Sectie smal grond="zand"><h2 className="text-3xl mb-6">{u.questions}</h2><Vragen vragen={c.questions}/></Sectie>
  <PaginaSlot titel={app?u.shop:u.budget} tekst={u.policy} knoppen={[{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true},{label:u.platter,href:`/${locale}/visschalen`,soort:"lijn"}]}/>
 </>;
}
