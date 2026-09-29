// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE-REVIEWS — DE ENIGE PLEK OM REVIEWS TE BEWERKEN
// -----------------------------------------------------------------------------
// Werk dit bij met de ACTUELE gegevens van je Google Bedrijfsprofiel.
// Zowel de homepage (reviewsectie) als de structured data (JSON-LD) lezen
// hiervandaan, dus ze lopen nooit meer uit elkaar.
// Belangrijk: alleen ECHTE reviews — niets verzinnen (SEO- én vertrouwensrisico).
// Bron: Google Maps, uitgelezen 15 juli 2026.
// ─────────────────────────────────────────────────────────────────────────────

export interface GoogleReview {
  name: string;          // naam reviewer
  stars: number;         // 1 t/m 5
  date: string;          // weergavetekst, bv. "2 weken geleden"
  datePublished: string; // ISO-datum voor schema (benadering op basis van "x geleden")
  text: string;          // volledige reviewtekst
}

export const googleRating = "4.6";
export const googleReviewCount = "116";

export const googleMapsUrl =
  "https://www.google.com/maps/place/Schaap%27s+Vishandel/@52.1517798,4.4891644,17z/data=!4m6!3m5!1s0x47c5c68b327c5b31:0xb364be6e52553f5!8m2!3d52.1517798!4d4.4891644!16s%2Fg%2F1ptw4b069";

/**
 * De volgorde is niet toevallig.
 *
 * De homepage toont de eerste drie. Die moeten iets zeggen over kwaliteit,
 * smaak en service — dingen die over tien jaar nog kloppen. De recensie van
 * Haikedaike is een van de mooiste die er staan, maar noemt een bedrag van
 * € 7,50; zodra de prijs verandert leest dat als een verouderde site. Die staat
 * daarom verderop en niet vooraan. Niets geschrapt: alles wat hier staat is
 * echt, en dat blijft zo.
 */
export const googleReviews: GoogleReview[] = [
  { name: "Giel Leupen", stars: 5, date: "3 weken geleden", datePublished: "2026-06-24", text: "De Hollandse Nieuwe haring 2026 was geweldig. Heerlijk zacht en zeker niet te zout." },
  { name: "Ole M", stars: 5, date: "6 maanden geleden", datePublished: "2026-01-15", text: "Lekkerste vis, goeie prijzen en heel lieve mensen." },
  { name: "Martijn Holtkamp", stars: 5, date: "2 jaar geleden", datePublished: "2024-07-01", text: "Naar aanleiding van de goede reviews bij Schaap een visschotel besteld. We kregen een mooie schotel met veel verse en smakelijke vissoorten. Prijs en kwaliteit prima in orde, we hebben er van genoten!" },
  { name: "Haikedaike", stars: 5, date: "9 maanden geleden", datePublished: "2025-10-01", text: "Beste kibbeling van heel Leiden! Ruime porties, lekker krokant, lekker veel saus. Zoals het hoort! Gewoon echt waar voor je geld! (7,50) Als het een tientje was geweest had ik het ook gewoon gekocht hoor." },
  { name: "Peter Aartman", stars: 5, date: "2 weken geleden", datePublished: "2026-07-01", text: "Goede kwaliteit en lekkere kant-en-klaar gerechten." },
  { name: "Dima Chuk", stars: 5, date: "11 maanden geleden", datePublished: "2025-08-01", text: "Small but very nice place! Kibbeling and Dutch shrimps in bread highly recommended to try!" },
  { name: "Nerina Enlightened", stars: 5, date: "een jaar geleden", datePublished: "2025-07-01", text: "Had just moved to Leiden that day and just before closing I walked into this shop to buy some kibbeling. The man at the counter was super friendly and informed me that I could definitely still get a portion…" },
  { name: "Martin Slootweg", stars: 4, date: "2 maanden geleden", datePublished: "2026-05-01", text: "Lekkere vis en fantastische sushi laten maken." },
];

/** Translate the three displayed quotes faithfully; retain original author and rating. */
export function localizeReview(review: GoogleReview, locale: string): GoogleReview {
  const quotes: Record<string, readonly [string, string]> = {
    "Giel Leupen": ["The 2026 Hollandse Nieuwe herring was wonderful. Lovely and tender, and certainly not too salty.", "Der Hollandse-Nieuwe-Matjes 2026 war wunderbar. Herrlich zart und bestimmt nicht zu salzig."],
    "Ole M": ["The tastiest fish, good prices and very kind people.", "Der leckerste Fisch, gute Preise und sehr freundliche Menschen."],
    "Martijn Holtkamp": ["Following the good reviews, we ordered a seafood platter from Schaap. We received a beautiful platter with plenty of fresh and tasty varieties of fish. Price and quality were both very good; we really enjoyed it!", "Aufgrund der guten Bewertungen bestellten wir bei Schaap eine Fischplatte. Wir erhielten eine schöne Platte mit vielen frischen und leckeren Fischsorten. Preis und Qualität waren sehr gut, wir haben es genossen!"],
  };
  const text = locale === "nl" ? review.text : quotes[review.name]?.[locale === "de" ? 1 : 0];
  if (!text) throw new Error("Missing displayed review translation: " + review.name);
  return {...review, text, date: new Intl.DateTimeFormat(locale, {month: "long", year: "numeric"}).format(new Date(review.datePublished + "T12:00:00Z"))};
}
