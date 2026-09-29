import Image from "next/image";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts,getBlogPost } from "@/lib/blog";
import { localizeBlog } from "@/lib/blog-localization";
import { blogCopy,blogCategory } from "@/lib/blog-copy";
import { localizeRecipe } from "@/lib/recipe-localization";
import { recepten } from "@/lib/recepten";
import { paginaMetadata,kruimelSchema,vraagSchema } from "@/lib/seo";
import { bestelContact } from "@/lib/bestel-contact";
import { Schema } from "@/components/Schema";
import { Sectie,Vragen } from "@/components/ui/Sectie";
import { PaginaKop,PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF,VERKOOPPUNTEN } from "@/lib/bedrijf";
type Props={params:Promise<{slug:string;locale:string}>};
export function generateStaticParams(){return blogPosts.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,locale}=await params,raw=getBlogPost(slug);if(!raw)return {};
 const p=localizeBlog(raw,locale),meta=paginaMetadata({locale,pad:`/blog/${slug}`,title:p.title,description:p.excerpt.slice(0,160),image:p.fotoUrl});
 return {...meta,keywords:p.seoKeywords,openGraph:{...meta.openGraph,type:"article"}};
}
export default async function BlogDetail({params}:Props){
 const {slug,locale}=await params,raw=getBlogPost(slug);if(!raw)permanentRedirect(`/${locale}/blog`);
 const p=localizeBlog(raw,locale),c=blogCopy(locale),contact=bestelContact(locale),stall=p.regio==="Voorschoten"?VERKOOPPUNTEN.find(v=>v.id==="voorschoten"):undefined;
 const markets=(p.verkooppunten??[]).flatMap(id=>{const v=VERKOOPPUNTEN.find(v=>v.id===id);return v?[v]:[];});
 const related=(p.gerelateerdeRecepten??[]).flatMap(slug=>{const r=recepten.find(r=>r.slug===slug);return r?[localizeRecipe(r,locale)]:[];});
 const schema={"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.excerpt,image:[`${BEDRIJF.domein}${p.fotoUrl}`],datePublished:p.datum,dateModified:p.bijgewerkt??p.datum,mainEntityOfPage:`${BEDRIJF.domein}/${locale}/blog/${slug}`,inLanguage:locale==="en"?"en-GB":locale==="de"?"de-DE":"nl-NL",author:{"@type":"Organization",name:BEDRIJF.naam,url:BEDRIJF.domein},publisher:{"@type":"Organization",name:BEDRIJF.naam}};
 return <><Schema data={[schema,kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:c.blog,pad:"/blog"},{naam:p.title,pad:`/blog/${slug}`}])]} />{p.vragen?.length?<Schema data={vraagSchema(p.vragen)} />:null}
 <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.blog,href:`/${locale}/blog`},{naam:p.title}]} label={`${blogCategory(p.categorie,locale)} · ${p.datumLabel} · ${p.leestijd}`} titel={p.title} intro={p.excerpt} />
 <Sectie grond="papier" smal><p className="mb-5 text-sm">{c.by} <Link className="underline" href={`/${locale}/ons-verhaal`}>Schaap’s Vishandel</Link> · {c.since}</p>
 {stall&&<aside className="rounded-xl p-5 mb-8 border border-sky-100" style={{background:"var(--lichtblauw)"}}><p className="font-semibold mb-2">{c.friday}</p><p>{c.help} <Link className="underline font-semibold" href={`/${locale}/viswinkel-voorschoten`}>{c.location} →</Link></p></aside>}
 <Image src={p.fotoUrl} alt={p.fotoAlt} width={1400} height={933} sizes="(max-width: 800px) 100vw, 800px" className="article-photo mb-10" />
 {markets.length>0&&<section aria-labelledby="marktlocaties" className="mb-10"><p className="kapitaal mb-3">{c.findStall}</p><h2 id="marktlocaties" className="text-2xl mb-3 scroll-mt-32">{c.maps}</h2><p className="mb-6 leading-relaxed">{c.mapIntro}</p><div className="grid sm:grid-cols-2 gap-5">{markets.map(v=>{const saturday=v.id==="markt";const name=locale==="en"?(saturday?"Saturday market":"Wednesday market"):locale==="de"?(saturday?"Samstagsmarkt":"Mittwochsmarkt"):v.naam;const address=locale==="en"?(saturday?"Aalmarkt, near De Waag":"Botermarkt, near Dille & Kamille"):locale==="de"?(saturday?"Aalmarkt, bei De Waag":"Botermarkt, bei Dille & Kamille"):v.adres;const day=locale==="en"?(saturday?"Saturday":"Wednesday"):locale==="de"?(saturday?"Samstag":"Mittwoch"):(saturday?"Zaterdag":"Woensdag");return <article key={v.id} className="overflow-hidden rounded-2xl border border-sky-100" style={{background:"var(--lichtblauw)"}}><div className="p-5"><h3 className="text-xl mb-2">{name}</h3><p className="mb-2">{address}, {v.plaats}</p><p className="font-semibold mb-4">{day} 08:30–17:00</p><a href={v.mapsUrl} target="_blank" rel="noopener noreferrer" className="knop knop-navy">{c.openMaps} ↗</a></div></article>;})}</div><Link href={`/${locale}/marktkraam-leiden`} className="inline-block mt-5 underline underline-offset-4">{c.moreMarket} →</Link></section>}
 <nav aria-label={c.contents} className="recipe-checklist mb-10"><p className="kapitaal mb-3">{c.contents}</p><ul className="space-y-2">{p.secties.map((s,i)=>s.kop&&<li key={i}><a className="underline underline-offset-4" href={`#onderdeel-${i}`}>{s.kop}</a></li>)}</ul></nav>
 <div className="lees">{p.secties.map((s,i)=><div key={i} className={i>0?"mt-9":undefined}>{s.kop&&<h2 id={`onderdeel-${i}`} className="text-[1.5rem] mb-3 scroll-mt-32">{s.kop}</h2>}{s.alineas.map((a,j)=><p key={j}>{a}</p>)}</div>)}</div>
 {p.vragen?.length?<section className="mt-12"><h2 className="text-2xl mb-5">{c.faq}</h2><Vragen vragen={p.vragen} /></section>:null}
 {(related.length>0||p.gerelateerdeLinks?.length)?<div className="mt-12 pt-6" style={{borderTop:"2px solid var(--navy)"}}><p className="kapitaal mb-4">{c.readMore}</p><ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2">{related.map(r=><li key={r.slug}><Link href={`/${locale}/recepten/${r.slug}`} className="font-semibold underline underline-offset-4">{c.recipe}: {r.title} →</Link></li>)}{p.gerelateerdeLinks?.map(link=><li key={link.href}>{link.href.startsWith("http")?<a href={link.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">{link.label} ↗</a>:<Link href={`/${locale}${link.href}`} className="font-semibold underline underline-offset-4">{link.label} →</Link>}</li>)}</ul></div>:null}
 <Link href={`/${locale}/blog`} className="inline-block mt-10 font-semibold underline underline-offset-4">← {c.back}</Link></Sectie>
 <Sectie grond="zand" smal><h2 className="text-[1.6rem] mb-2">{c.news}</h2><p className="mb-6 leading-relaxed">{c.newsIntro}</p><a href={BEDRIJF.socials.facebook} className="knop knop-navy" target="_blank" rel="noopener noreferrer">{c.follow} ↗</a></Sectie>
 <PaginaSlot titel={stall?c.slotLocal:c.slot} tekst={c.policy} knoppen={[{label:contact.label,href:contact.href,extern:true},...(stall?[{label:c.route,href:stall.mapsUrl,extern:true,soort:"lijn" as const}]:[]),{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:c.hours,href:`/${locale}/bezoek-ons`,soort:"lijn"}]} />
 </>;
}
