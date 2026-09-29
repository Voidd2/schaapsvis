import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { VarlaksFilm } from "@/components/shared/VarlaksFilm";
import { Schema } from "@/components/Schema";
const copy = {
 nl: { title: "VÅRLAKS-zalm in Leiden", intro: "Goede zalm verdient een goed verhaal. Ontdek de herkomst van onze VÅRLAKS-zalm en vind een gerecht dat erbij past.", story: "Volgens VÅRLAKS komt hun zalm uit Noord-Noorwegen, van familiebedrijven. De leverancier beschrijft traceerbaarheid van ei tot bord. Bekijk hieronder hun eigen presentatiefilm.", origin: "Van leverancier naar toonbank", note: "Vraag ons naar de herkomst en certificering van het specifieke product. Een duurzaamheidsverhaal is niet hetzelfde als een biologisch keurmerk.", advice: "Vraag naar beschikbaarheid", product: "Bekijk de zalm", recipe: "Zalm in de oven met citroen en dille", labels: "Biologisch, ASC of MSC?", source: "Informatie van de leverancier", cooking: "Van toonbank naar keuken" },
 en: { title: "VÅRLAKS salmon in Leiden", intro: "Good salmon deserves a good story. Explore the origins of our VÅRLAKS salmon and find a dish to cook.", story: "VÅRLAKS describes salmon from family farms in Northern Norway, traceable from egg to plate. Watch the supplier’s own film below.", origin: "From supplier to fish counter", note: "Ask us about the origin and certification of the specific product. A sustainability story is not the same as an organic label.", advice: "Ask about availability", product: "Discover the salmon", recipe: "Oven-baked salmon recipe in Dutch", labels: "Organic, ASC or MSC?", source: "Supplier information", cooking: "From fish counter to kitchen" },
 de: { title: "VÅRLAKS-Lachs in Leiden", intro: "Guter Lachs verdient eine gute Geschichte. Entdecken Sie die Herkunft unseres VÅRLAKS-Lachses und passende Rezepte.", story: "VÅRLAKS beschreibt Lachs aus Familienbetrieben in Nordnorwegen, vom Ei bis zum Teller rückverfolgbar. Sehen Sie unten den Film des Anbieters.", origin: "Vom Anbieter zur Fischtheke", note: "Fragen Sie nach Herkunft und Zertifizierung des konkreten Produkts. Nachhaltigkeit bedeutet nicht automatisch ein Bio-Siegel.", advice: "Nach Verfügbarkeit fragen", product: "Lachs entdecken", recipe: "Ofenlachs-Rezept auf Niederländisch", labels: "Bio, ASC oder MSC?", source: "Informationen des Anbieters", cooking: "Von der Fischtheke in die Küche" }
};
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params; const c=copy[locale as keyof typeof copy]||copy.nl;
 return paginaMetadata({locale,pad:"/varlaks",title:c.title+" | Schaap’s Vishandel",description:c.intro});
}
export default async function VarlaksPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params; const c=copy[locale as keyof typeof copy]||copy.nl;
 return <>
 <Schema data={kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:"VÅRLAKS",pad:"/varlaks"}])}/>
 <header className="fresh-hero"><div className="section-wrap fresh-hero-grid"><div><p className="kapitaal">{locale === "de" ? "VÅRLAKS · Nordnorwegen" : locale === "nl" ? "VÅRLAKS · Noord-Noorwegen" : "VÅRLAKS · Northern Norway"}</p><h1>{c.title}</h1><p className="fresh-intro">{c.intro}</p><a className="knop knop-navy mt-6" href={bestelContact(locale,locale === "de" ? "VÅRLAKS-Lachs" : locale === "en" ? "VÅRLAKS salmon" : "VÅRLAKS-zalm").href}>{c.advice}</a></div><Image src="/images/editorial/zalm.webp" alt={locale==="nl"?"Zalmfilet met citroen en dille":locale==="de"?"Lachsfilet mit Zitrone und Dill":"Salmon fillet with lemon and dill"} width={1400} height={933} sizes="(max-width:800px) 100vw, 50vw" className="rounded-2xl" /></div></header>
 <section className="story-section section-wrap"><div className="story-grid"><div><h2>{c.origin}</h2><p>{c.story}</p><p>{c.note}</p><a className="underline font-semibold" href="https://varlaks.no/" target="_blank" rel="noopener noreferrer">{c.source} ↗</a></div><VarlaksFilm locale={locale}/></div></section>
 <section className="fresh-contact"><div className="section-wrap"><h2 className="mb-6">{c.cooking}</h2><div className="flex flex-wrap gap-3"><Link className="knop knop-navy" href={`/${locale}/assortiment/varlaks-zalm`}>{c.product}</Link><Link className="knop knop-lijn" href={`/${locale}/recepten/zalm-citroen-dille`}>{c.recipe}</Link><Link className="knop knop-lijn" href={`/${locale}/biologische-vis`}>{c.labels}</Link></div></div></section>
 </>;
}
