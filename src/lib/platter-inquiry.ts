import { calendarDate } from "./pickup-date";
export const inquiryCopy = {
  nl: {
    intro: "Een schaal, alleen luxe vis of losse salades? Vertel ons wat u zoekt. We bespreken uw wensen, de samenstelling en de prijs persoonlijk.",
    kind: "Wat wilt u graag bestellen?", kinds: { platter: "Een mooie samengestelde visschaal", luxury: "Alleen luxe vissoorten", salads: "Alleen verschillende vissalades", mixed: "Een combinatie van vis en salades", advice: "Ik weet het nog niet, graag advies" },
    fish: "Welke vissoorten wilt u graag? (optioneel)", fishes: { salmon: "Gerookte zalm", eel: "Gerookte paling", shrimp: "Hollandse garnalen", mackerel: "Makreel", tuna: "Tonijn", other: "Andere vissoort" }, fishNote: "Dit zijn uw voorkeuren. We bevestigen de beschikbaarheid persoonlijk.",
    excluded: "Welke vissoorten liever niet? (optioneel)", excludedPlaceholder: "Bijvoorbeeld geen paling, liever extra zalm.",
    presentation: "Hoe wilt u het gepresenteerd hebben?", presentations: { platter: "Mooi opgemaakt op een schaal", tubs: "Liever apart in bakjes", advice: "Graag advies" },
    people: "Aantal personen", amount: "Gewenste hoeveelheid of aantal bakjes", amountHint: "Bijvoorbeeld 3 bakjes of 500 gram; de porties bespreken we samen.",
    date: "Gewenste afhaaldatum", unknown: "De datum staat nog niet vast", budget: "Budget voor de hele aanvraag (€), optioneel", remarks: "Extra opmerkingen (optioneel)", allergies: "Allergieën (optioneel)", allergyNote: "Meld allergieën apart. We bespreken wat mogelijk is; een allergeenvrije bereiding is niet toegezegd.",
    button: "Bespreek via WhatsApp", preview: "Bekijk het WhatsApp-concept", note: "Dit is een vrijblijvende maatwerkaanvraag. We bevestigen samenstelling, prijs, presentatie en afhalen persoonlijk.",
    greeting: "Hallo Schaap’s Vishandel! Ik wil graag deze maatwerkaanvraag bespreken:", budgetMessage: "Budget voor de hele aanvraag", fishMessage: "Gewenste vissoorten", excludedMessage: "Liever niet", remarksMessage: "Opmerkingen", allergiesMessage: "Allergieën",
  },
  en: {
    intro: "A platter, luxury fish only or individual salads? Tell us what you are looking for. We discuss your wishes, contents and price personally.",
    kind: "What would you like to order?", kinds: { platter: "An arranged seafood platter", luxury: "Luxury fish only", salads: "A selection of seafood salads only", mixed: "A combination of fish and salads", advice: "I am not sure yet; advice please" },
    fish: "Which fish would you like? (optional)", fishes: { salmon: "Smoked salmon", eel: "Smoked eel", shrimp: "Dutch shrimp", mackerel: "Mackerel", tuna: "Tuna", other: "Another fish" }, fishNote: "These are your preferences. We confirm availability personally.",
    excluded: "Any fish you would rather leave out? (optional)", excludedPlaceholder: "For example no eel; extra salmon instead.",
    presentation: "How would you like it presented?", presentations: { platter: "Arranged on a platter", tubs: "Separately in tubs", advice: "Advice please" },
    people: "Number of people", amount: "Preferred quantity or number of tubs", amountHint: "For example 3 tubs or 500 grams; we agree portions together.",
    date: "Preferred collection date", unknown: "The date is not yet decided", budget: "Budget for the whole request (€), optional", remarks: "Additional comments (optional)", allergies: "Allergies (optional)", allergyNote: "Please list allergies separately. We discuss what is possible; allergen-free preparation is not guaranteed.",
    button: "Discuss on WhatsApp", preview: "View the WhatsApp draft", note: "This is a non-binding bespoke enquiry. We confirm contents, price, presentation and collection personally.",
    greeting: "Hello Schaap’s Vishandel! I would like to discuss this bespoke request:", budgetMessage: "Budget for the whole request", fishMessage: "Preferred fish", excludedMessage: "Please leave out", remarksMessage: "Comments", allergiesMessage: "Allergies",
  },
  de: {
    intro: "Eine Platte, nur Edelfisch oder einzelne Salate? Nennen Sie uns Ihre Wünsche. Zusammenstellung und Preis besprechen wir persönlich.",
    kind: "Was möchten Sie gerne bestellen?", kinds: { platter: "Eine schön angerichtete Fischplatte", luxury: "Nur edle Fischsorten", salads: "Nur verschiedene Fischsalate", mixed: "Eine Kombination aus Fisch und Salaten", advice: "Ich bin noch unsicher, bitte beraten Sie mich" },
    fish: "Welche Fischsorten wünschen Sie? (optional)", fishes: { salmon: "Räucherlachs", eel: "Räucheraal", shrimp: "Nordseegarnelen", mackerel: "Makrele", tuna: "Thunfisch", other: "Andere Fischsorte" }, fishNote: "Dies sind Ihre Wünsche. Die Verfügbarkeit bestätigen wir persönlich.",
    excluded: "Welche Fischsorten möchten Sie nicht? (optional)", excludedPlaceholder: "Zum Beispiel kein Aal, lieber mehr Lachs.",
    presentation: "Wie möchten Sie es angerichtet haben?", presentations: { platter: "Schön auf einer Platte angerichtet", tubs: "Lieber einzeln in Schälchen", advice: "Bitte beraten Sie mich" },
    people: "Personenzahl", amount: "Gewünschte Menge oder Anzahl Schälchen", amountHint: "Zum Beispiel 3 Schälchen oder 500 Gramm; die Portionen stimmen wir gemeinsam ab.",
    date: "Gewünschter Abholtermin", unknown: "Der Termin steht noch nicht fest", budget: "Budget für die gesamte Anfrage (€), optional", remarks: "Weitere Anmerkungen (optional)", allergies: "Allergien (optional)", allergyNote: "Bitte Allergien separat angeben. Wir besprechen die Möglichkeiten; eine allergenfreie Zubereitung ist nicht zugesagt.",
    button: "Per WhatsApp besprechen", preview: "WhatsApp-Entwurf ansehen", note: "Dies ist eine unverbindliche individuelle Anfrage. Zusammenstellung, Preis, Präsentation und Abholung bestätigen wir persönlich.",
    greeting: "Hallo Schaap’s Vishandel! Ich möchte diese individuelle Anfrage besprechen:", budgetMessage: "Budget für die gesamte Anfrage", fishMessage: "Gewünschte Fischsorten", excludedMessage: "Bitte weglassen", remarksMessage: "Anmerkungen", allergiesMessage: "Allergien",
  },
} as const;
export type PlatterInquiry = {
  kind: keyof typeof inquiryCopy.nl.kinds;
  fish: (keyof typeof inquiryCopy.nl.fishes)[];
  excluded: string; presentation: keyof typeof inquiryCopy.nl.presentations;
  people: string; amount: string; date: string; dateUnknown: boolean;
  budget: string; remarks: string; allergies: string;
};
export function inquiryText(locale: string) { return inquiryCopy[locale === "en" || locale === "de" ? locale : "nl"]; }
/** Draft only; no storage, URL mutation, portion assumptions or calculated quote. */
export function platterInquiryMessage(locale: string, v: PlatterInquiry) {
  const t = inquiryText(locale), salads = v.kind === "salads";
  const date = !v.dateUnknown && calendarDate(v.date)
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${v.date}T12:00:00Z`)) : t.unknown;
  const optional = (label:string, value:string) => value.trim() ? [`${label}: ${value.trim()}`] : [];
  return [t.greeting, "", `${t.kind}: ${t.kinds[v.kind]}`,
    ...(!salads && v.fish.length ? [`${t.fishMessage}: ${[...new Set(v.fish)].map(f => t.fishes[f]).join(", ")}`] : []),
    ...(!salads ? optional(t.excludedMessage, v.excluded) : []),
    `${t.presentation}: ${t.presentations[v.presentation]}`,
    ...optional(salads ? t.amount : t.people, salads ? v.amount : v.people),
    `${t.date}: ${date}`, ...optional(t.budgetMessage, v.budget.trim() ? `€ ${v.budget.trim()}` : ""),
    ...optional(t.remarksMessage, v.remarks), ...optional(t.allergiesMessage, v.allergies), "", t.note].join("\n");
}
