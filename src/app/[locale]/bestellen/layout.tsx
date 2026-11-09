import type { ReactNode } from "react";
import { Bestelomgeving } from "@/components/winkel/Bestelomgeving";
import { BedieningSlot } from "@/components/catalog/BedieningSlot";
import { WhatsAppBestelknop } from "@/components/catalog/WhatsAppBestelknop";

export default async function BestellenLayout({ children, params }: { children: ReactNode; params: Promise<{locale: string}> }) {
  const { locale } = await params;
  const copy = locale === "en" ? ["Order a fish platter", "The basket could not be loaded. You can order directly via WhatsApp.", "View platters"]
    : locale === "de" ? ["Fischplatte bestellen", "Der Warenkorb konnte nicht geladen werden. Sie können direkt per WhatsApp bestellen.", "Fischplatten ansehen"]
    : ["Bestel uw visschaal", "Het winkelmandje kon niet laden. U kunt rechtstreeks via WhatsApp bestellen.", "Bekijk visschalen"];
  return <BedieningSlot fallback={<main id="inhoud" className="section-wrap py-12 flex-1">
    <h1>{copy[0]}</h1><p className="my-5">{copy[1]}</p>
    <div className="flex flex-wrap gap-3"><WhatsAppBestelknop locale={locale} /><a className="knop knop-lijn" href={`/${locale}/visschalen`}>{copy[2]}</a></div>
  </main>}><Bestelomgeving>{children}<noscript><WhatsAppBestelknop locale={locale} /></noscript></Bestelomgeving></BedieningSlot>;
}
