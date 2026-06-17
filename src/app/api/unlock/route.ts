import { NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_TOKEN } from "@/lib/siteAccess";

// Het wachtwoord leeft alleen hier (server-side). Wijzig het zonder code aan te
// passen via de environment variable SITE_PASSWORD in Vercel.
const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "Malaga5010";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (password !== SITE_PASSWORD) {
    return NextResponse.redirect(new URL("/coming-soon?error=1", request.url), {
      status: 303,
    });
  }

  const res = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  res.cookies.set(ACCESS_COOKIE, ACCESS_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dagen
  });
  return res;
}
