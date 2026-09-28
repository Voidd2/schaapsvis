"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useWinkelwagen } from "@/components/winkel/Winkelwagen";
import { regels, totaal, hoeveelheidTekst } from "@/lib/visschaal";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { MessageCircle } from "lucide-react";
const copy = {
 nl: { title: "Uw visschaal aanvragen", note: "Controleer uw keuze en stuur de samenstelling via WhatsApp. Geef in uw bericht de gewenste datum en afhalen of bezorgen aan. Wij bevestigen beschikbaarheid en de definitieve prijs. Uw aanvraag is nog geen bevestigde bestelling.", button: "Visschaal aanvragen via WhatsApp", change: "Samenstelling aanpassen", empty: "Kies eerst een visschaal", total: "Indicatief totaal, exclusief eventuele bezorgkosten", start: "Hallo Schaap’s Vishandel, ik wil graag deze visschaal aanvragen:", end: "Kunt u beschikbaarheid, de definitieve prijs en de mogelijkheden voor afhalen of bezorgen bevestigen?" },
 en: { title: "Request your seafood platter", note: "Check your selection and send it on WhatsApp. Add your preferred date and collection or delivery. We will confirm availability and the final price. This is an enquiry, not a confirmed order.", button: "Request platter on WhatsApp", change: "Change your selection", empty: "Choose a platter first", total: "Indicative total, excluding any delivery charge", start: "Hello Schaap’s Vishandel, I would like to request this seafood platter:", end: "Could you confirm availability, final price and collection or delivery options?" },
 de: { title: "Ihre Fischplatte anfragen", note: "Prüfen Sie Ihre Auswahl und senden Sie sie über WhatsApp. Ergänzen Sie Datum und Abholung oder Lieferung. Wir bestätigen Verfügbarkeit und Endpreis. Ihre Anfrage ist noch keine bestätigte Bestellung.", button: "Fischplatte per WhatsApp anfragen", change: "Auswahl ändern", empty: "Wählen Sie zuerst eine Fischplatte", total: "Unverbindlicher Gesamtpreis, ohne eventuelle Lieferkosten", start: "Hallo Schaap’s Vishandel, ich möchte diese Fischplatte anfragen:", end: "Bitte bestätigen Sie Verfügbarkeit, Endpreis sowie Abholung oder Lieferung." }
};
export function VisschaalAanvraag() {
 const locale = useLocale();
 const c = copy[locale as keyof typeof copy] || copy.nl;
 const { samenstelling } = useWinkelwagen();
 const items = regels(samenstelling);
 const bericht = [c.start, ...items.map(r => r.naam + (r.isSchaal ? "" : " — " + hoeveelheidTekst(r))), "", c.total + ": " + euro(totaal(samenstelling)), "", c.end].join("\n");
 return <div className="recipe-checklist max-w-3xl mx-auto"><h2 className="text-2xl mb-4">{items.length ? c.title : c.empty}</h2><p className="leading-relaxed mb-6">{c.note}</p><ul className="mb-6">{items.map(r => <li key={r.id} className="py-3 border-b border-sky-200 flex gap-4 justify-between"><span>{r.naam}{!r.isSchaal && " — " + hoeveelheidTekst(r)}</span><span className="whitespace-nowrap">{euro(r.bedrag)}</span></li>)}</ul>{items.length > 0 && <><p className="text-sm mb-1">{c.total}</p><p className="text-2xl font-semibold mb-6">{euro(totaal(samenstelling))}</p><a href={whatsappLink(bericht)} target="_blank" rel="noopener noreferrer" className="knop knop-navy"><MessageCircle size={18} aria-hidden />{c.button}</a></>}<Link href={`/${locale}/visschalen`} className="block mt-5 underline font-semibold">{items.length ? c.change : c.empty} →</Link></div>;
}
