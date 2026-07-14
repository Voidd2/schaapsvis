import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/siteAccess";

// Uitloggen: wist de toegangscookie en stuurt naar de "binnenkort online"-pagina.
// Zo kan de eigenaar zelf controleren dat het slot voor bezoekers werkt.
export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/coming-soon", request.url), {
    status: 303,
  });
  res.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
