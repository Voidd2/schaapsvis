"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";
import { gesorteerdAssortiment } from "@/lib/assortiment-volgorde";
import { matchesQuery } from "@/lib/search";
const copy = {
 nl: {all:"Alles",search:"Zoek uw favoriete vis…",popular:"Favorieten eerst",az:"Naam A–Z",detail:"Bekijk product",count:"producten",empty:"Geen producten gevonden.",categories:["Verse vis","Gerookte vis","Schaal- & schelpdieren","Vissalades","Bereid & snacks"]},
 en: {all:"All",search:"Find your favourite fish…",popular:"Favourites first",az:"Name A–Z",detail:"View product",count:"products",empty:"No products found.",categories:["Fresh fish","Smoked fish","Shellfish","Fish salads","Prepared & snacks"]},
 de: {all:"Alle",search:"Finden Sie Ihren Lieblingsfisch…",popular:"Favoriten zuerst",az:"Name A–Z",detail:"Produkt ansehen",count:"Produkte",empty:"Keine Produkte gefunden.",categories:["Frischer Fisch","Räucherfisch","Schalentiere","Fischsalate","Zubereitet & Snacks"]}
};
const categories = Object.keys(CATEGORIE_LABELS) as Categorie[];
export function AssortimentFilter() {
 const locale=useLocale(); const c=copy[locale as keyof typeof copy]||copy.nl;
 const [category,setCategory]=useState("all"); const [query,setQuery]=useState(""); const [sort,setSort]=useState("popular");
 const found=gesorteerdAssortiment.filter(p=>(category==="all"||p.categorie===category)&&(!query||matchesQuery(p,query)));
 if(sort==="az") found.sort((a,b)=>a.naam.localeCompare(b.naam,locale));
 return <section className="catalog section-wrap">
 <div className="catalog-tabs" role="group" aria-label={c.all}>{["all",...categories].map((id,i)=><button key={id} onClick={()=>setCategory(id)} aria-pressed={category===id} className={category===id?"active":""}>{i===0?c.all:c.categories[i-1]}</button>)}</div>
 <div className="catalog-tools"><label className="catalog-search"><span className="sr-only">{c.search}</span><input type="search" placeholder={c.search} value={query} onChange={e=>setQuery(e.target.value)}/></label><label><span className="sr-only">{c.popular}</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">{c.popular}</option><option value="az">{c.az}</option></select></label></div>
 <p className="catalog-count" role="status">{found.length} {c.count}</p>
 <div className="catalog-grid">{found.map(p=>{
 const salmon=["varlaks-zalm","zalmfilet"].includes(p.slug);
 const illustration=salmon||p.slug==="kibbeling";
 const photo=salmon?"/images/editorial/zalm.webp":p.slug==="kibbeling"?"/images/editorial/kibbeling.webp":p.photo;
 return <Link href={`/${locale}/assortiment/${p.slug}`} key={p.slug} className={`catalog-card ${photo?"with-photo":"compact"}`}>
 {photo&&<div className="catalog-photo"><Image width={600} height={400} sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw" src={photo} alt={illustration?p.naam+" — AI-sfeerbeeld":p.naam} loading="lazy" className={illustration?"editorial":""}/></div>}
 <div className="catalog-card-copy"><p className="catalog-category">{c.categories[categories.indexOf(p.categorie)]}</p><h2>{p.naam}</h2>{locale==="nl"&&<p className="catalog-description">{p.desc}</p>}<span className="catalog-detail">{c.detail} <span aria-hidden="true">↗</span></span></div></Link>;
 })}</div>{!found.length&&<p className="py-14 text-center">{c.empty}</p>}
 </section>;
}
