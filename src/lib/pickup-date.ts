/** Calendar dates at the shop, independent of the visitor's time zone. */
export function amsterdamToday(now = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function calendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validPickupDate(value: string, now = new Date()): boolean {
  return value === "" || (calendarDate(value) && value >= amsterdamToday(now));
}
