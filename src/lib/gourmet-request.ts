import { whatsappLink } from "./bedrijf";
import { feestdagenBedrag } from "./feestdagen-producten";
import { GOURMET_RETAIL_CENTS_PER_100G } from "./gourmet-pricing";
export { GOURMET_RETAIL_CENTS_PER_100G } from "./gourmet-pricing";
const COPY = {
  nl: {
    title: "Stel uw visgourmet zelf samen", intro: "Met hoeveel personen gaat u gourmetten? Kies uw favoriete vissoorten. Wij stemmen de hoeveelheid en verdeling samen met u af.",
    people: "Aantal personen", fish: "Welke soorten wilt u?", choices: ["Zalm", "Tonijn", "Kabeljauw", "Garnalen"],
    date: "Gewenste afhaaldatum (optioneel)", wishes: "Wensen of allergieën (optioneel)", placeholder: "Bijvoorbeeld meer zalm, liever zonder marinade of een gewenst totaalgewicht",
    priceTitle: "Zo bepalen we uw prijs", unit: "per 100 g", preparation: "Voor de schaal en bereiding rekenen we ongeveer € 5–€ 15 per schaal, afhankelijk van het formaat. Daar komt de vis bij, op basis van het afgesproken gewicht per soort.",
    priceNote: "Het aantal personen alleen bepaalt nog geen totaalprijs. Hoeveelheid, verdeling, marinades en eindprijs spreken we vooraf af.",
    button: "Bespreek via WhatsApp", note: "U opent een vrijblijvend conceptbericht. Er wordt niets automatisch verstuurd. We bevestigen samenstelling, prijs en afhaalmoment persoonlijk.",
    error: "Vul een heel aantal personen van 1 tot 200 in en kies minstens één vissoort.",
    greeting: "Hallo Schaap’s Vishandel, ik wil graag een visgourmet op maat bespreken.",
    dateUnknown: "Afhaaldatum: nog af te spreken", wishesLine: "Wensen of allergieën", closing: "Graag advies over hoeveelheid en verdeling en een voorstel voor de totale prijs inclusief schaal en bereiding. Dit is een vrijblijvende aanvraag.",
  },
  en: {
    title: "Create your own seafood gourmet platter", intro: "How many people are joining you for tabletop grilling? Choose your favourite seafood. We will agree the quantities and proportions with you.",
    people: "Number of people", fish: "Which seafood would you like?", choices: ["Salmon", "Tuna", "Cod", "Prawns"],
    date: "Preferred collection date (optional)", wishes: "Preferences or allergies (optional)", placeholder: "For example more salmon, no marinade or a preferred total weight",
    priceTitle: "How we price your platter", unit: "per 100 g", preparation: "The platter and preparation cost approximately €5–€15 per platter, depending on size. Seafood is added at its retail price, based on the agreed weight of each type.",
    priceNote: "Guest numbers alone do not determine a total price. We agree the quantity, proportions, marinades and final price in advance.",
    button: "Discuss on WhatsApp", note: "This opens a non-binding draft message. Nothing is sent automatically. We personally confirm the contents, price and collection.",
    error: "Enter a whole number of people from 1 to 200 and choose at least one type of seafood.",
    greeting: "Hello Schaap’s Vishandel, I would like to discuss a custom seafood gourmet platter.",
    dateUnknown: "Collection date: to be agreed", wishesLine: "Preferences or allergies", closing: "Please advise on quantities and proportions and propose a total price including the platter and preparation. This is a non-binding enquiry.",
  },
  de: {
    title: "Fisch-Gourmetplatte selbst zusammenstellen", intro: "Für wie viele Personen planen Sie einen Tischgrillabend? Wählen Sie Ihre Lieblingssorten. Menge und Verteilung stimmen wir persönlich mit Ihnen ab.",
    people: "Personenzahl", fish: "Welche Sorten möchten Sie?", choices: ["Lachs", "Thunfisch", "Kabeljau", "Garnelen"],
    date: "Gewünschter Abholtermin (optional)", wishes: "Wünsche oder Allergien (optional)", placeholder: "Zum Beispiel mehr Lachs, ohne Marinade oder ein gewünschtes Gesamtgewicht",
    priceTitle: "So entsteht Ihr Preis", unit: "pro 100 g", preparation: "Für Platte und Zubereitung berechnen wir je nach Größe ungefähr 5–15 € pro Platte. Hinzu kommt der Fisch zum Verkaufspreis, entsprechend dem vereinbarten Gewicht je Sorte.",
    priceNote: "Die Personenzahl allein bestimmt noch keinen Gesamtpreis. Menge, Verteilung, Marinaden und Endpreis stimmen wir vorher ab.",
    button: "Per WhatsApp besprechen", note: "Sie öffnen einen unverbindlichen Nachrichtenentwurf. Nichts wird automatisch versendet. Inhalt, Preis und Abholung bestätigen wir persönlich.",
    error: "Geben Sie eine ganze Personenzahl von 1 bis 200 ein und wählen Sie mindestens eine Sorte.",
    greeting: "Hallo Schaap’s Vishandel, ich möchte eine individuelle Fisch-Gourmetplatte besprechen.",
    dateUnknown: "Abholtermin: noch abzustimmen", wishesLine: "Wünsche oder Allergien", closing: "Bitte beraten Sie mich zu Menge und Verteilung und nennen Sie einen Gesamtpreis einschließlich Platte und Zubereitung. Dies ist eine unverbindliche Anfrage.",
  },
} as const;
export function gourmetRequestCopy(locale: string) { return COPY[locale === "en" || locale === "de" ? locale : "nl"]; }
export function gourmetRetailPrice(index: number, locale: string) { return feestdagenBedrag(GOURMET_RETAIL_CENTS_PER_100G[index], locale); }
export type GourmetRequestData = { people: string; fish: number[]; date: string; wishes: string };
export function gourmetRequestLink(locale: string, request: GourmetRequestData): string | null {
  const people = Number(request.people), t = gourmetRequestCopy(locale);
  if (!Number.isInteger(people) || people < 1 || people > 200 || !request.fish.length || request.fish.some(i => !Number.isInteger(i) || i < 0 || i >= t.choices.length)) return null;
  if (request.date && (!/^\d{4}-\d{2}-\d{2}$/.test(request.date) || !Number.isFinite(Date.parse(request.date)) || new Date(request.date).toISOString().slice(0, 10) !== request.date)) return null;
  const fish = [...new Set(request.fish)].map(i => t.choices[i]).join(", ");
  const date = request.date ? request.date.split("-").reverse().join("-") : "";
  const lines = [t.greeting, `${t.people}: ${people}`, `${t.fish} ${fish}`, date ? `${t.date.replace(/ \(.*\)$/, "")}: ${date}` : t.dateUnknown];
  if (request.wishes.trim()) lines.push(`${t.wishesLine}: ${request.wishes.trim().slice(0, 700)}`);
  return whatsappLink([...lines, t.closing].join("\n"));
}
