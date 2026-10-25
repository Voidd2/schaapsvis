import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ACCESS_COOKIE, heeftGeldigeSiteToegang, heeftToegestaanIp, ipVanVertrouwdeProxy, siteOpSlot } from "./lib/siteAccess";

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
    // Keep valid crawl-control responses reachable while the public pages are
    // locked. robots.txt then disallows crawling and sitemap.xml stays empty.
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    // Google Search Console's HTML ownership proof; the actual site remains locked.
    pathname === "/googlee89efce6ff6c8463.html" ||
    // De bestanden waarmee de browser dat scherm tekent.
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname === "/favicon.ico"
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const opSlot = siteOpSlot();
  const heeftToegang = heeftGeldigeSiteToegang(request.cookies.get(ACCESS_COOKIE)?.value);
  // Trust only the active platform's client-IP header, never a browser-supplied
  // X-Forwarded-For value. On Cloudflare Workers, CF-Connecting-IP is added by
  // Cloudflare's edge. The allowlist itself stays in a deployment variable.
  const platform = process.env.VERCEL === "1" ? "vercel" : "cloudflare";
  const heeftIpToegang = heeftToegestaanIp(ipVanVertrouwdeProxy(request.headers, platform));

  if (opSlot && !heeftToegang && !heeftIpToegang && !altijdToegestaan(pathname)) {
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

  // The legacy /admin product editor only persisted to browser localStorage.
  // Keep the short URL, but send owners to the role-checked student review UI.
  if (pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/nl/beheer/studenten";
    url.search = "";
    return NextResponse.redirect(url, 308);
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

  // Normale meertalige routing voor bezoekers mét toegang (of als de site open is).
  return intlMiddleware(request);
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


