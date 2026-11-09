import type { ComponentProps } from "react";
import { BedieningSlot } from "./BedieningSlot";
import { CatalogHelp } from "./CatalogHelp";
import { CatalogPhoto as Photo } from "./CatalogPhoto";
import { GiftRequest as Gift } from "./GiftRequest";
import { GourmetRequest as Gourmet } from "./GourmetRequest";
import { PlatterInquiry as Inquiry } from "../PlatterInquiry";
import { StaticResponsiveImage } from "../StaticResponsiveImage";
import { platterPresentation } from "@/lib/platter-presentation";

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

export function GiftRequest(props: ComponentProps<typeof Gift>) {
  return <BedieningSlot fallback={<CatalogHelp locale={props.locale} />}><Gift {...props} /></BedieningSlot>;
}
export function GourmetRequest(props: ComponentProps<typeof Gourmet>) {
  return <BedieningSlot fallback={<CatalogHelp locale={props.locale} />}><Gourmet {...props} /></BedieningSlot>;
}
export function PlatterInquiry(props: ComponentProps<typeof Inquiry>) {
  return <BedieningSlot fallback={<CatalogHelp locale={props.locale} />}><Inquiry {...props} /></BedieningSlot>;
}
