import { whatsappLink } from "./bedrijf";

/** Buiten visschalen is dit een vraag aan de winkel, geen online bestelling. */
export function bestelContact(locale: string, product?: string) {
  const teksten = {
    nl: {
      label: "Vraag via WhatsApp",
      tekst: product
        ? `Hallo Schaap's Vishandel, ik zoek ${product}. Is dit beschikbaar en wat is er mogelijk?`
        : "Hallo Schaap's Vishandel, ik zoek een visproduct. Kunnen jullie met mij kijken wat mogelijk is?",
    },
    en: {
      label: "Ask us on WhatsApp",
      tekst: product
        ? `Hello Schaap's Vishandel, I am looking for ${product}. Is it available and what are the options?`
        : "Hello Schaap's Vishandel, I am looking for a fish product. Could you help me with availability and options?",
    },
    de: {
      label: "Per WhatsApp anfragen",
      tekst: product
        ? `Hallo Schaap's Vishandel, ich suche ${product}. Ist es verfügbar und welche Möglichkeiten gibt es?`
        : "Hallo Schaap's Vishandel, ich suche ein Fischprodukt. Können Sie mir bei Verfügbarkeit und Möglichkeiten helfen?",
    },
  };
  const c = teksten[locale as keyof typeof teksten] ?? teksten.nl;
  return { label: c.label, href: whatsappLink(c.tekst) };
}
