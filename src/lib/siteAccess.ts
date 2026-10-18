/**
 * De site blijft achter het wachtwoordslot totdat publiceren expliciet is
 * aangezet. Dit voorkomt dat een vergeten Vercel/Cloudflare-variabele de
 * onafgeronde site per ongeluk openbaar maakt.
 */

export const ACCESS_COOKIE = "sv_access";

/**
 * Cookiewaarde die toegang verleent.
 *
 * Zet in Vercel een eigen SITE_ACCESS_TOKEN, dan zijn alle bestaande cookies in
 * één klap ongeldig — handig als je iemand de toegang wilt ontnemen.
 */
// No predictable fallback: a missing production secret must not create a
// forgeable cookie that bypasses the site lock.
export const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN ?? "";

/** Een ontbrekend token mag nooit gelijkstaan aan een geldige lege cookie. */
export function heeftGeldigeSiteToegang(cookieValue: string | undefined): boolean {
  return ACCESS_TOKEN.length > 0 && cookieValue === ACCESS_TOKEN;
}

/** Alleen publiek na de expliciete publicatiebevestiging SITE_PUBLIC=launch-approved. */
export function siteIsOpenbaar(): boolean {
  return process.env.SITE_PUBLIC === "launch-approved";
}

/** Zit het slot erop? Het omgekeerde van hierboven, maar leest prettiger. */
export function siteOpSlot(): boolean {
  return !siteIsOpenbaar();
}
