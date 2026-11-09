import { whatsappLink } from "./bedrijf";
import { feestdagenBedrag } from "./feestdagen-producten";
import { gourmetRates, MARINADE_CENTS_PER_100G, gourmetPortion, presetFish } from "./gourmet-pricing";

export const gourmetFish = [
  { id: "salmon", nl: "Zalmfilet", en: "Salmon fillet", de: "Lachsfilet" },
  { id: "black-tigers", nl: "Black Tiger-garnalen (gepeld)", en: "Peeled black tiger prawns", de: "Black-Tiger-Garnelen (geschält)" },
  { id: "cod", nl: "Kabeljauwfilet", en: "Cod fillet", de: "Kabeljaufilet" },
  { id: "tuna", nl: "Tonijn", en: "Tuna", de: "Thunfisch" },
  { id: "halibut", nl: "Heilbotfilet", en: "Halibut fillet", de: "Heilbuttfilet" },
  { id: "seabass", nl: "Zeebaarsfilet", en: "Sea bass fillet", de: "Wolfsbarschfilet" },
  { id: "squid", nl: "Inktvisringen", en: "Squid rings", de: "Tintenfischringe" },
] as const;

const copy = {
  nl: {
    order: "Bestel gourmetschotel", title: "Stel uw gourmetschotel samen", intro: "Kies per soort het gewicht voor uw hele gezelschap. We verpakken de vis in gewone bakjes.", marinade: "Marinade", plain: "Zonder marinade", marinated: "Met marinade",
    people: "Aantal personen", fish: "Kies uw vis", unit: "per 100 g", grams: "Gewicht in gram",
    packaging: "Hoe wilt u uw vis meekrijgen?", standard: "Standaardbakjes", premium: "Schaal of verpakking op maat", free: "gratis",
    customNote: "Eventuele meerprijs in overleg via WhatsApp.",
    summary: "Uw visgourmet", empty: "Kies een vissoort om uw samenstelling te bekijken.", invalid: "Vul voor elke gekozen soort een heel aantal gram boven nul in.",
    subtotal: "Vis", weight: "Totaalgewicht", total: "Totaal", date: "Gewenste afhaaldatum (optioneel)",
    wishes: "Wensen of allergieën (optioneel)", placeholder: "Bijvoorbeeld een allergie of een wens voor de bereiding",
    button: "Bespreek via WhatsApp", note: "We bevestigen de beschikbaarheid, de prijs en het afhaalmoment persoonlijk.",
    greeting: "Hallo Schaap’s Vishandel, ik wil graag deze visgourmet bespreken.", dateUnknown: "Afhaaldatum nog af te spreken",
  },
  en: {
    order: "Order a seafood gourmet platter", title: "Build your seafood gourmet platter", intro: "Choose the total weight of each variety for your group. We pack the seafood in standard tubs.", marinade: "Marinade", plain: "Without marinade", marinated: "With marinade",
    people: "Number of people", fish: "Choose your seafood", unit: "per 100 g", grams: "Weight in grams",
    packaging: "How would you like it packed?", standard: "Standard tubs", premium: "Custom platter or packaging", free: "free",
    customNote: "Any extra cost is agreed via WhatsApp.",
    summary: "Your seafood selection", empty: "Choose a variety to see your selection.", invalid: "Enter a positive whole number of grams for each variety.",
    subtotal: "Seafood", weight: "Total weight", total: "Total", date: "Preferred collection date (optional)",
    wishes: "Preferences or allergies (optional)", placeholder: "For example, an allergy or preparation request",
    button: "Discuss on WhatsApp", note: "We confirm availability, price and collection time personally.",
    greeting: "Hello Schaap’s Vishandel, I would like to discuss this seafood selection.", dateUnknown: "Collection date to be agreed",
  },
  de: {
    order: "Gourmetplatte bestellen", title: "Gourmetplatte zusammenstellen", intro: "Wählen Sie je Sorte das Gesamtgewicht für Ihre Gruppe. Wir verpacken den Fisch in regulären Schalen.", marinade: "Marinade", plain: "Ohne Marinade", marinated: "Mit Marinade",
    people: "Personenzahl", fish: "Fischsorten wählen", unit: "pro 100 g", grams: "Gewicht in Gramm",
    packaging: "Wie möchten Sie Ihren Fisch verpackt haben?", standard: "Standardschalen", premium: "Individuelle Platte oder Verpackung", free: "kostenlos",
    customNote: "Einen möglichen Aufpreis vereinbaren wir per WhatsApp.",
    summary: "Ihre Fischauswahl", empty: "Wählen Sie eine Fischsorte, um Ihre Zusammenstellung zu sehen.", invalid: "Geben Sie für jede gewählte Sorte ein positives Gewicht in ganzen Gramm ein.",
    subtotal: "Fisch", weight: "Gesamtgewicht", total: "Gesamtpreis", date: "Gewünschter Abholtermin (optional)",
    wishes: "Wünsche oder Allergien (optional)", placeholder: "Zum Beispiel eine Allergie oder ein Wunsch zur Zubereitung",
    button: "Per WhatsApp besprechen", note: "Verfügbarkeit, Preis und Abholtermin bestätigen wir persönlich.",
    greeting: "Hallo Schaap’s Vishandel, ich möchte diese Fisch-Gourmetplatte besprechen.", dateUnknown: "Abholtermin nach Absprache",
  },
};
export const gourmetLanguage = (locale: string) => locale === "en" || locale === "de" ? locale : "nl";
export const gourmetRequestCopy = (locale: string) => copy[gourmetLanguage(locale)];
export type FishId = keyof typeof gourmetRates;
export type Portions = Partial<Record<FishId, string>>;
type Request = { people: string; portions: Portions; marinated?: readonly string[]; date: string; wishes: string };

export function gourmetDefaults(slug = "") {
  const preset = gourmetPortion(slug);
  const portions: Portions = {};
  if (preset) presetFish.forEach((id, i) => {
    if (preset.grams[i]) portions[id] = String(preset.grams[i]);
  });
  return { people: String(preset?.people[0] ?? 2), portions };
}

export function gourmetQuote(portions: Portions, marinated: readonly string[] = []) {
  const lines = [];
  let grams = 0, fishCents = 0, marinadeCents = 0;
  if (marinated.some(id => !Object.hasOwn(portions,id))) return null;
  for (const fish of gourmetFish) {
    const input = portions[fish.id];
    if (input === undefined) continue;
    const weight = Number(input);
    if (!/^\d{1,6}$/.test(input) || weight < 1 || weight > 100000) return null;
    const seasoned = marinated.includes(fish.id);
    const base = Math.round(weight * gourmetRates[fish.id] / 100);
    const marinade = seasoned ? Math.round(weight * MARINADE_CENTS_PER_100G / 100) : 0;
    lines.push({fish, weight, seasoned, marinade, cents: base + marinade});
    grams += weight;
    fishCents += base;
    marinadeCents += marinade;
  }
  if (!lines.length || lines.length !== Object.keys(portions).length) return null;
  return {lines, grams, fishCents, marinadeCents, total: fishCents + marinadeCents};
}

export function gourmetLines(quote: NonNullable<ReturnType<typeof gourmetQuote>>, locale: string) {
  const t = gourmetRequestCopy(locale), lang = gourmetLanguage(locale);
  return quote.lines.map(({fish, weight, seasoned, marinade, cents}) =>
    `${fish[lang]} · ${weight} g · ${seasoned ? t.marinated + " (+" + feestdagenBedrag(marinade,locale) + ")" : t.plain} · ${feestdagenBedrag(cents,locale)}`);
}

export function gourmetRequestLink(locale: string, request: Request): string | null {
  const t = gourmetRequestCopy(locale), money = (cents: number) => feestdagenBedrag(cents, locale);
  const quote = gourmetQuote(request.portions, request.marinated);
  const people = Number(request.people);
  if (!quote || !Number.isInteger(people) || people < 1 || people > 200) return null;
  if (request.date && (!/^\d{4}-\d{2}-\d{2}$/.test(request.date) || !Number.isFinite(Date.parse(request.date)) || new Date(request.date).toISOString().slice(0, 10) !== request.date)) return null;
  const lines = [t.greeting, `${t.people}: ${people}`,
    ...gourmetLines(quote,locale),
    `${t.weight}: ${quote.grams} g`, `${t.standard} · ${t.free}`, `${t.total}: ${money(quote.total)}`,
    request.date ? `${t.date.replace(/ \(.*\)$/, "")}: ${request.date.split("-").reverse().join("-")}` : t.dateUnknown,
  ];
  if (request.wishes.trim()) lines.push(`${t.wishes.replace(/ \(.*\)$/, "")}: ${request.wishes.trim().slice(0, 700)}`);
  return whatsappLink(lines.join("\n"));
}
