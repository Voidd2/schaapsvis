import Link from "next/link";
import { cartText } from "@/lib/cart-copy";
import { BEDRIJF } from "@/lib/bedrijf";
import { BedieningSlot } from "./BedieningSlot";
import { ProductQuantity as Quantity, LegacyCatalogSelection as Selection } from "./Productkeuze";
import { DeliTrio as Trio } from "./DeliTrio";

function PhoneFallback({ locale }: { locale: string }) {
  return <a className="knop knop-lijn" href={`tel:${BEDRIJF.telefoon.e164}`}>
    {locale === "en" ? "Order by phone" : locale === "de" ? "Telefonisch bestellen" : "Telefonisch bestellen"} · {BEDRIJF.telefoon.weergave}
  </a>;
}

export function ProductQuantity(props: { slug: string; locale: string }) {
  return <BedieningSlot fallback={<PhoneFallback locale={props.locale} />}><Quantity {...props} /></BedieningSlot>;
}
export function DeliTrio(props: { slug: string; locale: string; product: string }) {
  return <BedieningSlot fallback={<PhoneFallback locale={props.locale} />}><Trio {...props} /></BedieningSlot>;
}
export function LegacyCatalogSelection({ locale }: { locale: string }) {
  return <BedieningSlot><Selection locale={locale} /></BedieningSlot>;
}
export function CatalogBackLink({ locale, origin }: { locale: string; origin: string }) {
  const target = origin === "feestdagen" ? "feestdagen" : "visschalen";
  return <Link className="platter-back-link" href={`/${locale}/${target}#visschalen`}>← {cartText(locale).others}</Link>;
}
