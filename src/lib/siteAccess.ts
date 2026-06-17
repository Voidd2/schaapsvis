// Gedeelde constanten voor de "binnenkort online" / onderhoudsmodus.
// Let op: hier staat GEEN wachtwoord — dat leeft alleen server-side in de
// API-route (src/app/api/unlock/route.ts), zodat het nooit in de browser-bundle komt.

export const ACCESS_COOKIE = "sv_access";

// Cookiewaarde die toegang verleent. Zet desgewenst een eigen waarde via
// de environment variable SITE_ACCESS_TOKEN in Vercel.
export const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN ?? "schaapsvis-unlocked-2026";
