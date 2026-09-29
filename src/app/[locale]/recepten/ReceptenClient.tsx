"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import type { ReceptTag } from "@/lib/recepten";
import type { LocalizedRecipe } from "@/lib/recipe-localization";
import { recipeCopy, recipeLabel } from "@/lib/recipe-copy";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";
const ALLE_TAGS: ReceptTag[] = ["Snel", "Met de kids", "Zomers", "Bijzonder", "Makkelijk", "Gezond"];
export function ReceptenClient({items,locale}:{items:LocalizedRecipe[];locale:string}) {
 const c=recipeCopy(locale),fishTypes=[...new Set(items.map(r=>r.fishType))].sort();
 const [filter,setFilter]=useState<ReceptTag|null>(null),[search,setSearch]=useState(""),[fish,setFish]=useState(""),[time,setTime]=useState(""),[level,setLevel]=useState("");
 const reset=()=>{setFilter(null);setSearch("");setFish("");setTime("");setLevel("");};
 const visible=items.filter(r=>(!filter||r.tags.includes(filter))&&(!fish||r.fishType===fish)&&(!time||r.minutes<=Number(time))&&(!level||r.moeilijkheid===level)&&[r.title,r.subtitle,...r.vanSchaap].join(" ").toLowerCase().includes(search.toLowerCase().trim()));
 return <><div className="recipe-filters">
 <label className="recipe-search"><Search size={20} aria-hidden /><span className="sr-only">{c.search}</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={c.placeholder} /></label>
 <div className="recipe-selects"><label>{c.fish}<select value={fish} onChange={e=>setFish(e.target.value)}><option value="">{c.allFish}</option>{fishTypes.map(f=><option key={f}>{f}</option>)}</select></label><label>{c.duration}<select value={time} onChange={e=>setTime(e.target.value)}><option value="">{c.allTime}</option>{[15,20,30,45].map(t=><option key={t} value={t}>{c.upTo} {t} {c.minutes}</option>)}</select></label><label>{c.difficulty}<select value={level} onChange={e=>setLevel(e.target.value)}><option value="">{c.allLevels}</option>{["Makkelijk","Gemiddeld","Uitdagend"].map(n=><option key={n} value={n}>{recipeLabel(n,locale)}</option>)}</select></label></div>
 <div className="recipe-tags"><button type="button" aria-pressed={!filter} onClick={()=>setFilter(null)}>{c.allDishes}</button>{ALLE_TAGS.map(tag=><button type="button" key={tag} aria-pressed={filter===tag} onClick={()=>setFilter(filter===tag?null:tag)}>{recipeLabel(tag,locale)}</button>)}</div></div>
 <div className="flex justify-between items-center gap-4 my-7"><p role="status" aria-live="polite" className="text-sm">{visible.length} {c.recipes.toLowerCase()} {c.found}</p><button type="button" onClick={reset} className="underline text-sm underline-offset-4">{c.clear}</button></div>
 {visible.length===0?<div className="recipe-empty"><h3>{c.empty}</h3><p>{c.try}</p><button type="button" className="knop knop-navy mt-5" onClick={reset}>{c.showAll}</button></div>:<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">{visible.map(r=><li key={r.slug}><Link href={`/${locale}/recepten/${r.slug}`} className="recipe-card group"><ReceptFoto beeld={{src:r.fotoUrl,alt:r.fotoLabel}} titel={r.title} klein /><div className="recipe-card-body"><p className="recipe-meta"><Clock size={15} aria-hidden />{r.tijd}<span>· {recipeLabel(r.moeilijkheid,locale)}</span></p><h3>{r.title}</h3><p>{r.subtitle}</p><span className="recipe-card-link">{c.view} <ArrowUpRight size={17} aria-hidden /></span></div></Link></li>)}</ul>}
 </>;
}
