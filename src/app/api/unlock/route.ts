import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_TOKEN } from "@/lib/siteAccess";

// Het wachtwoord leeft alleen hier (server-side). Wijzig het zonder code aan te
// passen via de environment variable SITE_PASSWORD in Vercel.
const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "";
const MAX_REQUEST_BYTES = 8 * 1024;

async function readBoundedBody(request: Request): Promise<ArrayBuffer | null> {
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new ArrayBuffer(totalBytes);
  const bodyView = new Uint8Array(body);
  let offset = 0;
  for (const chunk of chunks) {
    bodyView.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function passwordsMatch(candidate: string, expected: string): boolean {
  const candidateDigest = createHash("sha256").update(candidate, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export async function POST(request: Request) {
  if (!SITE_PASSWORD || !ACCESS_TOKEN) {
    // This is the website's lightweight access gate, not the student/customer
    // account API. Keep the form response readable when a deployment is missing
    // its runtime secrets instead of sending the visitor to raw JSON.
    return NextResponse.redirect(new URL("/coming-soon?error=setup", request.url), {
      status: 303,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ fout: "Ongeldig verzoek." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data") && !contentType.startsWith("application/x-www-form-urlencoded")) {
    return NextResponse.json({ fout: "Ongeldig formulier." }, { status: 415 });
  }

  const body = await readBoundedBody(request);
  if (!body) {
    return NextResponse.json({ fout: "Het verzoek is te groot." }, { status: 413 });
  }

  let password: string;
  try {
    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body,
    });
    const form = await boundedRequest.formData();
    const submittedPassword = form.get("password");
    password = typeof submittedPassword === "string" ? submittedPassword : "";
  } catch {
    return NextResponse.json({ fout: "Ongeldig formulier." }, { status: 400 });
  }

  if (!passwordsMatch(password, SITE_PASSWORD)) {
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
