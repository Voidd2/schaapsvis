export type Location = "winkel" | "markt" | "voorschoten";

interface OpeningHour {
  days: number[]; // 0=zo, 1=ma, ..., 6=za
  open: string; // "08:30"
  close: string; // "17:30"
}

// ← AANPASSEN naar de exacte openingstijden van Aldert
export const openingHours: Record<Location, OpeningHour[]> = {
  winkel: [
    { days: [1, 2, 3, 4, 5], open: "08:30", close: "17:30" }, // ma-vr ← AANPASSEN
    { days: [6], open: "08:00", close: "16:00" }, // za ← AANPASSEN
  ],
  markt: [
    { days: [3], open: "09:00", close: "17:00" }, // wo ← AANPASSEN
    { days: [6], open: "09:00", close: "17:00" }, // za ← AANPASSEN
  ],
  voorschoten: [
    { days: [5], open: "08:30", close: "16:00" }, // vrij ← AANPASSEN
  ],
};

export type OpenStatus = {
  open: boolean;
  closesAt?: string;
};

export function isOpenNow(location: Location): OpenStatus {
  const now = new Date();
  const day = now.getDay();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const todayHours = openingHours[location].find((h) =>
    h.days.includes(day)
  );

  if (
    todayHours &&
    timeStr >= todayHours.open &&
    timeStr < todayHours.close
  ) {
    return { open: true, closesAt: todayHours.close };
  }
  return { open: false };
}
