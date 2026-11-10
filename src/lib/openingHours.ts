export type Location = "winkel" | "markt" | "voorschoten";

export interface OpeningHour {
  days: number[]; // 0=zo, 1=ma, ..., 6=za
  open: string; // "08:30"
  close: string; // "17:30"
}

// Centrale bron voor status, locatiepagina, footer, metadata en schema.org.
// Lucas bevestigde op 2 november 2026: maandag gesloten, dinsdag–zaterdag open.
// Op 3 november bevestigde Lucas specifiek dinsdagopening om 09:00.
export const openingHours: Record<Location, OpeningHour[]> = {
  winkel: [
    { days: [2, 3, 4, 5], open: "09:00", close: "18:00" }, // di–vr (maandag gesloten)
    { days: [6], open: "09:00", close: "17:00" }, // za
  ],
  markt: [
    { days: [3], open: "08:30", close: "17:00" }, // wo — bij Dille & Kamille
    { days: [6], open: "08:30", close: "17:00" }, // za — Aalmarkt bij de Waag
  ],
  voorschoten: [
    { days: [5], open: "08:30", close: "17:30" }, // vr — bij Hoogvliet
  ],
};

const dayNames = {
  nl: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
};

export function openingRows(location: Location, locale: string) {
  const names = dayNames[locale === "en" || locale === "de" ? locale : "nl"];
  return openingHours[location].flatMap(slot => slot.days.map(day => ({
    day,
    label: names[day],
    time: `${slot.open}–${slot.close}`,
  })));
}

export function openingSummary(location: Location, locale: string) {
  return openingRows(location, locale).map(row => `${row.label} ${row.time}`).join(" · ");
}

export function shopDayRange(locale: string) {
  const names = dayNames[locale === "en" || locale === "de" ? locale : "nl"];
  const days = openingHours.winkel.flatMap(slot => slot.days);
  return `${names[days[0]]}–${names[days.at(-1)!]}`;
}

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

const amsterdamClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function getLocationStatus(location: Location, nu = new Date()): LocationStatus {
  const parts = amsterdamClock.formatToParts(nu);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)!.value;
  const dagVanDeWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(part("weekday"));
  const klok = `${part("hour")}:${part("minute")}`;

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

// Upcoming ordinary opening day; use the Amsterdam calendar, also around DST.
export function scheduledCounters(now: Date) {
  const parts = amsterdamClock.formatToParts(now);
  const part = (key: Intl.DateTimeFormatPartTypes) => parts.find(p=>p.type===key)!.value;
  const weekday=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(part("weekday"));
  const time=part("hour")+":"+part("minute");
  for(let offset=0;offset<8;offset++){
    const day=(weekday+offset)%7, hours:Record<string,string>={};
    for(const id of ["winkel","markt","voorschoten"] as const){
      const slot=openingHours[id].find(s=>s.days.includes(day));
      if(slot && (offset>0 || time<slot.close)) hours[id==="markt" && day===3?"markt-woensdag":id]=slot.open+"–"+slot.close;
    }
    if(Object.keys(hours).length) {
      // Noon UTC stays on the intended Amsterdam calendar date across clock changes.
      const iso=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Amsterdam"}).format(now);
      const date=new Date(iso+"T12:00:00Z");date.setUTCDate(date.getUTCDate()+offset);
      return {ids:Object.keys(hours),hours,date,today:offset===0};
    }
  }
  throw new Error("Opening hours contain no trading day");
}
