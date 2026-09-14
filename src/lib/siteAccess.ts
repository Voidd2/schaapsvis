/**
 * Het slot op de site.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ De site zit ACHTER EEN WACHTWOORD, op élke pagina. Wil je hem openzetten  │
 * │ voor het publiek, zet dan in Vercel:                                      │
 * │                                                                           │
 * │     SITE_PUBLIC = on                                                      │
 * │                                                                           │
 * │ Elke andere waarde — en ook helemaal niets invullen — houdt het slot      │
 * │ erop. Dat is met opzet: een typefout of een vergeten variabele mag nooit  │
 * │ de hele site openzetten. Liever dat je zelf even moet klikken om hem      │
 * │ open te doen dan dat hij per ongeluk openstaat.                           │
 * │                                                                           │
 * │ Het wachtwoord zelf staat in `src/app/api/unlock/route.ts` en kun je      │
 * │ wijzigen met de variabele SITE_PASSWORD, zonder code aan te passen.       │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Hier staat GEEN wachtwoord: dat leeft alleen server-side in de API-route,
 * zodat het nooit in de browserbundel terechtkomt.
 */

export const ACCESS_COOKIE = "sv_access";

/**
 * Cookiewaarde die toegang verleent.
 *
 * Zet in Vercel een eigen SITE_ACCESS_TOKEN, dan zijn alle bestaande cookies in
 * één klap ongeldig — handig als je iemand de toegang wilt ontnemen.
 */
export const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN ?? "schaapsvis-unlocked-2026";

/**
 * Staat de site open voor het publiek?
 *
 * Alleen als het expliciet zo is ingesteld. Dit stond andersom — open tenzij
 * `MAINTENANCE_MODE=on` — en dat is precies hoe de site zonder slot online
 * stond: de variabele was nooit gezet, dus was er geen wachtwoord.
 */
export function siteIsOpenbaar(): boolean {
  return process.env.SITE_PUBLIC === "on";
}

/** Zit het slot erop? Het omgekeerde van hierboven, maar leest prettiger. */
export function siteOpSlot(): boolean {
  return !siteIsOpenbaar();
}
