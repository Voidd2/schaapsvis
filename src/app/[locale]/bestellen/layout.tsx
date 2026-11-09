import type { ReactNode } from "react";
import { Bestelomgeving } from "@/components/winkel/Bestelomgeving";
import { BedieningSlot } from "@/components/catalog/BedieningSlot";
import { BEDRIJF } from "@/lib/bedrijf";

export default async function BestellenLayout({ children, params }: { children: ReactNode; params: Promise<{locale: string}> }) {
  const { locale } = await params;
  const copy = locale === "en" ? ["Order a fish platter", "The online basket could not be loaded. You can view the platters or call the shop.", "View platters"]
    : locale === "de" ? ["Fischplatte bestellen", "Der Warenkorb konnte nicht geladen werden. Sehen Sie sich die Fischplatten an oder rufen Sie uns an.", "Fischplatten ansehen"]
    : ["Bestel uw visschaal", "Het winkelmandje kon niet laden. Bekijk de schalen of bel de winkel om te bestellen.", "Bekijk visschalen"];
  return <BedieningSlot fallback={<main id="inhoud" className="section-wrap py-12 flex-1">
    <h1>{copy[0]}</h1><p className="my-5">{copy[1]}</p>
    <div className="flex flex-wrap gap-3"><a className="knop knop-navy" href={`/${locale}/visschalen`}>{copy[2]}</a>
    <a className="knop knop-lijn" href={`tel:${BEDRIJF.telefoon.e164}`}>{BEDRIJF.telefoon.weergave}</a></div>
  </main>}><Bestelomgeving>{children}</Bestelomgeving></BedieningSlot>;
}
