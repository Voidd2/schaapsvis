// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE-REVIEWS — DE ENIGE PLEK OM REVIEWS TE BEWERKEN
// -----------------------------------------------------------------------------
// Werk dit bij met de ACTUELE gegevens van je Google Bedrijfsprofiel.
// Zowel de homepage (reviewsectie) als de structured data (JSON-LD) lezen
// hiervandaan, dus ze lopen nooit meer uit elkaar.
// Belangrijk: alleen ECHTE reviews — niets verzinnen (SEO- én vertrouwensrisico).
// ─────────────────────────────────────────────────────────────────────────────

export interface GoogleReview {
  name: string;          // naam reviewer
  stars: number;         // 1 t/m 5
  date: string;          // weergavetekst, bv. "2 weken geleden"
  datePublished: string; // ISO-datum voor schema, bv. "2026-06-01"
  text: string;          // volledige reviewtekst
}

export const googleRating = "4.6";
export const googleReviewCount = "115";

export const googleMapsUrl =
  "https://www.google.com/maps/place/Schaap%27s+Vishandel/@52.1517798,4.4891644,17z/data=!4m6!3m5!1s0x47c5c68b327c5b31:0xb364be6e52553f5!8m2!3d52.1517798!4d4.4891644!16s%2Fg%2F1ptw4b069";

export const googleReviews: GoogleReview[] = [
  { name: "Haikedaike", stars: 5, date: "9 maanden geleden", datePublished: "2025-10-01", text: "Beste kibbeling van heel Leiden! Ruime porties, lekker krokant, lekker veel saus. Zoals het hoort! Gewoon echt waar voor je geld!" },
  { name: "Giel Leupen", stars: 5, date: "2 weken geleden", datePublished: "2026-06-01", text: "De Hollandse Nieuwe haring 2026 was geweldig. Heerlijk zacht en zeker niet te zout." },
  { name: "Ole M", stars: 5, date: "5 maanden geleden", datePublished: "2026-02-01", text: "Lekkerste vis, goeie prijzen en heel lieve mensen." },
  { name: "Dima Chuk", stars: 5, date: "11 maanden geleden", datePublished: "2025-08-01", text: "Small but very nice place! Kibbeling and Dutch shrimps in bread highly recommended to try!" },
  { name: "Martijn Holtkamp", stars: 5, date: "2 jaar geleden", datePublished: "2024-07-01", text: "Naar aanleiding van de goede reviews bij Schaap een visschotel besteld. We kregen een mooie schotel met veel verse en smakelijke vissoorten. Prijs en kwaliteit prima in orde, we hebben er van genoten!" },
  { name: "Martin Slootweg", stars: 4, date: "2 maanden geleden", datePublished: "2026-05-01", text: "Lekkere vis en fantastische sushi laten maken." },
];
