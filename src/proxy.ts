import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ACCESS_COOKIE, ACCESS_TOKEN } from "./lib/siteAccess";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // De "binnenkort online"-pagina is altijd direct bereikbaar (geen i18n-prefix).
  if (pathname === "/coming-soon") {
    return NextResponse.next();
  }

  // De site is standaard gewoon zichtbaar. Wil je hem tijdelijk achter het
  // "binnenkort online"-scherm zetten (verbouwing, vakantie), zet dan in Vercel
  // MAINTENANCE_MODE=on. De oude waarde "off" blijft werken en betekent
  // hetzelfde als niets invullen: zichtbaar.
  //
  // Dit stond andersom: het slot zat er standaard op, en dat betekende dat een
  // nieuwe deploy zónder de juiste variabele voor iedereen — de eigenaar
  // incluis — de "binnenkort"-pagina liet zien.
  const maintenance = process.env.MAINTENANCE_MODE === "on";
  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === ACCESS_TOKEN;

  if (maintenance && !hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }

  // Normale meertalige routing voor bezoekers mét toegang (of als de site live is).
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
