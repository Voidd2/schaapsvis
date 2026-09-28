"use client";
import { useState } from "react";
export function VarlaksFilm({locale}:{locale:string}) {
 const [play,setPlay]=useState(false);
 const label=locale==="en"?"Watch the VÅRLAKS brand film":locale==="de"?"VÅRLAKS-Markenfilm ansehen":"Bekijk de VÅRLAKS-presentatiefilm";
 return <div><div className="supplier-film">{play?<iframe src="https://player.vimeo.com/video/932791452?autoplay=1&dnt=1" title={label} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>:<button onClick={()=>setPlay(true)}><span className="text-5xl" aria-hidden="true">▷</span><span className="text-xl font-semibold">{label}</span><span className="text-sm">{locale==="nl"?"Vimeo wordt pas geladen als u op afspelen klikt.":locale==="de"?"Vimeo wird erst nach dem Klick geladen.":"Vimeo loads only after you press play."}</span></button>}</div><a href="https://vimeo.com/932791452" target="_blank" rel="noopener noreferrer" className="inline-block text-sm underline mt-3">{locale==="nl"?"Open film op Vimeo":locale==="de"?"Film auf Vimeo öffnen":"Open film on Vimeo"} ↗</a></div>;
}
