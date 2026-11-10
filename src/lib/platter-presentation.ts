import { feestdagenBedrag, feestdagenPrijs, type FeestdagenProduct } from "./feestdagen-producten";
import { platterFamily, platterSizeLabel } from "./platter-families";

export const platterCopy = {
  nl: {
    photoLabel: "Voorbeeld van de opmaak",
    photoText: "De foto laat zien hoe de schaal kan worden gepresenteerd. De hoeveelheid hoort bij het gekozen formaat.",
    unit: "per schaal", for: "voor",
    photoAlt: { klassiek: "Voorbeeldopmaak van een klassieke visschaal met zalmsalade, garnalen en gerookte vis", luxe: "Voorbeeldopmaak van een luxe visschaal met vis en garnalen", hapjes: "Voorbeeldopmaak van een schaal met vishapjes, wraps en garnalen" },
    confirmation: "U vraagt deze vaste uitvoering aan. We bespreken de prijs en het afhaalmoment persoonlijk. Na uw akkoord spreken we de bestelling definitief af.",
    stepsTitle: "Zo vraagt u een visschaal aan",
    steps: ["Kies een schaal of vertel uw wensen.", "We bespreken samenstelling, prijs en afhalen.", "Na uw akkoord spreken we de bestelling definitief af."],
  },
  en: {
    photoLabel: "Example presentation",
    photoText: "The photo shows how the platter can be presented. The quantity corresponds to the selected size.",
    unit: "per platter", for: "for",
    photoAlt: { klassiek: "Example presentation of a classic seafood platter with salmon salad, prawns and smoked fish", luxe: "Example presentation of a deluxe platter with fish and prawns", hapjes: "Example presentation of a platter with seafood bites, wraps and prawns" },
    confirmation: "You are enquiring about this fixed selection. We discuss the price and collection personally. The order is finalised only after you agree.",
    stepsTitle: "How to request a seafood platter",
    steps: ["Choose a platter or tell us your wishes.", "We discuss contents, price and collection.", "After you agree, we finalise the order."],
  },
  de: {
    photoLabel: "Beispiel für die Anrichtung",
    photoText: "Das Foto zeigt, wie die Platte angerichtet werden kann. Die Menge entspricht der gewählten Größe.",
    unit: "pro Platte", for: "für",
    photoAlt: { klassiek: "Beispiel einer klassischen Fischplatte mit Lachssalat, Garnelen und Räucherfisch", luxe: "Beispiel einer Deluxe-Platte mit Fisch und Garnelen", hapjes: "Beispiel einer Platte mit Fischhäppchen, Wraps und Garnelen" },
    confirmation: "Sie fragen diese feste Zusammenstellung an. Preis und Abholtermin besprechen wir persönlich. Erst nach Ihrer Zustimmung vereinbaren wir die Bestellung verbindlich.",
    stepsTitle: "So fragen Sie eine Fischplatte an",
    steps: ["Wählen Sie eine Platte oder nennen Sie Ihre Wünsche.", "Wir besprechen Zusammenstellung, Preis und Abholung.", "Nach Ihrer Zustimmung vereinbaren wir die Bestellung verbindlich."],
  },
} as const;

export function platterPresentation(locale: string) {
  return platterCopy[locale === "en" || locale === "de" ? locale : "nl"];
}

export function platterPhotoAlt(product: FeestdagenProduct, locale: string) {
  const family = platterFamily(product.slug);
  if (product.categorie === "gourmet") return product.intro;
  return family ? platterPresentation(locale).photoAlt[family] : product.naam;
}

export function platterPrice(product: FeestdagenProduct, locale: string) {
  if (!platterFamily(product.slug)) return feestdagenPrijs(product, locale);
  const t = platterPresentation(locale);
  return `${feestdagenBedrag(product.prijsCents, locale)} ${t.unit} · ${t.for} ${platterSizeLabel(product.slug, locale)}`;
}
