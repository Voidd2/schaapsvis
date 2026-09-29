import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Schema } from "@/components/Schema";
import { JsonLd } from "@/components/JsonLd";
import { Sectie, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { BEDRIJF } from "@/lib/bedrijf";
import { calendarCopy, localizedCalendar } from "@/lib/calendar-localization";
import { MaandStrip } from "./MaandStrip";
import { DezeMaand } from "./DezeMaand";

export const dynamic = "force-dynamic";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params,c=calendarCopy(locale);
 return paginaMetadata({locale,pad:"/viskalender",title:c.meta,description:c.description,image:"/images/recepten/gebakken-schol-tomaat-olijven.webp"});
}
export default async function ViskalenderPage({params}:Props){
 const {locale}=await params,c=calendarCopy(locale),months=localizedCalendar(locale);
 const index=Number(new Intl.DateTimeFormat("nl-NL",{month:"numeric",timeZone:"Europe/Amsterdam"}).format(new Date()))-1;
 const source=locale==="en"?"https://www.mosselen.nl/en/mussel-info/season/":locale==="de"?"https://www.mosselen.nl/de/muschel-info/saison/":"https://www.mosselen.nl/nl/mosselinfo/seizoen/";
 return <>
  <JsonLd locale={locale}/><Schema data={[vraagSchema(c.questions),kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.name,pad:"/viskalender"}])]}/>
  <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.name}]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true},{label:c.range,href:`/${locale}/assortiment`,soort:"lijn"}]} feiten={[{label:c.mussels,waarde:c.musselSeason},{label:c.herring,waarde:c.herringSeason},{label:c.supply,waarde:c.ask}]}/>
  <DezeMaand locale={locale} maandIndex={index}/>
  <MaandStrip maanden={months.map(m=>({naam:m.naam,afkorting:m.afkorting}))} maandIndex={index} label={c.months}/>
  <div className="section-wrap py-12 grid md:grid-cols-2 gap-7">{months.map((m,i)=><article key={m.naam} id={`maand-${i}`} className="scroll-mt-44 overflow-hidden rounded-2xl border border-sky-100 bg-white">
   <Image src={m.foto.src} alt={m.foto.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 50vw" className="w-full aspect-[16/9] object-cover"/>
   <div className="p-6 md:p-8"><p className="kapitaal mb-3">{m.seizoen}</p><h2 className="text-[2rem] md:text-[2.6rem] leading-none mb-4">{m.naam}</h2><p className="text-xl mb-5" style={{fontFamily:"var(--font-display)",color:"var(--navy)"}}>{m.hoogtepunt}</p><p className="lees">{m.tekst}</p>
    <div className="flex flex-wrap gap-5 mt-6 mb-8">{m.links.map(l=><Link key={l.href} href={l.href} className="font-semibold underline underline-offset-4">{l.label} →</Link>)}</div>
    <p className="kapitaal mb-3">{c.what}</p><ul className="border-t border-sky-100">{m.vis.map(v=><li key={v.naam} className="flex justify-between gap-4 py-3 border-b border-sky-100"><span>{v.naam}</span>{v.keurmerk&&<span className="kapitaal" style={{color:"var(--seafoam)"}}>{v.keurmerk}</span>}</li>)}</ul>
   </div></article>)}</div>
  <Sectie grond="zand" smal><h2 className="text-2xl mb-6">{c.faq}</h2><Vragen vragen={c.questions}/><p className="mt-6 text-sm">{c.source}: <a className="underline" href={source} target="_blank" rel="noopener noreferrer">Mosselen. Zo uit Zeeland</a>. {c.disclaimer}</p></Sectie>
  <PaginaSlot titel={c.slot} tekst={c.slotText} knoppen={[{label:bestelContact(locale).label,href:bestelContact(locale).href,extern:true},{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:BEDRIJF.telefoon.weergave,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}]}/>
 </>;
}
