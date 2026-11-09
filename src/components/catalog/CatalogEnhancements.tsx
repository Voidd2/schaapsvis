import type { ComponentProps } from "react";
import { BedieningSlot } from "./BedieningSlot";
import { ComposerSlot } from "./NativeComposer";
import { CatalogPhoto as Photo } from "./CatalogPhoto";
import { CustomAssembly } from "./CustomAssembly";
import type { GiftRequest as GiftValues } from "@/lib/gift-request";
import { GourmetRequest as Gourmet } from "./GourmetRequest";
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

export function GiftRequest({locale,kind,product}:{locale:string;kind:GiftValues["kind"];product:string}) {
  return <CustomAssembly locale={locale} product={product} mode={kind === "trio" ? "gift-trio" : kind}/>;
}
export function GourmetRequest(props: ComponentProps<typeof Gourmet>) {
  return <details id="gourmet-samenstellen" className="native-composer scroll-mt-48">
    <summary>{gourmetRequestCopy(props.locale).title}</summary>
    <div id="gourmet-keuzes" className="scroll-mt-48">
      <ComposerSlot {...props} kind="gourmet"><Gourmet {...props} /></ComposerSlot>
    </div>
  </details>;
}
export function PlatterInquiry(props: ComponentProps<typeof Inquiry>) {
  return <ComposerSlot {...props} kind="platter"><Inquiry {...props} /></ComposerSlot>;
}
