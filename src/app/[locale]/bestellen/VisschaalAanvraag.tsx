"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useWinkelwagen } from "@/components/winkel/Winkelwagen";
import { regels } from "@/lib/visschaal";
import { useSchaalTekst } from "@/components/visschaal/tekst";
import { platterQuantity } from "@/lib/platter-localization";
import { whatsappLink } from "@/lib/bedrijf";
import { MessageCircle } from "lucide-react";
const copy = {
 nl: { title: "Uw visschaal aanvragen", note: "We rekenen gemiddeld op ongeveer € 17,50 per persoon. We denken graag met u mee over wat u lekker vindt, hoeveel gasten er komen en wat voor gelegenheid u viert. Stuur uw wensen via WhatsApp; extra’s of duurdere vissoorten kunnen de prijs beïnvloeden. Uw aanvraag is nog geen bevestigde bestelling.", button: "Bespreek uw visschaal via WhatsApp", change: "Andere visschaal bekijken", empty: "Kies eerst een visschaal", start: "Hallo Schaap’s Vishandel, ik wil graag deze visschaal aanvragen:", end: "We denken graag mee over de invulling. Kunt u beschikbaarheid, eventuele extra wensen en de prijs bevestigen?" },
 en: { title: "Request your seafood platter", note: "As a guide, we average around €17.50 per person. We are happy to help choose a selection based on your tastes, guest numbers and occasion. Send us your wishes on WhatsApp; additions or premium fish may affect the price. This is an enquiry, not a confirmed order.", button: "Discuss your platter on WhatsApp", change: "View other platters", empty: "Choose a platter first", start: "Hello Schaap’s Vishandel, I would like to request this seafood platter:", end: "Please help me choose the selection. Could you confirm availability, any additions and the price?" },
 de: { title: "Ihre Fischplatte anfragen", note: "Als Richtwert rechnen wir im Durchschnitt mit etwa 17,50 € pro Person. Wir beraten Sie gern passend zu Ihrem Geschmack, der Gästezahl und dem Anlass. Senden Sie Ihre Wünsche per WhatsApp; Ergänzungen oder Edelfisch können den Preis beeinflussen. Ihre Anfrage ist noch keine bestätigte Bestellung.", button: "Fischplatte per WhatsApp besprechen", change: "Weitere Fischplatten ansehen", empty: "Wählen Sie zuerst eine Fischplatte", start: "Hallo Schaap’s Vishandel, ich möchte diese Fischplatte anfragen:", end: "Bitte beraten Sie mich zur Auswahl. Können Sie Verfügbarkeit, Sonderwünsche und Preis bestätigen?" }
};
export function VisschaalAanvraag() {
 const locale = useLocale();
 const tekst = useSchaalTekst();
 const c = copy[locale as keyof typeof copy] || copy.nl;
 const { samenstelling } = useWinkelwagen();
 const items = regels(samenstelling);
 const bericht = [c.start, ...items.map(r => tekst.naam(r.id,r.naam) + " — " + platterQuantity(r,locale)), "", c.end].join("\n");
 return <div className="recipe-checklist max-w-3xl mx-auto"><h2 className="text-2xl mb-4">{items.length ? c.title : c.empty}</h2><p className="leading-relaxed mb-6">{c.note}</p><ul className="mb-6">{items.map(r => <li key={r.id} className="py-3 border-b border-sky-200"><span>{tekst.naam(r.id,r.naam)}{r.isSchaal && " — " + platterQuantity(r,locale)}</span></li>)}</ul>{items.length > 0 && <a href={whatsappLink(bericht)} target="_blank" rel="noopener noreferrer" className="knop knop-navy"><MessageCircle size={18} aria-hidden />{c.button}</a>}<Link href={`/${locale}/visschalen`} className="block mt-5 underline font-semibold">{items.length ? c.change : c.empty} →</Link></div>;
}
