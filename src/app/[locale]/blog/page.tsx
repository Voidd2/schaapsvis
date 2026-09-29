import Link from "next/link";
import type { Metadata } from "next";
import { bestelContact } from "@/lib/bestel-contact";
import { blogPostsGesorteerd } from "@/lib/blog";
import { localizeBlog } from "@/lib/blog-localization";
import { blogCopy,blogCategory } from "@/lib/blog-copy";
import { Sectie,Kop } from "@/components/ui/Sectie";
import { PaginaKop,PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { Schema } from "@/components/Schema";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params,c=blogCopy(locale);return paginaMetadata({locale,pad:"/blog",title:c.metaTitle,description:c.metaDescription});}
export default async function BlogIndex({params}:Props){
 const {locale}=await params,c=blogCopy(locale),posts=blogPostsGesorteerd.map(p=>localizeBlog(p,locale)),contact=bestelContact(locale);
 return <><Schema data={{"@context":"https://schema.org","@type":"ItemList",name:c.blog,itemListElement:posts.map((p,i)=>({"@type":"ListItem",position:i+1,url:`${BEDRIJF.domein}/${locale}/blog/${p.slug}`,name:p.title}))}} />
 <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.blog}]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{label:c.calendar,href:`/${locale}/viskalender`},{label:contact.label,href:contact.href,extern:true,soort:"lijn"}]} feiten={[{label:c.articles,waarde:String(posts.length)},{label:c.topics,waarde:c.topicsValue},{label:c.language,waarde:c.languageValue}]} />
 <Sectie grond="papier"><Kop label={c.overview} titel={c.knowledge} intro={c.knowledgeIntro} /><ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">{posts.map(p=><li key={p.slug}><Link href={`/${locale}/blog/${p.slug}`} className="recipe-card group">
 {/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.fotoUrl} alt={p.fotoAlt} width={1400} height={933} loading="lazy" className="w-full aspect-[3/2] object-cover" /><div className="recipe-card-body"><p className="kapitaal mb-1">{blogCategory(p.categorie,locale)}</p><p className="text-sm">{p.datumLabel} · {p.leestijd}</p><h2 className="text-[1.35rem] leading-snug mb-2 group-hover:underline underline-offset-4">{p.title}</h2><p className="lees">{p.excerpt}</p></div></Link></li>)}</ul></Sectie>
 <Sectie grond="zand" smal><Kop label={c.interactive} titel={c.calendarTitle} intro={c.calendarIntro} /><Link href={`/${locale}/viskalender`} className="knop knop-navy">{c.calendar}</Link></Sectie>
 <PaginaSlot titel={c.slot} tekst={c.policy} knoppen={[{label:contact.label,href:contact.href,extern:true},{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:c.range,href:`/${locale}/assortiment`,soort:"lijn"}]} />
 </>;
}
