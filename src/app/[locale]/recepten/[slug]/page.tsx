import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ReceptTools } from "@/components/recepten/ReceptTools";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";
import { Schema } from "@/components/Schema";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { receptDuur } from "@/lib/recept-hulp";
import { recepten } from "@/lib/recepten";
import { localizeRecipe, localizedRecipeImage } from "@/lib/recipe-localization";
import { recipeCopy, recipeLabel, recipeDifficultyNote } from "@/lib/recipe-copy";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { BEDRIJF } from "@/lib/bedrijf";
type Props={params:Promise<{slug:string;locale:string}>};
export function generateStaticParams(){return recepten.map(r=>({slug:r.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,locale}=await params,raw=recepten.find(r=>r.slug===slug);if(!raw)return {};
 const r=localizeRecipe(raw,locale);
 const meta=paginaMetadata({locale,pad:`/recepten/${slug}`,title:`${r.title} | Schaap’s Vis`,description:r.subtitle.slice(0,160),image:r.fotoUrl||"/og-image.png"});
 return {...meta,keywords:r.seoKeywords,openGraph:{...meta.openGraph,type:"article"}};
}
export default async function RecipeDetail({params}:Props){
 const {slug,locale}=await params,raw=recepten.find(r=>r.slug===slug);
 if(!raw)permanentRedirect(`/${locale}/recepten`);
 const r=localizeRecipe(raw,locale),c=recipeCopy(locale),image=localizedRecipeImage(r),contact=bestelContact(locale);
 const schema={"@context":"https://schema.org","@type":"Recipe",name:r.title,description:r.subtitle,image:r.fotoUrl?[`${BEDRIJF.domein}${r.fotoUrl}`]:undefined,recipeYield:r.porties?`${r.porties} ${c.people}`:undefined,totalTime:receptDuur(raw.tijd),inLanguage:locale==="en"?"en-GB":locale==="de"?"de-DE":"nl-NL",url:`${BEDRIJF.domein}/${locale}/recepten/${slug}`,recipeCategory:c.category,recipeCuisine:r.keuken??c.dutch,keywords:r.seoKeywords,recipeIngredient:[...r.vanSchaap,...r.vanSupermarkt],recipeInstructions:r.bereidingswijze.map((text,i)=>({"@type":"HowToStep",position:i+1,text})),author:{"@type":"Organization",name:BEDRIJF.naam,url:BEDRIJF.domein}};
 return <>
 <Schema data={[schema,kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.recipes,pad:"/recepten"},{naam:r.title,pad:`/recepten/${slug}`}])]} />
 <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.recipes,href:`/${locale}/recepten`},{naam:r.title}]} label={r.tags.map(t=>recipeLabel(t,locale)).join(" · ")} titel={r.title} intro={r.subtitle} feiten={[{label:c.time,waarde:r.tijd},{label:c.difficulty,waarde:recipeLabel(r.moeilijkheid,locale)},{label:c.cuisine,waarde:r.keuken??c.dutch},{label:r.porties?c.serves:c.season,waarde:r.porties?`${r.porties} ${c.people}`:r.seizoen??c.year}]} />
 <Sectie grond="papier"><ReceptTools items={[...r.vanSchaap,...r.vanSupermarkt]} locale={locale} />
 <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 lg:gap-16"><div>
 <div className="mb-10"><p className="kapitaal mb-2">{c.counter}</p><blockquote className="citaat">{r.verhaal}</blockquote></div>
 <h2 id="bereiding" className="text-[1.6rem] mb-6 scroll-mt-32">{c.method}</h2><p className="mb-6 text-sm leading-relaxed">{r.porties&&`${c.amounts} ${r.porties} ${c.people}. `}{c.timing}</p>
 <ol className="border-t border-sky-100">{r.bereidingswijze.map((step,i)=><li key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-4 border-b border-sky-100"><span className="text-xl" style={{color:"var(--navy)"}}>{i+1}</span><p className="leading-relaxed">{step}</p></li>)}</ol>
 <aside className="mt-8 rounded-xl p-5" style={{background:"var(--linen)"}}><h3 className="mb-2 text-lg">{c.safe}</h3><p className="text-sm leading-relaxed">{r.veiligheid??c.safety}</p><a className="inline-block mt-3 text-sm underline underline-offset-4" href="https://www.voedingscentrum.nl/nl/thema/5xveilig/vis.aspx" target="_blank" rel="noopener noreferrer">{c.source}</a><p className="mt-4 text-sm leading-relaxed">{c.pregnancy}</p><a className="inline-block mt-2 text-sm underline underline-offset-4" href="https://www.voedingscentrum.nl/encyclopedie/vis.aspx" target="_blank" rel="noopener noreferrer">{c.pregnancyLink}</a></aside>
 <p className="mt-8 text-sm"><span className="kapitaal">{recipeLabel(r.moeilijkheid,locale)}</span> {recipeDifficultyNote(r.moeilijkheid,locale)}</p>
 </div><div><ReceptFoto beeld={image} titel={r.title} /><div className="mb-8" />
 {r.hoofdproduct&&<Link className="inline-block mb-5 underline font-semibold" href={`/${locale}/assortiment/${r.hoofdproduct}`}>{c.more} →</Link>}
 <div className="pt-4" style={{borderTop:"2px solid var(--navy)"}}><p className="kapitaal mb-3">{c.shop}</p><ul className="mb-5">{r.vanSchaap.map(item=><li key={item} className="py-2 border-b border-sky-100">{item}</li>)}</ul><p className="text-sm mb-4">{c.checkAvailability}</p><a href={contact.href} className="knop knop-navy">{contact.label}</a></div>
 <div className="mt-10 pt-4 border-t-2 border-sky-100"><p className="kapitaal mb-3">{c.market}</p><ul>{r.vanSupermarkt.map(item=><li key={item} className="py-2 border-b border-sky-100">{item}</li>)}</ul></div>
 </div></div><Link href={`/${locale}/recepten`} className="inline-block mt-12 font-semibold underline underline-offset-4">← {c.back}</Link></Sectie>
 <PaginaSlot titel={c.slot} tekst={c.policy} knoppen={[{label:contact.label,href:contact.href,extern:true},{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:BEDRIJF.telefoon.weergave,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}]} />
 </>;
}
