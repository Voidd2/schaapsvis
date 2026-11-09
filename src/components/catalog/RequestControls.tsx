import Link from "next/link";
import { cartText } from "@/lib/cart-copy";
import { WhatsAppBestelknop } from "./WhatsAppBestelknop";
import { BedieningSlot } from "./BedieningSlot";
import { ProductQuantity as Quantity, LegacyCatalogSelection as Selection } from "./Productkeuze";
import { DeliTrio as Trio } from "./DeliTrio";
import { ComposerSlot } from "./NativeComposer";

export function ProductQuantity({ product, ...props }: { product: string; slug: string; locale: string }) {
  const link = <WhatsAppBestelknop locale={props.locale} product={product} />;
  return <><BedieningSlot fallback={link}><Quantity {...props} /></BedieningSlot><noscript>{link}</noscript></>;
}
export function DeliTrio(props: { slug: string; locale: string; product: string }) {
  return <ComposerSlot {...props} kind="deli"><Trio {...props} /></ComposerSlot>;
}
export function LegacyCatalogSelection({ locale }: { locale: string }) {
  return <BedieningSlot><Selection locale={locale} /></BedieningSlot>;
}
export function CatalogBackLink({ locale, origin }: { locale: string; origin: string }) {
  const target = origin === "feestdagen" ? "feestdagen" : "visschalen";
  return <Link className="platter-back-link" href={`/${locale}/${target}#visschalen`}>← {cartText(locale).others}</Link>;
}
