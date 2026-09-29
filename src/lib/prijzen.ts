// Richtprijzen (indicatief) per product-slug.
// ─────────────────────────────────────────────────────────────────────────────
// Vis is een dagvers, marktgevoelig product: de dagprijs kan afwijken. Deze
// bedragen zijn daarom RICHTPRIJZEN, geen vaste online prijzen. Alleen producten
// met een eenduidige prijs + eenheid staan hier; de rest blijft "prijs op
// aanvraag" (we bellen terug met de dagprijs).
//
// EIGENAAR: pas hier gerust aan of vul aan — dit is de enige plek die je hoeft
// te wijzigen. Prijs weglaten = automatisch "op aanvraag".

export interface Prijs {
  euro: number;
  eenheid: string; // bv. "per stuk", "per kg", "per 200 g"
  vanaf?: boolean; // true = "vanaf €…" (variabel op gewicht)
}

export const PRIJZEN: Record<string, Prijs> = {
  // Verse vis
  haring: { euro: 2.5, eenheid: "per stuk" },
  "broodje-haring": { euro: 3.0, eenheid: "per stuk" },
  dorade: { euro: 7.45, eenheid: "per stuk (±500 g)" },
  griet: { euro: 24.95, eenheid: "per kg" },
  heek: { euro: 18.95, eenheid: "per kg" },

  // Gerookte vis
  "gravad-lax": { euro: 29.95, eenheid: "per kg" },
  "gerookte-bokking": { euro: 1.95, eenheid: "per stuk" },
  "bosje-sprot": { euro: 4.25, eenheid: "per bosje" },
  "gerookte-kipper": { euro: 1.65, eenheid: "per stuk" },
  "gerookte-wilde-zalm": { euro: 7.95, eenheid: "per stuk" },
  "gerookte-forel-heel": { euro: 5.95, eenheid: "per stuk (±300 g)" },
  "gerookte-zalmmoot": { euro: 7.9, eenheid: "per stuk (200 g)" },

  // Schaal- & schelpdieren
  kokkels: { euro: 16.95, eenheid: "per kg" },
  "creuse-oesters": { euro: 16.95, eenheid: "per dozijn (12 st.)" },
};

export function getPrijs(slug: string): Prijs | undefined {
  return PRIJZEN[slug];
}

// "€ 24,95 per kg" — Nederlands decimaalteken.
export function formatPrijs(p: Prijs, locale = "nl"): string {
  const units: Record<string, [string, string]> = {
    "per stuk": ["each", "pro Stück"], "per kg": ["per kg", "pro kg"], "per bosje": ["per bunch", "pro Bündel"],
    "per dozijn (12 st.)": ["per dozen (12)", "pro Dutzend (12 Stück)"], "per stuk (±500 g)": ["each (approx. 500 g)", "pro Stück (ca. 500 g)"],
    "per stuk (±300 g)": ["each (approx. 300 g)", "pro Stück (ca. 300 g)"], "per stuk (200 g)": ["each (200 g)", "pro Stück (200 g)"],
  };
  const amount = new Intl.NumberFormat(locale === "en" ? "en-GB" : locale === "de" ? "de-DE" : "nl-NL", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(p.euro);
  const unit = locale === "nl" ? p.eenheid : units[p.eenheid]?.[locale === "en" ? 0 : 1];
  if (!unit) throw new Error(`Missing price unit translation: ${p.eenheid}`);
  return `${p.vanaf ? (locale === "en" ? "from " : locale === "de" ? "ab " : "vanaf ") : ""}€ ${amount} ${unit}`;
}
