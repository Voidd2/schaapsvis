"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type SelectieGalerijKaart = {
  slug: string;
  naam: string;
  foto: string;
  fotoBijschrift: string;
  beschrijving: string;
  prijsTekst?: string;
  whatsappHref: string;
  whatsappLabel: string;
  detailsHref?: string;
  detailsLabel?: string;
};

type GalerijTekst = {
  open: string;
  close: string;
  previous: string;
  next: string;
  counter: string;
};

export function SelectieGalerij({ kaarten, tekst }: { kaarten: SelectieGalerijKaart[]; tekst: GalerijTekst }) {
  const [actief, setActief] = useState<number | null>(null);
  const titelId = useId();
  const beschrijvingId = useId();
  const sluitKnop = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialoog = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const sluiten = useCallback(() => {
    setActief(null);
  }, []);

  const vorige = useCallback(() => {
    setActief((huidig) => huidig === null ? huidig : (huidig - 1 + kaarten.length) % kaarten.length);
  }, [kaarten.length]);

  const volgende = useCallback(() => {
    setActief((huidig) => huidig === null ? huidig : (huidig + 1) % kaarten.length);
  }, [kaarten.length]);

  const isOpen = actief !== null;

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        wasOpen.current = false;
        requestAnimationFrame(() => opener.current?.focus());
      }
      return;
    }
    wasOpen.current = true;
    const oudeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sluitKnop.current?.focus();

    const toetsen = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        sluiten();
        window.setTimeout(() => opener.current?.focus(), 0);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        vorige();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        volgende();
      }
      if (event.key === "Tab") {
        const knoppen = dialoog.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (!knoppen?.length) return;
        const eerste = knoppen[0];
        const laatste = knoppen[knoppen.length - 1];
        if (event.shiftKey && document.activeElement === eerste) {
          event.preventDefault();
          laatste.focus();
        } else if (!event.shiftKey && document.activeElement === laatste) {
          event.preventDefault();
          eerste.focus();
        }
      }
    };
    document.addEventListener("keydown", toetsen);
    return () => {
      document.removeEventListener("keydown", toetsen);
      document.body.style.overflow = oudeOverflow;
    };
  }, [isOpen, sluiten, vorige, volgende]);

  const actieveIndex = actief ?? 0;
  const kaart = actief === null ? null : kaarten[actief];

  return <>
    <ul className="selection-request-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {kaarten.map((item, index) => <li id={item.slug} key={item.slug} className="flex flex-col overflow-hidden rounded-lg border border-[#d9e7ee] bg-white">
        <figure>
          <button
            type="button"
            className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#f2f8fb] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
            aria-label={`${tekst.open}: ${item.naam}`}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActief(index);
            }}
          >
            <Image src={item.foto} alt={item.naam} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
            <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-[#004f70] shadow-md">
              <span aria-hidden="true">⌕</span> {tekst.open}
            </span>
          </button>
          <figcaption className="px-5 py-2 text-xs text-[#547080]">{item.fotoBijschrift}</figcaption>
        </figure>
        <div className="flex flex-1 flex-col p-5 pt-3">
          <h3 className="mb-2 text-[1.25rem]">{item.naam}</h3>
          {item.prijsTekst && <p className="mb-5 text-[#4d6370]">{item.prijsTekst}</p>}
          <div className="mt-auto grid gap-2">
            {item.detailsHref && item.detailsLabel && <Link className="knop knop-lijn" href={item.detailsHref}>{item.detailsLabel}</Link>}
            <a className="knop knop-rood" target="_blank" rel="noopener noreferrer" href={item.whatsappHref}>{item.whatsappLabel}</a>
          </div>
        </div>
      </li>)}
    </ul>

    {kaart && <div
      ref={dialoog}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001f2f]/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titelId}
      aria-describedby={beschrijvingId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) sluiten();
      }}
    >
      <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-sky-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <p className="text-sm font-semibold text-[#547080]" aria-live="polite">
            {tekst.counter.replace("{current}", String(actieveIndex + 1)).replace("{total}", String(kaarten.length))}
          </p>
          <button ref={sluitKnop} type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-200 px-4 py-2 font-semibold text-[#004f70] hover:bg-sky-50" onClick={sluiten}>
            <span aria-hidden="true" className="text-2xl leading-none">×</span> {tekst.close}
          </button>
        </div>

        <div className="p-3 sm:p-6">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-xl bg-[#eef6f9]">
            <Image src={kaart.foto} alt={kaart.naam} fill sizes="(max-width: 768px) 100vw, 1100px" className="object-contain" />
            {kaarten.length > 1 && <>
              <button type="button" className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-3xl text-[#004f70] shadow-lg hover:bg-white sm:left-4" aria-label={tekst.previous} onClick={vorige}>
                <span aria-hidden="true">‹</span>
              </button>
              <button type="button" className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-3xl text-[#004f70] shadow-lg hover:bg-white sm:right-4" aria-label={tekst.next} onClick={volgende}>
                <span aria-hidden="true">›</span>
              </button>
            </>}
          </div>
          <div className="mx-auto max-w-5xl px-1 pb-2 pt-5 sm:px-2">
            <h2 id={titelId} className="text-2xl sm:text-3xl">{kaart.naam}</h2>
            <p id={beschrijvingId} className="mt-2 max-w-3xl text-base leading-7 text-[#4d6370]">{kaart.beschrijving}</p>
          </div>
        </div>
      </div>
    </div>}
  </>;
}
