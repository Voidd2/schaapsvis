import { whatsappLink } from "@/lib/bedrijf";

export function WhatsAppBestelknop({ locale, product }: { locale: string; product?: string }) {
  const [label, message] = locale === "en"
    ? ["Order via WhatsApp", product ? `Hello Schaap’s Vishandel, I’d like to order: ${product}. When could I collect it?` : "Hello Schaap’s Vishandel, I’d like to order a fish platter. Could we arrange collection?"]
    : locale === "de"
    ? ["Per WhatsApp bestellen", product ? `Hallo Schaap’s Vishandel, ich möchte Folgendes bestellen: ${product}. Wann kann ich es abholen?` : "Hallo Schaap’s Vishandel, ich möchte eine Fischplatte bestellen. Wann ist eine Abholung möglich?"]
    : ["Bestellen via WhatsApp", product ? `Hallo Schaap’s Vishandel, ik wil graag bestellen: ${product}. Wanneer kan ik dit ophalen?` : "Hallo Schaap’s Vishandel, ik wil graag een visschaal bestellen. Kunnen we een afhaalmoment afspreken?"];
  return <a className={product ? "knop knop-lijn" : "knop knop-navy"} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{label}</a>;
}
