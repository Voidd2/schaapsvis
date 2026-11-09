"use client";

import Image from "next/image";
import { useState } from "react";

export function VarlaksFilm({ locale, poster }: { locale: string; poster?: string }) {
  const [play, setPlay] = useState(false);
  const copy = {
    en: { label: "Watch the VÅRLAKS brand film", note: "Vimeo loads only after you press play.", link: "Open film on Vimeo" },
    de: { label: "VÅRLAKS-Markenfilm ansehen", note: "Vimeo wird erst nach dem Klick geladen.", link: "Film auf Vimeo öffnen" },
    nl: { label: "Bekijk de VÅRLAKS-presentatiefilm", note: "Vimeo wordt pas geladen als u op afspelen klikt.", link: "Open film op Vimeo" },
  };
  const c = copy[locale as keyof typeof copy] ?? copy.nl;

  return (
    <div>
      <div className="supplier-film">
        {play ? (
          <iframe src="https://player.vimeo.com/video/932791452?autoplay=1&dnt=1" title={c.label} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlay(true)}>
            {poster && <Image src={poster} width={600} height={600} sizes="(max-width: 760px) 100vw, 50vw" alt="" />}
            <span className="text-5xl" aria-hidden="true">▷</span>
            <span className="text-xl font-semibold">{c.label}</span>
            <span className="text-sm">{c.note}</span>
          </button>
        )}
      </div>
      <a href="https://vimeo.com/932791452" target="_blank" rel="noopener noreferrer" className="inline-block text-sm underline mt-3">{c.link} ↗</a>
    </div>
  );
}
