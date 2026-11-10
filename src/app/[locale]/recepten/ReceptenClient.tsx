"use client";
import { PageLinks } from "@/components/PageLinks";
import { PAGE_SIZE } from "@/lib/list-page";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInteractive } from "@/lib/use-interactive";
import { useState } from "react";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import type { ReceptTag } from "@/lib/recepten";
import type { LocalizedRecipe } from "@/lib/recipe-localization";
import { recipeCopy, recipeLabel } from "@/lib/recipe-copy";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";
const ALLE_TAGS: ReceptTag[] = ["Snel", "Met de kids", "Zomers", "Bijzonder", "Makkelijk", "Gezond"];
export function ReceptenClient({items,locale,page,last}:{items:LocalizedRecipe[];locale:string;page:number;last:number}) {
 const c=recipeCopy(locale);
 const interactive = useInteractive();
 const fishTypes = [...new Set(items.map(r => r.fishType))]
   .map(type => ({ type, label: recipeLabel(type, locale) }))
   .sort((a, b) => a.label.localeCompare(b.label, locale));
 const requestedFish = useSearchParams().get("vis");
 const fish = fishTypes.find(({type}) => type.toLowerCase() === requestedFish)?.type ?? "";
 function setFish(type: string) {
   const url = new URL(window.location.href);
   if (type) url.searchParams.set("vis", type.toLowerCase());
   else url.searchParams.delete("vis");
   window.history.replaceState(null, "", url.pathname + url.search + url.hash);
 }
 const [filter,setFilter]=useState<ReceptTag|null>(null),[search,setSearch]=useState(""),[time,setTime]=useState(""),[level,setLevel]=useState("");
 const reset=()=>{setFilter(null);setSearch("");setFish("");setTime("");setLevel("");};
 const visible=items.filter(r=>(!filter||r.tags.includes(filter))&&(!fish||r.fishType===fish)&&(!time||r.minutes<=Number(time))&&(!level||r.moeilijkheid===level)&&[r.title,r.subtitle,...r.vanSchaap].join(" ").toLowerCase().includes(search.toLowerCase().trim()));
 const filtered=Boolean(filter||fish||time||level||search.trim());
 const shown=filtered?visible:visible.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 return <><div id="recipe-filters" className="recipe-filters scroll-mt-32">
 <label className="recipe-search"><Search size={20} aria-hidden /><span className="sr-only">{c.search}</span><input type="search" disabled={!interactive} value={search} onChange={e=>setSearch(e.target.value)} placeholder={c.placeholder} /></label>
 <div className="recipe-selects"><label>{c.fish}<select disabled={!interactive} value={fish} onChange={e=>setFish(e.target.value)}><option value="">{c.allFish}</option>{fishTypes.map(({type,label})=><option key={type} value={type}>{label}</option>)}</select></label><label>{c.duration}<select disabled={!interactive} value={time} onChange={e=>setTime(e.target.value)}><option value="">{c.allTime}</option>{[15,20,30,45].map(t=><option key={t} value={t}>{c.upTo} {t} {c.minutes}</option>)}</select></label><label>{c.difficulty}<select disabled={!interactive} value={level} onChange={e=>setLevel(e.target.value)}><option value="">{c.allLevels}</option>{["Makkelijk","Gemiddeld","Uitdagend"].map(n=><option key={n} value={n}>{recipeLabel(n,locale)}</option>)}</select></label></div>
 <div className="recipe-tags"><button type="button" disabled={!interactive} aria-pressed={!filter} onClick={()=>setFilter(null)}>{c.allDishes}</button>{ALLE_TAGS.map(tag=><button type="button" disabled={!interactive} key={tag} aria-pressed={filter===tag} onClick={()=>setFilter(filter===tag?null:tag)}>{recipeLabel(tag,locale)}</button>)}</div></div>
 <div className="flex justify-between items-center gap-4 my-7"><p role="status" aria-live="polite" className="text-sm">{visible.length} {c.recipes.toLowerCase()} {c.found}</p><button type="button" disabled={!interactive} onClick={reset} className="underline text-sm underline-offset-4">{c.clear}</button></div>
 {visible.length===0?<div className="recipe-empty"><h3>{c.empty}</h3><p>{c.try}</p><button type="button" disabled={!interactive} className="knop knop-navy mt-5" onClick={reset}>{c.showAll}</button></div>:<ul id="lijst" className="scroll-mt-32 recipe-result-grid grid gap-5 sm:gap-7">{shown.map(r=><li key={r.slug}><Link href={`/${locale}/recepten/${r.slug}`} className="recipe-card group"><ReceptFoto beeld={{src:r.fotoUrl,alt:r.fotoLabel}} titel={r.title} klein /><div className="recipe-card-body"><p className="recipe-meta"><Clock size={15} aria-hidden />{r.tijd}<span>· {recipeLabel(r.moeilijkheid,locale)}</span></p><h3>{r.title}</h3><p>{r.subtitle}</p><span className="recipe-card-link">{c.view} <ArrowUpRight size={17} aria-hidden /></span></div></Link></li>)}</ul>}
 {!filtered && <PageLinks path={`/${locale}/recepten`} page={page} last={last} locale={locale} />}
 </>;
}

