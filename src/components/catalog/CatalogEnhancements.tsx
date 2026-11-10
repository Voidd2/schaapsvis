import type { ComponentProps } from "react";
import { BedieningSlot } from "./BedieningSlot";
import { ComposerSlot } from "./NativeComposer";
import { CatalogPhoto as Photo } from "./CatalogPhoto";
import Link from "next/link";
import { gourmetOrderHref } from "@/lib/gourmet-pricing";
import { PlatterInquiry as Inquiry } from "../PlatterInquiry";
import { StaticResponsiveImage } from "../StaticResponsiveImage";
import { platterPresentation } from "@/lib/platter-presentation";
import { gourmetRequestCopy } from "@/lib/gourmet-request";

// The catalogue, photos and contact links are useful without these optional JS modules.
export function CatalogPhoto(props: ComponentProps<typeof Photo>) {
  const { src, alt, locale, platter } = props;
  const label = platter ? platterPresentation(locale).photoLabel
    : locale === "en" ? "Enlarge photo" : locale === "de" ? "Foto vergrößern" : "Vergroot foto";
  return <BedieningSlot fallback={<a className="seafood-photo" href={src}>
    <StaticResponsiveImage src={src} alt={alt} width={900} height={675} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
    <span>{label} ⌕</span>
  </a>}><Photo {...props} /></BedieningSlot>;
}

export function GourmetOrderLink({locale, slug, className = "knop knop-navy"}: {locale:string; slug?:string; className?:string}) {
  return <Link className={className} href={gourmetOrderHref(locale,slug)}>{gourmetRequestCopy(locale).order}</Link>;
}
export function PlatterInquiry(props: ComponentProps<typeof Inquiry>) {
  return <ComposerSlot {...props} kind="platter"><Inquiry {...props} /></ComposerSlot>;
}
