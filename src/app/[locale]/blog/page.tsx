import { PAGE_SIZE, pagePath, listPage } from "@/lib/list-page";
import { PageLinks } from "@/components/PageLinks";
import Link from "next/link";
import { StaticResponsiveImage as Image } from "@/components/StaticResponsiveImage";
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
type Props={params:Promise<{locale:string}>;searchParams:Promise<{pagina?:string|string[]}>};
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{const {locale}=await params,c=blogCopy(locale);const {page}=listPage((await searchParams).pagina,blogPostsGesorteerd.length);return paginaMetadata({locale,pad:pagePath("/blog",page),title:page===1?c.metaTitle:c.metaTitle+" · "+page,description:c.metaDescription});}
export default async function BlogIndex({params,searchParams}:Props){
 const {locale}=await params,c=blogCopy(locale),posts=blogPostsGesorteerd.map(p=>localizeBlog(p,locale)),contact=bestelContact(locale);
 const {page,last}=listPage((await searchParams).pagina,blogPostsGesorteerd.length);
 return <><Schema data={{"@context":"https://schema.org","@type":"ItemList",name:c.blog,itemListElement:posts.map((p,i)=>({"@type":"ListItem",position:i+1,url:`${BEDRIJF.domein}/${locale}/blog/${p.slug}`,name:p.title}))}} />
 <PaginaKop kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:c.blog}]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{label:c.calendar,href:`/${locale}/viskalender`},{label:contact.label,href:contact.href,extern:true,soort:"lijn"}]} feiten={[{label:c.articles,waarde:String(posts.length)},{label:c.topics,waarde:c.topicsValue},{label:c.language,waarde:c.languageValue}]} />
 <Sectie grond="papier"><Kop label={c.overview} titel={c.knowledge} intro={c.knowledgeIntro} /><ul id="lijst" className="scroll-mt-32 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">{posts.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE).map(p=><li key={p.slug}><Link href={`/${locale}/blog/${p.slug}`} className="recipe-card group">
 {p.fotoUrl ? <Image src={p.fotoUrl} alt={p.fotoAlt} width={1400} height={933} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="w-full aspect-[3/2] object-cover" /> : <div className="aspect-[3/2] flex items-center justify-center bg-sky-50 font-display text-4xl text-sky-900">Schaap’s · 1938</div>}<div className="recipe-card-body"><p className="kapitaal mb-1">{blogCategory(p.categorie,locale)}</p><p className="text-sm">{p.datumLabel} · {p.leestijd}</p><h2 className="text-[1.35rem] leading-snug mb-2 group-hover:underline underline-offset-4">{p.title}</h2><p className="lees">{p.excerpt}</p></div></Link></li>)}</ul><PageLinks path={`/${locale}/blog`} page={page} last={last} locale={locale} /></Sectie>
 <Sectie grond="zand" smal><Kop label={c.interactive} titel={c.calendarTitle} intro={c.calendarIntro} /><Link href={`/${locale}/viskalender`} className="knop knop-navy">{c.calendar}</Link></Sectie>
 <PaginaSlot titel={c.slot} tekst={c.policy} knoppen={[{label:contact.label,href:contact.href,extern:true},{label:c.platter,href:`/${locale}/visschalen`,soort:"lijn"},{label:c.range,href:`/${locale}/assortiment`,soort:"lijn"}]} />
 </>;
}
