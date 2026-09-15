import { NextResponse, type NextRequest } from "next/server";
import { BEDRIJF } from "@/lib/bedrijf";

/**
 * Berichten van het contactformulier.
 *
 * Het formulier op de contactpagina stond op `action="#"`: erop klikken laadde
 * de pagina opnieuw en het bericht verdween. Dat is erger dan geen formulier,
 * want de bezoeker denkt dat hij iets verstuurd heeft.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Zelfde omgevingsvariabele als de bestellingen:                            │
 * │   BESTELLING_WEBHOOK_URL = https://formspree.io/f/xxxxxxx                 │
 * │ Ontbreekt die, dan geeft dit adres eerlijk terug dat het niet gelukt is   │
 * │ en toont de site het telefoonnummer.                                      │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

function tekst(waarde: unknown, max: number): string {
  return typeof waarde === "string" ? waarde.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  let body: { naam?: string; email?: string; bericht?: string };
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch {
    return NextResponse.json({ fout: "Onleesbare aanvraag" }, { status: 400 });
  }

  const naam = tekst(body.naam, 120);
  const email = tekst(body.email, 160);
  const bericht = tekst(body.bericht, 4000);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({fout:"Invalid email"},{status:400});

  if (!naam || !bericht) {
    return NextResponse.json(
      { fout: "Vul in ieder geval uw naam en uw bericht in." },
      { status: 400 }
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL || process.env.BESTELLING_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        fout: `Het formulier staat nog niet aangesloten. Bel of app ons op ${BEDRIJF.telefoon.weergave}.`,
      },
      { status: 503 }
    );
  }

  try {
    const antwoord = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        type: "BERICHT VIA DE SITE",
        naam,
        email: email || "(niet opgegeven)",
        bericht,
        _subject: `Bericht via de site — ${naam}`,
      }),
    });
    if (!antwoord.ok) throw new Error(String(antwoord.status));
  } catch {
    return NextResponse.json(
      {
        fout: `We konden uw bericht niet doorzetten. Bel of app ons op ${BEDRIJF.telefoon.weergave}.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
