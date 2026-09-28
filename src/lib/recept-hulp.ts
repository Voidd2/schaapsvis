import type { Recept } from "./recepten";

/** Totale verstreken tijd, inclusief expliciet genoemde wachttijd. */
export function receptMinuten(tijd: string): number {
  const uren = tijd.match(/(\d+)\s*uur/);
  const minuten = tijd.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*min/);
  return (uren ? Number(uren[1]) * 60 : 0) + (minuten ? Number(minuten[2] || minuten[1]) : 0);
}
export function receptDuur(tijd: string): string | undefined {
  const totaal = receptMinuten(tijd);
  if (!totaal) return undefined;
  const uren = Math.floor(totaal / 60), minuten = totaal % 60;
  return `PT${uren ? uren + "H" : ""}${minuten ? minuten + "M" : ""}`;
}
export function receptVis(recept: Recept): string {
  const tekst = [recept.title, ...recept.vanSchaap].join(" ").toLowerCase();
  for (const vis of ["Zalm", "Kabeljauw", "Haring", "Makreel", "Schol", "Tonijn", "Wijting", "Paling", "Garnalen", "Oesters"]) {
    if (tekst.includes(vis.toLowerCase())) return vis;
  }
  return "Overige vis";
}
