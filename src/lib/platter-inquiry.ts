export const inquiryCopy = {
  nl: {
    intro: "Heeft u bepaalde vissoorten in gedachten, een ander aantal gasten of een budget waar we rekening mee kunnen houden? Vertel ons uw wensen. We bespreken de mogelijkheden en maken een voorstel dat bij uw gezelschap past.",
    preference: "Voorkeur", people: "Aantal personen", use: "Waarvoor is de schaal?", date: "Gewenste afhaaldatum", unknown: "De datum staat nog niet vast", budget: "Budget voor de hele schaal (€), optioneel", wishes: "Wensen of allergieën, optioneel",
    preferences: { klassiek: "Klassiek", luxe: "Luxe", hapjes: "Hapjes", eigen: "Eigen combinatie", advies: "Help mij kiezen" },
    uses: { borrel: "Borrel", maaltijd: "Maaltijd", advies: "Graag advies" },
    button: "Bespreek via WhatsApp", preview: "Bekijk het WhatsApp-concept",
    note: "U doet hiermee een vrijblijvende aanvraag. We bevestigen de samenstelling, prijs en het afhaalmoment persoonlijk.",
    greeting: "Hallo Schaap’s Vishandel, ik wil graag een schaal op maat bespreken.", budgetMessage: "Budget voor de hele schaal", wishesMessage: "Wensen of allergieën",
  },
  en: {
    intro: "Do you have particular fish in mind, a different number of guests or a budget we should consider? Tell us your wishes. We will discuss the options and suggest a platter that suits your group.",
    preference: "Preference", people: "Number of people", use: "What is the platter for?", date: "Preferred collection date", unknown: "The date is not yet decided", budget: "Budget for the whole platter (€), optional", wishes: "Wishes or allergies, optional",
    preferences: { klassiek: "Classic", luxe: "Deluxe", hapjes: "Seafood bites", eigen: "My own combination", advies: "Help me choose" },
    uses: { borrel: "Drinks and snacks", maaltijd: "Meal", advies: "Advice please" },
    button: "Discuss on WhatsApp", preview: "View the WhatsApp draft",
    note: "This is a non-binding enquiry. We confirm the contents, price and collection personally.",
    greeting: "Hello Schaap’s Vishandel, I would like to discuss a bespoke platter.", budgetMessage: "Budget for the whole platter", wishesMessage: "Wishes or allergies",
  },
  de: {
    intro: "Haben Sie bestimmte Fischsorten, eine andere Gästezahl oder ein Budget im Sinn? Nennen Sie uns Ihre Wünsche. Wir besprechen die Möglichkeiten und machen einen Vorschlag, der zu Ihrer Runde passt.",
    preference: "Vorliebe", people: "Personenzahl", use: "Wofür ist die Platte gedacht?", date: "Gewünschter Abholtermin", unknown: "Der Termin steht noch nicht fest", budget: "Budget für die gesamte Platte (€), optional", wishes: "Wünsche oder Allergien, optional",
    preferences: { klassiek: "Klassisch", luxe: "Deluxe", hapjes: "Häppchen", eigen: "Eigene Kombination", advies: "Helfen Sie mir bei der Auswahl" },
    uses: { borrel: "Gesellige Runde mit Snacks", maaltijd: "Mahlzeit", advies: "Bitte beraten Sie mich" },
    button: "Per WhatsApp besprechen", preview: "WhatsApp-Entwurf ansehen",
    note: "Dies ist eine unverbindliche Anfrage. Zusammenstellung, Preis und Abholtermin bestätigen wir persönlich.",
    greeting: "Hallo Schaap’s Vishandel, ich möchte eine individuelle Platte besprechen.", budgetMessage: "Budget für die gesamte Platte", wishesMessage: "Wünsche oder Allergien",
  },
} as const;

export type PlatterInquiry = {
  preference: keyof typeof inquiryCopy.nl.preferences;
  people: string;
  use: keyof typeof inquiryCopy.nl.uses;
  date: string;
  dateUnknown: boolean;
  budget: string;
  wishes: string;
};

export function inquiryText(locale: string) {
  return inquiryCopy[locale === "en" || locale === "de" ? locale : "nl"];
}

/** Pure draft generation. No storage, URL mutation, pricing calculation or send. */
export function platterInquiryMessage(locale: string, values: PlatterInquiry) {
  const t = inquiryText(locale);
  const date = !values.dateUnknown && /^\d{4}-\d{2}-\d{2}$/.test(values.date)
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${values.date}T12:00:00Z`))
    : t.unknown;
  return [t.greeting, "", `${t.preference}: ${t.preferences[values.preference]}`,
    ...(values.people.trim() ? [`${t.people}: ${values.people.trim()}`] : []),
    `${t.use}: ${t.uses[values.use]}`, `${t.date}: ${date}`,
    ...(values.budget.trim() ? [`${t.budgetMessage}: € ${values.budget.trim()}`] : []),
    ...(values.wishes.trim() ? [`${t.wishesMessage}: ${values.wishes.trim()}`] : []),
    "", t.note,
  ].join("\n");
}
