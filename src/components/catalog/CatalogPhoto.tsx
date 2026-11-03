"use client";
import Image from "next/image";
import { useRef } from "react";
import { useInteractive } from "@/lib/use-interactive";
import { platterPresentation } from "@/lib/platter-presentation";

export function CatalogPhoto({ src, alt, name, locale, platter }: { src: string; alt: string; name: string; locale: string; platter: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null), ready = useInteractive(), t = platterPresentation(locale);
  const open = locale === "en" ? "Enlarge photo" : locale === "de" ? "Foto vergrößern" : "Vergroot foto";
  const close = locale === "en" ? "Close" : locale === "de" ? "Schließen" : "Sluiten";
  return <>
    <button type="button" className="seafood-photo" aria-label={`${open}: ${name}`} disabled={!ready} onClick={() => dialog.current?.showModal()}>
      <Image src={src} alt={alt} width={900} height={675} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      <span>{platter ? t.photoLabel : open} <span aria-hidden="true"> ⌕</span></span>
    </button>
    <dialog ref={dialog} className="catalog-photo-dialog" aria-label={name} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button type="button" className="catalog-photo-close" onClick={() => dialog.current?.close()}>{close} ×</button>
      <Image src={src} alt={alt} width={1200} height={900} sizes="90vw" />
      <h2>{name}</h2>{platter && <p><strong>{t.photoLabel}</strong><br />{t.photoText}</p>}
    </dialog>
  </>;
}
