import { whatsappLink } from "./bedrijf";
import { feestdagenBedrag } from "./feestdagen-producten";

// Suggested net fish weights per gift, not packaging weight or a quotation.
export const GIFT_PACKAGE_GRAMS = [[150, 75, 75, 0], [200, 150, 150, 0], [300, 200, 200, 100]] as const;

const COPY = {
  nl: {
    size: "Kies uw pakket", sizes: ["Klein", "Middel", "Groot"],
    contents: "Voorgestelde inhoud", total: "Totaal circa", net: "Netto visgewicht, zonder verpakking. We bevestigen inhoud, gewicht en prijs persoonlijk.",
    packageFish: ["Gerookte zalmfilet", "Gerookte palingfilet", "Gerookte makreelfilet zonder huid", "Gerookte zalmbuikjes"],
    voucher: "Voeg een cadeaubon toe", voucherAmount: "Bedrag cadeaubon (€)", voucherHint: "Kies zelf een bedrag. Dit komt boven op de pakketprijs; we bevestigen de cadeaubon persoonlijk.", voucherError: "Vul een positief bedrag in met maximaal twee decimalen.", voucherLine: "Cadeaubon toevoegen",
    fish: "Kies drie soorten", choices: ["Hollandse garnalen", "Gerookte paling", "Gerookte zalm", "Gerookte makreel"],
    selected: "van 3 gekozen", error: "Kies precies drie verschillende soorten voor uw trio.",
    wishes: "Uw wensen (optioneel)", placeholder: "Bijvoorbeeld aantal pakketten, budget of allergieën",
    button: "Bespreek via WhatsApp", note: "Vrijblijvende aanvraag. We bevestigen inhoud, hoeveelheid, prijs en afhalen persoonlijk.",
    greeting: "Hallo Schaap’s Vishandel, ik wil graag dit geschenk bespreken:",
    sizeLine: "Formaat", fishLine: "Mijn trio", wishesLine: "Wensen",
    example: "AI-voorbeeld van de verpakking; inhoud en hoeveelheid spreken we af.",
    trioExample: "Voorbeeld van het drievaksbakje; uw drie soorten kiest u hieronder.",
    customTrio: "Liever zelf drie soorten kiezen?", customTrioNote: "Vraag een eigen trio aan met garnalen, paling, zalm of makreel. Hiervoor bevestigen we de prijs apart.",
  },
  en: {
    size: "Choose your package", sizes: ["Small", "Medium", "Large"],
    contents: "Suggested contents", total: "Approximate total", net: "Net fish weight, excluding packaging. We confirm contents, weight and price personally.",
    packageFish: ["Smoked salmon fillet", "Smoked eel fillet", "Skinless smoked mackerel fillet", "Smoked salmon belly strips"],
    voucher: "Add a gift voucher", voucherAmount: "Gift voucher amount (€)", voucherHint: "Choose an amount. This is added to the package price; we confirm the voucher personally.", voucherError: "Enter a positive amount with no more than two decimal places.", voucherLine: "Add gift voucher",
    fish: "Choose three varieties", choices: ["Dutch shrimp", "Smoked eel", "Smoked salmon", "Smoked mackerel"],
    selected: "of 3 selected", error: "Choose exactly three different varieties for your trio.",
    wishes: "Your wishes (optional)", placeholder: "For example quantity, budget or allergies",
    button: "Discuss on WhatsApp", note: "A non-binding request. We confirm contents, quantity, price and collection personally.",
    greeting: "Hello Schaap’s Vishandel, I would like to discuss this gift:",
    sizeLine: "Size", fishLine: "My trio", wishesLine: "Wishes",
    example: "AI packaging example; contents and quantities are agreed personally.",
    trioExample: "Example of the three-compartment tray; choose your three varieties below.",
    customTrio: "Prefer to choose your own three varieties?", customTrioNote: "Request a custom trio with shrimp, eel, salmon or mackerel. We confirm its price separately.",
  },
  de: {
    size: "Paketgröße wählen", sizes: ["Klein", "Mittel", "Groß"],
    contents: "Vorgeschlagener Inhalt", total: "Insgesamt ca.", net: "Nettofischgewicht ohne Verpackung. Inhalt, Gewicht und Preis bestätigen wir persönlich.",
    packageFish: ["Räucherlachsfilet", "Räucheraalfilet", "Räuchermakrelenfilet ohne Haut", "Geräucherte Lachsbauchstreifen"],
    voucher: "Geschenkgutschein hinzufügen", voucherAmount: "Gutscheinbetrag (€)", voucherHint: "Betrag frei wählen. Er kommt zum Paketpreis hinzu; wir bestätigen den Gutschein persönlich.", voucherError: "Bitte einen positiven Betrag mit höchstens zwei Nachkommastellen eingeben.", voucherLine: "Geschenkgutschein hinzufügen",
    fish: "Drei Sorten wählen", choices: ["Holländische Garnelen", "Räucheraal", "Räucherlachs", "Räuchermakrele"],
    selected: "von 3 gewählt", error: "Bitte genau drei verschiedene Sorten für Ihr Trio wählen.",
    wishes: "Ihre Wünsche (optional)", placeholder: "Zum Beispiel Anzahl, Budget oder Allergien",
    button: "Per WhatsApp besprechen", note: "Unverbindliche Anfrage. Inhalt, Menge, Preis und Abholung bestätigen wir persönlich.",
    greeting: "Hallo Schaap’s Vishandel, ich möchte dieses Geschenk besprechen:",
    sizeLine: "Größe", fishLine: "Mein Trio", wishesLine: "Wünsche",
    example: "KI-Verpackungsbeispiel; Inhalt und Menge stimmen wir persönlich ab.",
    trioExample: "Beispiel der Dreifachschale; wählen Sie unten Ihre drei Sorten.",
    customTrio: "Lieber drei Sorten selbst wählen?", customTrioNote: "Fragen Sie ein eigenes Trio mit Garnelen, Aal, Lachs oder Makrele an. Den Preis bestätigen wir gesondert.",
  },
} as const;

export function giftRequestCopy(locale: string) { return COPY[locale === "en" || locale === "de" ? locale : "nl"]; }
export type GiftRequest = { product: string; kind: "package" | "trio" | "custom"; size: number; fish: number[]; wishes: string; voucher?: boolean; voucherAmount?: string };

export function giftVoucherCents(value: string): number | null {
  const text = value.trim();
  if (!/^\d{1,6}(?:[.,]\d{1,2})?$/.test(text)) return null;
  const cents = Math.round(Number(text.replace(",", ".")) * 100);
  return cents > 0 ? cents : null;
}

export function giftPackageContents(locale: string, size: number) {
  const grams = GIFT_PACKAGE_GRAMS[size];
  if (!grams) return null;
  const t = giftRequestCopy(locale);
  return { total: grams.reduce<number>((sum, value) => sum + value, 0), lines: grams.flatMap((weight, index) => weight ? [`${weight} g ${t.packageFish[index]}`] : []) };
}

/** No page query string, storage, quote or automatic send: only a WhatsApp draft. */
export function giftRequestLink(locale: string, request: GiftRequest): string | null {
  const t = giftRequestCopy(locale);
  const selected = [...new Set(request.fish)].filter(index => Number.isInteger(index) && index >= 0 && index < t.choices.length);
  if (request.kind === "trio" && selected.length !== 3) return null;
  if (request.kind === "package" && (!Number.isInteger(request.size) || request.size < 0 || request.size >= t.sizes.length)) return null;
  const voucherCents = request.voucher ? giftVoucherCents(request.voucherAmount ?? "") : null;
  if (request.voucher && voucherCents === null) return null;
  const lines = [t.greeting, request.product];
  if (request.kind === "package") {
    const contents = giftPackageContents(locale, request.size)!;
    lines.push(`${t.sizeLine}: ${t.sizes[request.size]}`, `${t.contents}: ${contents.lines.join(", ")}`, `${t.total}: ${contents.total} g`);
  }
  if (request.kind === "trio") lines.push(`${t.fishLine}: ${selected.map(index => t.choices[index]).join(", ")}`);
  if (voucherCents !== null) lines.push(`${t.voucherLine}: ${feestdagenBedrag(voucherCents, locale)}`);
  const wishes = request.wishes.trim().slice(0, 700);
  if (wishes) lines.push(`${t.wishesLine}: ${wishes}`);
  lines.push(t.note);
  return whatsappLink(lines.join("\n"));
}
