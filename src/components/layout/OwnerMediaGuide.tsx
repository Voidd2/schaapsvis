"use client";
import { usePathname } from "next/navigation";
import { BEELD, type BeeldNaam } from "@/lib/beeld";

const slots: { id:string; title:string; at:string; format:string; routes:string[]; source?:BeeldNaam }[] = [
  { id:"VIDEO-01", title:"HIER KOMT EEN VIDEO VAN DE WINKEL", at:"Homepage, na de eerste kennismaking", format:"16:9 · 1920×1080 · 15–30 seconden · MP4 · geen automatisch geluid", routes:[""] },
  { id:"FOTO-02", title:"HISTORISCHE WINKEL OF FAMILIE", at:"Familieverhaal en historieartikel", format:"4:3 · liefst 1600 px breed · jaartal en namen bevestigen", routes:["","ons-verhaal","blog"], source:"historie1938" },
  { id:"FOTO-03", title:"ALDERT OF HET TEAM", at:"Ons verhaal, bij Vandaag", format:"4:3 · 1600×1200 · gezichten in het midden", routes:["ons-verhaal"], source:"historieNu" },
  { id:"FOTO-04", title:"GEVEL HERENSTRAAT", at:"Homepage hero en winkelinformatie", format:"4:3 · 2000×1500 · gevel en straat herkenbaar", routes:["","bezoek-ons","viswinkel-leiden"], source:"winkelGevel" },
  { id:"FOTO-05", title:"WOENSDAGMARKT LEIDEN", at:"Locatiekaart Botermarkt", format:"4:3 · 1600×1200 · kraam en omgeving", routes:["bezoek-ons","marktkraam-leiden"], source:"marktWoensdag" },
  { id:"FOTO-06", title:"ZATERDAGMARKT BIJ DE WAAG", at:"Locatiekaart Aalmarkt", format:"4:3 · 1600×1200 · De Waag herkenbaar", routes:["bezoek-ons","marktkraam-leiden"], source:"marktZaterdag" },
  { id:"FOTO-07", title:"VRIJDAGKRAAM VOORSCHOTEN", at:"Locatiekaart Hoogvliet", format:"4:3 · 1600×1200 · kraam en omgeving", routes:["bezoek-ons","viswinkel-voorschoten"], source:"marktVoorschoten" },
  { id:"BANNER-08", title:"EIGEN FEESTDAGENBEELD", at:"Feestdagen, bovenaan; bestaande productfoto’s blijven", format:"16:9 · 2400×1350 · hoofdonderwerp ook centraal in mobiele 4:3-uitsnede", routes:["feestdagen"] },
  { id:"SLIDESHOW-09", title:"OPTIONELE REEKS EIGEN LOCATIEBEELDEN", at:"Na de locatie-intro; handmatig bedienbaar", format:"3–5 beelden · 4:3 · 1600×1200 · locatie per foto vermelden", routes:["bezoek-ons"] },
];
/** The server supplies this only after validating the existing site-access cookie. */
export function OwnerMediaGuide() {
  const route = usePathname().split("/").slice(2)[0] ?? "";
  const current = slots.filter(s => s.routes.includes(route) && (!s.source || !BEELD[s.source].bestand));
  if (!current.length) return null;
  return <details className="site-container owner-media-guide my-4"><summary className="font-semibold text-sky-900">Beeldplan voor deze pagina · alleen besloten preview</summary><div className="grid gap-3 md:grid-cols-2 mt-3">{current.map(slot => <div key={slot.id} className="border border-dashed border-sky-400 rounded-lg bg-sky-50 p-4"><strong>{slot.id} — {slot.title}</strong><p className="text-sm mt-2">{slot.at}</p><p className="text-sm">{slot.format}</p></div>)}</div></details>;
}
