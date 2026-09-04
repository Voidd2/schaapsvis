export type Location = "winkel" | "markt" | "voorschoten";

interface OpeningHour {
  days: number[]; // 0=zo, 1=ma, ..., 6=za
  open: string; // "08:30"
  close: string; // "17:30"
}

// ← AANPASSEN naar de exacte openingstijden. Deze tijden staan óók in de
// schema.org-gegevens (src/lib/seo.ts) en op de pagina "Bezoek ons"; die drie
// moeten met elkaar overeenkomen, anders leest Google een tegenstrijdigheid.
export const openingHours: Record<Location, OpeningHour[]> = {
  winkel: [
    { days: [2, 3, 4, 5], open: "09:00", close: "18:00" }, // di–vr (maandag gesloten)
    { days: [6], open: "09:00", close: "17:00" }, // za
  ],
  markt: [
    { days: [3], open: "08:30", close: "17:00" }, // wo — bij Dille & Camille
    { days: [6], open: "08:30", close: "17:00" }, // za — Aalmarkt bij de Waag
  ],
  voorschoten: [
    { days: [5], open: "08:30", close: "17:30" }, // vr — bij Hoogvliet
  ],
};

/**
 * De status als gegevens, niet als zin.
 *
 * Hier stond eerst een kant-en-klare Nederlandse tekst ("Morgen open vanaf
 * 09:00"). Die verscheen daardoor ook boven de Engelse en Duitse pagina's. Wat
 * er nu uitkomt is wát er aan de hand is plus het tijdstip; de zin wordt
 * gemaakt in de taal van de bezoeker.
 */
export type LocationStatus = {
  isOpen: boolean;
  /** Welke zin erbij hoort. */
  soort: "openTot" | "vandaagVanaf" | "morgenVanaf" | "dagVanaf" | "onbekend";
  /** "18:00" — ontbreekt alleen bij "onbekend". */
  tijd?: string;
  /** Dagnummer (0 = zondag) bij "dagVanaf". */
  dag?: number;
};

export function getLocationStatus(location: Location): LocationStatus {
  const nu = new Date();
  const dagVanDeWeek = nu.getDay();
  const klok = `${String(nu.getHours()).padStart(2, "0")}:${String(nu.getMinutes()).padStart(2, "0")}`;

  const vandaag = openingHours[location].find((h) => h.days.includes(dagVanDeWeek));

  if (vandaag && klok >= vandaag.open && klok < vandaag.close) {
    return { isOpen: true, soort: "openTot", tijd: vandaag.close };
  }

  // Vandaag nog open, maar de deur gaat later pas van het slot.
  if (vandaag && klok < vandaag.open) {
    return { isOpen: false, soort: "vandaagVanaf", tijd: vandaag.open };
  }

  for (let i = 1; i <= 7; i++) {
    const volgendeDag = (dagVanDeWeek + i) % 7;
    const slot = openingHours[location].find((h) => h.days.includes(volgendeDag));
    if (slot) {
      return i === 1
        ? { isOpen: false, soort: "morgenVanaf", tijd: slot.open }
        : { isOpen: false, soort: "dagVanaf", tijd: slot.open, dag: volgendeDag };
    }
  }

  return { isOpen: false, soort: "onbekend" };
}
