import type { Metadata } from "next";
import { Schema } from "@/components/Schema";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { ReceptenClient } from "./ReceptenClient";
import { bestelContact } from "@/lib/bestel-contact";
import { paginaMetadata } from "@/lib/seo";
import { recepten } from "@/lib/recepten";
import { localizeRecipe } from "@/lib/recipe-localization";
import { recipeCopy } from "@/lib/recipe-copy";
import { BEDRIJF } from "@/lib/bedrijf";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params,c=recipeCopy(locale);return paginaMetadata({locale,pad:"/recepten",title:c.metaTitle,description:c.metaDescription});}
export default async function RecipeIndex({params}:Props){
 const {locale}=await params,c=recipeCopy(locale),items=recepten.map(r=>localizeRecipe(r,locale)),contact=bestelContact(locale);
 return <><Schema data={{"@context":"https://schema.org","@type":"ItemList",name:c.recipes,itemListElement:items.map((r,i)=>({"@type":"ListItem",position:i+1,url:`${BEDRIJF.domein}/${locale}/recepten/${r.slug}`,name:r.title}))}} />
 <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.recipes}]} label={c.cook} titel={c.headline} intro={`${items.length} ${c.intro}`} knoppen={[{label:contact.label,href:contact.href,extern:true},{label:c.calendar,href:`/${locale}/viskalender`,soort:"lijn"}]} feiten={[{label:c.recipes,waarde:String(items.length)},{label:c.fastest,waarde:`5 ${c.minutes}`},{label:c.fish,waarde:c.ourCounter}]} />
 <Sectie grond="papier"><Kop label={c.find} titel={c.back} intro={c.findIntro} /><ReceptenClient items={items} locale={locale} /></Sectie>
 <Sectie grond="zand" smal><Kop titel={c.origin} /><p className="lees">{c.inspired} <a href="https://visrecepten.nl" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">visrecepten.nl</a>. {c.adapted}</p></Sectie>
 <PaginaSlot titel={c.slot} tekst={c.policy} knoppen={[{label:contact.label,href:contact.href,extern:true},{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:c.hours,href:`/${locale}/bezoek-ons`,soort:"lijn"}]} />
 </>;
}
