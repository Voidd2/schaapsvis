"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { recepten, receptBeeld, ALLE_TAGS, type ReceptTag } from "@/lib/recepten";
import { receptMinuten, receptVis } from "@/lib/recept-hulp";
import { ReceptFoto } from "@/components/recepten/ReceptFoto";
const vissoorten = [...new Set(recepten.map(receptVis))].sort();
export function ReceptenClient() {
  const [filter, setFilter] = useState<ReceptTag | null>(null);
  const [zoek, setZoek] = useState("");
  const [vis, setVis] = useState("");
  const [tijd, setTijd] = useState("");
  const [niveau, setNiveau] = useState("");
  const reset = () => { setFilter(null); setZoek(""); setVis(""); setTijd(""); setNiveau(""); };
  const zichtbaar = recepten.filter((r) =>
    (!filter || r.tags.includes(filter)) && (!vis || receptVis(r) === vis) &&
    (!tijd || receptMinuten(r.tijd) <= Number(tijd)) && (!niveau || r.moeilijkheid === niveau) &&
    [r.title, r.subtitle, ...r.vanSchaap].join(" ").toLowerCase().includes(zoek.toLowerCase().trim())
  ).sort((a,b) => Number(Boolean(b.fotoUrl)) - Number(Boolean(a.fotoUrl)));
  return <>
    <div className="recipe-filters">
      <label className="recipe-search"><Search size={20} aria-hidden /><span className="sr-only">Zoek een recept of ingrediënt</span><input type="search" value={zoek} onChange={e => setZoek(e.target.value)} placeholder="Waar heeft u zin in? Bijvoorbeeld zalm…" /></label>
      <div className="recipe-selects">
        <label>Vissoort<select value={vis} onChange={e => setVis(e.target.value)}><option value="">Alle vissoorten</option>{vissoorten.map(v => <option key={v}>{v}</option>)}</select></label>
        <label>Bereidingstijd<select value={tijd} onChange={e => setTijd(e.target.value)}><option value="">Alle tijden</option><option value="15">Tot 15 minuten</option><option value="20">Tot 20 minuten</option><option value="30">Tot 30 minuten</option><option value="45">Tot 45 minuten</option></select></label>
        <label>Moeilijkheid<select value={niveau} onChange={e => setNiveau(e.target.value)}><option value="">Elk niveau</option>{["Makkelijk","Gemiddeld","Uitdagend"].map(n => <option key={n}>{n}</option>)}</select></label>
      </div>
      <div className="recipe-tags"><button type="button" aria-pressed={!filter} onClick={()=>setFilter(null)}>Alle gerechten</button>{ALLE_TAGS.map(tag=><button type="button" key={tag} aria-pressed={filter===tag} onClick={()=>setFilter(filter===tag?null:tag)}>{tag}</button>)}</div>
    </div>
    <div className="flex justify-between items-center gap-4 my-7"><p role="status" aria-live="polite" className="text-sm">{zichtbaar.length} {zichtbaar.length===1?"recept":"recepten"} gevonden</p><button type="button" onClick={reset} className="underline text-sm underline-offset-4">Wis filters</button></div>
    {zichtbaar.length===0 ? <div className="recipe-empty"><h3>Geen gerecht gevonden</h3><p>Probeer een andere vissoort of geef uzelf iets meer tijd.</p><button type="button" className="knop knop-navy mt-5" onClick={reset}>Toon alle recepten</button></div> :
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">{zichtbaar.map(r=><li key={r.slug}><Link href={`/nl/recepten/${r.slug}`} className="recipe-card group"><ReceptFoto beeld={receptBeeld(r)} titel={r.title} klein /><div className="recipe-card-body"><p className="recipe-meta"><Clock size={15} aria-hidden />{r.tijd}<span>· {r.moeilijkheid}</span></p><h3>{r.title}</h3><p>{r.subtitle}</p><span className="recipe-card-link">Bekijk het recept <ArrowUpRight size={17} aria-hidden /></span></div></Link></li>)}</ul>}
  </>;
}
