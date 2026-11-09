import { whatsappLink } from "./bedrijf";
import { siteLanguage } from "./language";

const copy = {
  nl: {
    entry: "Verse vis bestellen", back: "Feestdagen", title: "Verse vis voor de feestdagen",
    intro: "Wat zet u op tafel met kerst? App ons welke vis u wilt, hoeveel u nodig heeft en wanneer u wilt afhalen. Wij bevestigen de beschikbaarheid, prijs en afhaaldag.",
    request: "Bestelling aanvragen via WhatsApp", browse: "Bekijk het hele assortiment",
    lobster: "Levende kreeft voor kerst", lobsterNote: "Levende kreeft halen we uitsluitend op aanvraag. Geef vooraf het aantal en uw gewenste afhaaldag door.",
    askLobster: "App ons over levende kreeft", lobsterProduct: "levende kreeft",
    photo: "De vistoonbank van Schaap’s Vishandel op de markt",
    message: (product?: string) => `Hallo Schaap’s Vishandel, ik wil graag vis aanvragen voor de feestdagen.\nVis of schaaldieren: ${product || "…"}\nHoeveelheid of aantal personen: …\nGewenste afhaaldag: …\nKunnen jullie de beschikbaarheid en prijs bevestigen?`,
  },
  en: {
    entry: "Order fresh fish", back: "Holidays", title: "Fresh fish for the holidays",
    intro: "Planning Christmas dinner? Tell us on WhatsApp which fish you’d like, how much you need and when you’d like to collect it. We’ll confirm availability, price and collection date.",
    request: "Request your order on WhatsApp", browse: "Browse the full range",
    lobster: "Live lobster for Christmas", lobsterNote: "We source live lobster on request only. Please tell us how many you’d like and your preferred collection date in advance.",
    askLobster: "Ask about live lobster on WhatsApp", lobsterProduct: "live lobster",
    photo: "The fish counter at Schaap’s market stall",
    message: (product?: string) => `Hello Schaap’s Vishandel, I’d like to request seafood for the holidays.\nFish or shellfish: ${product || "…"}\nQuantity or number of guests: …\nPreferred collection date: …\nCould you confirm availability and price?`,
  },
  de: {
    entry: "Frischen Fisch bestellen", back: "Festtage", title: "Frischer Fisch für die Festtage",
    intro: "Was kommt bei Ihnen an Weihnachten auf den Tisch? Schreiben Sie uns per WhatsApp, welchen Fisch Sie möchten, wie viel Sie brauchen und wann Sie ihn abholen möchten. Wir bestätigen Verfügbarkeit, Preis und Abholtag.",
    request: "Bestellung per WhatsApp anfragen", browse: "Das ganze Sortiment ansehen",
    lobster: "Lebender Hummer zu Weihnachten", lobsterNote: "Lebenden Hummer besorgen wir ausschließlich auf Anfrage. Teilen Sie uns die Stückzahl und Ihren gewünschten Abholtag vorab mit.",
    askLobster: "Per WhatsApp nach Hummer fragen", lobsterProduct: "Lebender Hummer",
    photo: "Die Fischtheke am Marktstand von Schaap’s Vishandel",
    message: (product?: string) => `Hallo Schaap’s Vishandel, ich möchte für die Festtage eine Bestellung anfragen.\nFisch oder Meeresfrüchte: ${product || "…"}\nMenge oder Personenzahl: …\nGewünschter Abholtag: …\nKönnen Sie Verfügbarkeit und Preis bestätigen?`,
  },
};

export function holidayFishCopy(locale: string) {
  return copy[siteLanguage(locale)];
}

export function holidayFishWhatsApp(locale: string, product?: string) {
  return whatsappLink(holidayFishCopy(locale).message(product));
}
