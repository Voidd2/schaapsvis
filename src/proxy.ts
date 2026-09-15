import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ACCESS_COOKIE, ACCESS_TOKEN, siteOpSlot } from "./lib/siteAccess";

const intlMiddleware = createMiddleware(routing);

/**
 * Wat er ook achter het slot bereikbaar moet blijven.
 *
 * Kort houden. Alles wat hier niet in staat krijgt het wachtwoordscherm — dat
 * is precies de bedoeling, want een lijst met uitzonderingen is waar zo'n slot
 * in de praktijk op stukloopt.
 */
function altijdToegestaan(pathname: string): boolean {
  return (
    // Het wachtwoordscherm zelf.
    pathname === "/coming-soon" ||
    // Inloggen en uitloggen. Zonder deze twee kom je er nooit meer in.
    pathname === "/api/unlock" ||
    pathname === "/api/logout" ||
    // De bestanden waarmee de browser dat scherm tekent.
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname === "/favicon.ico"
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const opSlot = siteOpSlot();
  const heeftToegang = request.cookies.get(ACCESS_COOKIE)?.value === ACCESS_TOKEN;

  if (opSlot && !heeftToegang && !altijdToegestaan(pathname)) {
    // API-verzoeken krijgen geen inlogscherm maar een duidelijk antwoord. Een
    // bestelling die "gelukt" lijkt terwijl de site op slot staat is erger dan
    // een foutmelding.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { fout: "De site is nog niet open." },
        { status: 503, headers: { "X-Robots-Tag": "noindex, nofollow" } }
      );
    }

    // Rewrite en niet redirect: het adres in de balk blijft staan, dus wie
    // inlogt kan daarna gewoon verversen. En geen enkel adres mag hierbij in
    // een zoekmachine belanden.
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    const res = NextResponse.rewrite(url);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store, must-revalidate");
    return res;
  }

  // Alleen paden die door next-intl afgehandeld moeten worden gaan daarheen.
  // API-routes, de sitemap en losse bestanden hebben geen taalvoorvoegsel nodig.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname === "/coming-soon" ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const editorial = pathname.match(/^\/(en|de)\/(blog|recepten|viskalender|too-good-to-go)(\/.*)?$/);
  if (editorial) {
    const target = request.nextUrl.clone();
    target.pathname = "/nl/" + editorial[2] + (editorial[3] || "");
    return NextResponse.redirect(target, 308);
  }
  // Normale meertalige routing voor bezoekers mét toegang (of als de site open is).
  const result = intlMiddleware(request);
  if (opSlot || process.env.VERCEL_ENV === "preview") result.headers.set("X-Robots-Tag", "noindex, nofollow");
  return result;
}

/**
 * Alles loopt hierlangs.
 *
 * Eerder stond hier `/((?!api|_next|_vercel|.*\..*).*)`: dat liet de API-routes,
 * de sitemap, robots.txt en élk pad met een punt erin ongemoeid. Het slot zat
 * dus alleen op de gewone pagina's, en niet op de gegevens erachter.
 *
 * Wat er nu niet langs hoeft zijn alleen de bestanden die Next zelf serveert —
 * de rest wordt in `altijdToegestaan()` afgehandeld, op één plek en zichtbaar.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
