export type Location = "winkel" | "markt" | "voorschoten";

interface OpeningHour {
  days: number[]; // 0=zo, 1=ma, ..., 6=za
  open: string; // "08:30"
  close: string; // "17:30"
}

// ← AANPASSEN naar de exacte openingstijden van Aldert
export const openingHours: Record<Location, OpeningHour[]> = {
  winkel: [
    { days: [2, 3, 4, 5], open: "09:00", close: "18:00" }, // di-vr (maandag gesloten) — bron: Google Bedrijfsprofiel
    { days: [6], open: "09:00", close: "17:00" }, // za
  ],
  markt: [
    { days: [3], open: "09:00", close: "17:00" }, // wo ← AANPASSEN
    { days: [6], open: "09:00", close: "17:00" }, // za ← AANPASSEN
  ],
  voorschoten: [
    { days: [5], open: "08:30", close: "16:00" }, // vrij ← AANPASSEN
  ],
};

export type LocationStatus = {
  isOpen: boolean;
  label: string;
};

const DAG_NAMEN = ["zo", "ma", "di", "wo", "do", "vr", "za"] as const;

export function getLocationStatus(location: Location): LocationStatus {
  const now = new Date();
  const day = now.getDay();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const todaySlot = openingHours[location].find((h) => h.days.includes(day));

  if (todaySlot && timeStr >= todaySlot.open && timeStr < todaySlot.close) {
    return { isOpen: true, label: `Open tot ${todaySlot.close}` };
  }

  // Vandaag nog open? (eerder op de dag, winkel opent later)
  if (todaySlot && timeStr < todaySlot.open) {
    return { isOpen: false, label: `Vandaag open vanaf ${todaySlot.open}` };
  }

  // Zoek de volgende openingsdag
  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7;
    const nextSlot = openingHours[location].find((h) =>
      h.days.includes(nextDay)
    );
    if (nextSlot) {
      const label =
        i === 1
          ? `Morgen open vanaf ${nextSlot.open}`
          : `${DAG_NAMEN[nextDay]} open vanaf ${nextSlot.open}`;
      return { isOpen: false, label };
    }
  }

  return { isOpen: false, label: "Bel voor openingstijden" };
}
