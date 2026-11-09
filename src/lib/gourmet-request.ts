import { whatsappLink } from "./bedrijf";
import { feestdagenBedrag } from "./feestdagen-producten";
import { GOURMET_RETAIL_CENTS_PER_100G as base } from "./gourmet-pricing";

export const gourmetFish = [
  { id: "salmon", rate: base[0], nl: "Zalm", en: "Salmon", de: "Lachs" },
  { id: "tuna", rate: base[1], nl: "Tonijn", en: "Tuna", de: "Thunfisch" },
  { id: "cod", rate: base[2], nl: "Kabeljauw", en: "Cod", de: "Kabeljau" },
  { id: "prawns", rate: base[3], nl: "Gourmetgarnalen", en: "Grilling prawns", de: "Grillgarnelen" },
  { id: "seabass", rate: 300, nl: "Zeebaarsfilet", en: "Sea bass fillet", de: "Wolfsbarschfilet" },
  { id: "black-tigers", rate: 250, nl: "Black Tiger-garnalen", en: "Black tiger prawns", de: "Black-Tiger-Garnelen" },
  { id: "squid", rate: 275, nl: "Inktvisringen", en: "Squid rings", de: "Tintenfischringe" },
  { id: "plaice", rate: 150, nl: "Schol", en: "Plaice", de: "Scholle" },
  { id: "whiting", rate: 120, nl: "Wijting", en: "Whiting", de: "Wittling" },
] as const;

const copy = {
  nl: {
    title: "Stel uw visgourmet zelf samen", intro: "Kies de vis voor uw gezelschap en vul per soort het gewenste gewicht in.",
    people: "Aantal personen", fish: "Kies uw vis", unit: "per 100 g", grams: "Gewicht in gram",
    packaging: "Hoe wilt u uw vis meekrijgen?", standard: "Standaardbakjes", premium: "Schaal of verpakking op maat", free: "gratis",
    customNote: "Eventuele meerprijs in overleg via WhatsApp.",
    summary: "Uw visgourmet", empty: "Kies een vissoort om uw samenstelling te bekijken.", invalid: "Vul voor elke gekozen soort een heel aantal gram boven nul in.",
    subtotal: "Vis", weight: "Totaalgewicht", total: "Totaal", date: "Gewenste afhaaldatum (optioneel)",
    wishes: "Wensen of allergieën (optioneel)", placeholder: "Bijvoorbeeld een voorkeur voor marinade",
    button: "Bespreek via WhatsApp", note: "We bevestigen de beschikbaarheid, de prijs en het afhaalmoment persoonlijk.",
    greeting: "Hallo Schaap’s Vishandel, ik wil graag deze visgourmet bespreken.", dateUnknown: "Afhaaldatum nog af te spreken",
  },
  en: {
    title: "Create your own seafood gourmet platter", intro: "Choose your seafood and enter the weight you would like for each variety.",
    people: "Number of people", fish: "Choose your seafood", unit: "per 100 g", grams: "Weight in grams",
    packaging: "How would you like it packed?", standard: "Standard tubs", premium: "Custom platter or packaging", free: "free",
    customNote: "Any extra cost is agreed via WhatsApp.",
    summary: "Your seafood selection", empty: "Choose a variety to see your selection.", invalid: "Enter a positive whole number of grams for each variety.",
    subtotal: "Seafood", weight: "Total weight", total: "Total", date: "Preferred collection date (optional)",
    wishes: "Preferences or allergies (optional)", placeholder: "For example, a preferred marinade",
    button: "Discuss on WhatsApp", note: "We confirm availability, price and collection time personally.",
    greeting: "Hello Schaap’s Vishandel, I would like to discuss this seafood selection.", dateUnknown: "Collection date to be agreed",
  },
  de: {
    title: "Fisch-Gourmetplatte selbst zusammenstellen", intro: "Wählen Sie Ihre Fischsorten und geben Sie für jede Sorte das gewünschte Gewicht ein.",
    people: "Personenzahl", fish: "Fischsorten wählen", unit: "pro 100 g", grams: "Gewicht in Gramm",
    packaging: "Wie möchten Sie Ihren Fisch verpackt haben?", standard: "Standardschalen", premium: "Individuelle Platte oder Verpackung", free: "kostenlos",
    customNote: "Einen möglichen Aufpreis vereinbaren wir per WhatsApp.",
    summary: "Ihre Fischauswahl", empty: "Wählen Sie eine Fischsorte, um Ihre Zusammenstellung zu sehen.", invalid: "Geben Sie für jede gewählte Sorte ein positives Gewicht in ganzen Gramm ein.",
    subtotal: "Fisch", weight: "Gesamtgewicht", total: "Gesamtpreis", date: "Gewünschter Abholtermin (optional)",
    wishes: "Wünsche oder Allergien (optional)", placeholder: "Zum Beispiel Ihre bevorzugte Marinade",
    button: "Per WhatsApp besprechen", note: "Verfügbarkeit, Preis und Abholtermin bestätigen wir persönlich.",
    greeting: "Hallo Schaap’s Vishandel, ich möchte diese Fisch-Gourmetplatte besprechen.", dateUnknown: "Abholtermin nach Absprache",
  },
};
export const gourmetLanguage = (locale: string) => locale === "en" || locale === "de" ? locale : "nl";
export const gourmetRequestCopy = (locale: string) => copy[gourmetLanguage(locale)];
export type Packaging = "standard" | "premium";
export type Portions = Partial<Record<typeof gourmetFish[number]["id"], string>>;
type Request = { people: string; portions: Portions; packaging: Packaging; date: string; wishes: string };

export function gourmetQuote(portions: Portions, packaging: Packaging) {
  const lines = [];
  let grams = 0, subtotal = 0;
  if (packaging !== "standard" && packaging !== "premium") return null;
  for (const fish of gourmetFish) {
    const input = portions[fish.id];
    if (input === undefined) continue;
    const weight = Number(input);
    if (!/^\d+$/.test(input) || !Number.isSafeInteger(weight * fish.rate) || weight <= 0) return null;
    const cents = Math.round(weight * fish.rate / 100);
    lines.push({ fish, weight, cents });
    grams += weight;
    subtotal += cents;
  }
  if (!lines.length || lines.length !== Object.keys(portions).length) return null;
  return { lines, grams, subtotal, total: packaging === "standard" ? subtotal : null };
}

export function gourmetRequestLink(locale: string, request: Request): string | null {
  const lang = gourmetLanguage(locale), t = copy[lang], money = (cents: number) => feestdagenBedrag(cents, locale);
  const quote = gourmetQuote(request.portions, request.packaging);
  const people = Number(request.people);
  if (!quote || !Number.isInteger(people) || people < 1 || people > 200) return null;
  if (request.date && (!/^\d{4}-\d{2}-\d{2}$/.test(request.date) || !Number.isFinite(Date.parse(request.date)) || new Date(request.date).toISOString().slice(0, 10) !== request.date)) return null;
  const lines = [t.greeting, `${t.people}: ${people}`,
    ...quote.lines.map(({ fish, weight, cents }) => `${fish[lang]} · ${weight} g · ${money(fish.rate)} ${t.unit} · ${money(cents)}`),
    `${t.weight}: ${quote.grams} g`, `${t.subtotal}: ${money(quote.subtotal)}`,
    quote.total === null ? `${t.premium} · ${t.customNote}` : `${t.standard} · ${t.free} · ${t.total}: ${money(quote.total)}`,
    request.date ? `${t.date.replace(/ \(.*\)$/, "")}: ${request.date.split("-").reverse().join("-")}` : t.dateUnknown,
  ];
  if (request.wishes.trim()) lines.push(`${t.wishes.replace(/ \(.*\)$/, "")}: ${request.wishes.trim().slice(0, 700)}`);
  return whatsappLink(lines.join("\n"));
}
