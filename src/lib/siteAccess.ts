/** De eigenaar heeft publieke publicatie goedgekeurd op 28 september 2026.
 * SITE_PUBLIC=off zet de site tijdelijk weer achter het bestaande wachtwoordslot.
 * Wachtwoord en toegangstoken blijven uitsluitend op de server.
 */

export const ACCESS_COOKIE = "sv_access";

/**
 * Cookiewaarde die toegang verleent.
 *
 * Zet in Vercel een eigen SITE_ACCESS_TOKEN, dan zijn alle bestaande cookies in
 * één klap ongeldig — handig als je iemand de toegang wilt ontnemen.
 */
export const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN ?? "schaapsvis-unlocked-2026";

/** Publiek tenzij onderhoud expliciet is ingeschakeld. */
export function siteIsOpenbaar(): boolean {
  // Publicatie expliciet goedgekeurd door de eigenaar op 28 september 2026.
  // Zet SITE_PUBLIC=off om de site tijdelijk weer achter het slot te zetten.
  return process.env.SITE_PUBLIC !== "off";
}

/** Zit het slot erop? Het omgekeerde van hierboven, maar leest prettiger. */
export function siteOpSlot(): boolean {
  return !siteIsOpenbaar();
}
