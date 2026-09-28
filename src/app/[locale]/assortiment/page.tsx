import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Schema } from "@/components/Schema";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { gesorteerdAssortiment } from "@/lib/assortiment-volgorde";
import { AssortimentFilter } from "./AssortimentFilter";
const copy={
 nl:{label:"Van onze toonbank",title:"Goede vis.\nVolop keuze.",intro:"Van verse zalm tot Hollandse haring en krokante kibbeling. Ontdek ons assortiment, met onze favorieten vooraan.",platter:"Visschaal samenstellen",contact:"Neem contact op",question:"Zoekt u iets bijzonders?",note:"Neem contact met ons op voor uw bestelling. Dan kijken we samen wat mogelijk is. Alleen visschalen kunt u online bestellen.",image:"Verse zalm op een schaal — AI-sfeerbeeld"},
 en:{label:"From our fish counter",title:"Great fish.\nPlenty of choice.",intro:"From fresh salmon to Dutch herring and crispy kibbeling. Explore our range, with our favourites first.",platter:"Create a seafood platter",contact:"Contact us",question:"Looking for something special?",note:"Contact us to discuss your order and availability. Only seafood platters can be ordered online.",image:"Fresh salmon on a plate — AI illustration"},
 de:{label:"Aus unserer Fischtheke",title:"Guter Fisch.\nGroße Auswahl.",intro:"Von frischem Lachs bis zu holländischem Hering und knusprigem Kibbeling. Entdecken Sie unser Sortiment, mit unseren Favoriten zuerst.",platter:"Fischplatte zusammenstellen",contact:"Kontakt aufnehmen",question:"Suchen Sie etwas Besonderes?",note:"Kontaktieren Sie uns für Ihre Bestellung. Gemeinsam schauen wir, was möglich ist. Nur Fischplatten können Sie online bestellen.",image:"Frischer Lachs auf einem Teller — KI-Stimmungsbild"}
};
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params; const t=await getTranslations({locale,namespace:"meta"});
 return paginaMetadata({locale,pad:"/assortiment",title:t("assortimentTitle"),description:t("assortimentDesc")});
}
export default async function AssortimentPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params; const c=copy[locale as keyof typeof copy]||copy.nl;
 return <>
 <Schema data={{"@context":"https://schema.org","@type":"ItemList",name:`Assortiment ${BEDRIJF.naam}`,numberOfItems:gesorteerdAssortiment.length,itemListElement:gesorteerdAssortiment.map((p,i)=>({"@type":"ListItem",position:i+1,name:p.naam,url:`${BEDRIJF.domein}/${locale}/assortiment/${p.slug}`}))}}/>
 <header className="fresh-hero"><div className="section-wrap fresh-hero-grid"><div><p className="kapitaal">{c.label}</p><h1>{c.title}</h1><p className="fresh-intro">{c.intro}</p><div className="flex flex-wrap gap-3 mt-7"><Link className="knop knop-rood" href={`/${locale}/visschalen`}>{c.platter}</Link><Link className="knop knop-lijn" href={`/${locale}/contact`}>{c.contact}</Link></div></div><figure><Image width={1400} height={933} sizes="(max-width: 800px) 100vw, 50vw" src="/images/editorial/zalm.webp" alt={c.image} fetchPriority="high"/><figcaption>{locale==="nl"?"Sfeerbeeld · illustratief":locale==="de"?"Stimmungsbild · Illustration":"Illustrative image"}</figcaption></figure></div></header>
 <div className="section-wrap catalog-notice"><p>{c.note}</p></div>
 <AssortimentFilter/>
 <section className="fresh-contact"><div className="section-wrap"><h2>{c.question}</h2><p>{c.note}</p><Link className="knop knop-rood mt-5" href={`/${locale}/contact`}>{c.contact} ↗</Link></div></section>
 </>;
}
