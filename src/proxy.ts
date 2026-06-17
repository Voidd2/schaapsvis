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

  // Onderhoudsmodus staat standaard AAN. Zet hem UIT om live te gaan:
  // environment variable MAINTENANCE_MODE=off in Vercel.
  const maintenance = process.env.MAINTENANCE_MODE !== "off";
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
