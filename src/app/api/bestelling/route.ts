import { NextResponse, type NextRequest } from "next/server";
import { berekenTotaal, keuzeRegels, STARTBEDRAG, type Keuze } from "@/lib/visschaal";
import { checkPostcode, BEZORGING, kostenVoor } from "@/lib/bezorging";
import { maakCheckout, nieuweReferentie, sumupBeschikbaar } from "@/lib/betalen";
import { BEDRIJF } from "@/lib/bedrijf";

/**
 * Neemt bestellingen aan.
 *
 * Twee dingen gebeuren hier bewust op de server en niet in de browser:
 *
 * 1. Het bedrag wordt opnieuw uitgerekend uit de gekozen onderdelen. Wat de
 *    browser meestuurt als totaal wordt genegeerd — anders kan iemand met de
 *    ontwikkelaarsconsole een visschaal van vijf euro afrekenen.
 * 2. De bestelling gaat via een omgevingsvariabele naar de winkel, zodat het
 *    e-mailadres of formulier-ID niet in de broncode van de site staat.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Zet in Vercel de variabele BESTELLING_WEBHOOK_URL op je Formspree-adres   │
 * │ (https://formspree.io/f/xxxxxxx). Zolang die ontbreekt neemt de site geen  │
 * │ bestellingen aan: de klant krijgt je telefoonnummer te zien in plaats van  │
 * │ een bevestiging voor iets wat nergens aankomt.                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

interface Klant {
  naam?: string;
  telefoon?: string;
  email?: string;
}

interface Levering {
  wijze?: "bezorgen" | "afhalen";
  postcode?: string;
  huisnummer?: string;
  straat?: string;
  plaats?: string;
  datum?: string;
  tijdvak?: string;
  afhaalpunt?: string;
}

interface Regel {
  naam?: string;
  hoeveelheid?: string;
  toelichting?: string;
}

interface Payload {
  soort?: "verse-vis" | "visschaal";
  klant?: Klant;
  levering?: Levering;
  regels?: Regel[];
  visschaal?: { keuze?: Keuze; personen?: string };
  opmerking?: string;
  allergie?: string;
  nieuwsbrief?: boolean;
  locale?: string;
}

function tekst(waarde: unknown, max = 400): string {
  return typeof waarde === "string" ? waarde.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ fout: "Onleesbare aanvraag" }, { status: 400 });
  }

  const naam = tekst(body.klant?.naam, 120);
  const telefoon = tekst(body.klant?.telefoon, 40);
  const email = tekst(body.klant?.email, 160);

  if (!naam || !telefoon) {
    return NextResponse.json(
      { fout: "Vul in ieder geval uw naam en telefoonnummer in." },
      { status: 400 }
    );
  }

  const soort = body.soort === "visschaal" ? "visschaal" : "verse-vis";
  const wijze = body.levering?.wijze === "afhalen" ? "afhalen" : "bezorgen";

  /* ── Bezorgen: gebied controleren en kosten bepalen ─────────────────────── */
  let bezorgkosten = 0;
  let gemeenteNaam = "";

  if (wijze === "bezorgen") {
    const postcode = tekst(body.levering?.postcode, 10);
    const check = checkPostcode(postcode);
    if (check.status !== "binnen") {
      return NextResponse.json(
        {
          fout:
            check.status === "ongeldig"
              ? "Vul een geldige postcode in, bijvoorbeeld 2313 AL."
              : "Dat adres ligt buiten ons bezorggebied. Bel ons gerust — soms kan er meer dan de kaart zegt.",
        },
        { status: 400 }
      );
    }
    bezorgkosten = kostenVoor(check.gemeente);
    gemeenteNaam = check.gemeente.naam;

    if (!tekst(body.levering?.straat) || !tekst(body.levering?.huisnummer)) {
      return NextResponse.json(
        { fout: "Vul uw straat en huisnummer in, anders vinden we u niet." },
        { status: 400 }
      );
    }
  }

  /* ── Bedrag opnieuw berekenen ───────────────────────────────────────────── */
  // Verse vis gaat op gewicht. Wat een kilo kabeljauw kost weten we pas als hij
  // op de weegschaal ligt, dus daar valt vooraf niets af te rekenen. Een
  // visschaal is wél op de cent uit te rekenen: startbedrag plus toevoegingen.
  const isAfrekenbaar = soort === "visschaal";

  const keuze: Keuze = {};
  if (isAfrekenbaar && body.visschaal?.keuze) {
    for (const [id, aantal] of Object.entries(body.visschaal.keuze)) {
      const n = Number(aantal);
      if (Number.isFinite(n) && n > 0) keuze[id] = Math.min(Math.floor(n), 50);
    }
  }

  const schaalTotaal = isAfrekenbaar ? berekenTotaal(keuze) : 0;
  const teBetalen = isAfrekenbaar ? schaalTotaal + bezorgkosten : 0;

  if (
    isAfrekenbaar &&
    wijze === "bezorgen" &&
    schaalTotaal < BEZORGING.minimumBedrag
  ) {
    return NextResponse.json(
      { fout: `Voor bezorging geldt een minimum van € ${BEZORGING.minimumBedrag},-.` },
      { status: 400 }
    );
  }

  const referentie = nieuweReferentie();

  /* ── Bestelling doorsturen naar de winkel ───────────────────────────────── */
  const samenvatting = {
    bestelnummer: referentie,
    soort: soort === "visschaal" ? "VISSCHAAL" : "VERSE VIS",
    naam,
    telefoon,
    email: email || "(niet opgegeven)",
    levering:
      wijze === "bezorgen"
        ? `Bezorgen — ${tekst(body.levering?.straat)} ${tekst(body.levering?.huisnummer)}, ${tekst(body.levering?.postcode)} ${gemeenteNaam}`
        : `Afhalen — ${tekst(body.levering?.afhaalpunt) || "winkel Herenstraat"}`,
    datum: tekst(body.levering?.datum) || "(geen voorkeur)",
    tijdvak: tekst(body.levering?.tijdvak) || "(geen voorkeur)",
    bestelling:
      soort === "visschaal"
        ? [
            `Basisschaal: € ${STARTBEDRAG.toFixed(2).replace(".", ",")}`,
            ...keuzeRegels(keuze).map(
              (r) => `${r.aantal}× ${r.naam} — € ${r.bedrag.toFixed(2).replace(".", ",")}`
            ),
          ].join("\n")
        : (body.regels ?? [])
            .slice(0, 60)
            .map(
              (r) =>
                `${tekst(r.naam, 120)} — ${tekst(r.hoeveelheid, 60) || "hoeveelheid n.t.b."}${
                  tekst(r.toelichting, 120) ? ` (${tekst(r.toelichting, 120)})` : ""
                }`
            )
            .join("\n"),
    bezorgkosten: wijze === "bezorgen" ? `€ ${bezorgkosten.toFixed(2).replace(".", ",")}` : "—",
    totaal: isAfrekenbaar
      ? `€ ${teBetalen.toFixed(2).replace(".", ",")}`
      : "Op gewicht — dagprijs bij aflevering",
    allergie: tekst(body.allergie, 500) || "(niets doorgegeven)",
    opmerking: tekst(body.opmerking, 800) || "—",
    nieuwsbrief: body.nieuwsbrief ? "ja" : "nee",
    _subject: `Bestelling ${referentie} — ${naam}`,
  };

  const webhook = process.env.BESTELLING_WEBHOOK_URL;

  // Geen webhook ingesteld? Dan komt de bestelling nergens aan. Eerder gaf dit
  // adres gewoon "gelukt" terug: de klant zag een bevestiging en wij hoorden er
  // nooit van. Liever eerlijk zeggen dat het niet werkt en het telefoonnummer
  // tonen, dan een bestelling stilletjes laten verdampen.
  if (!webhook) {
    return NextResponse.json(
      {
        fout: `Online bestellen staat nog niet aan. Bel of app ons op ${BEDRIJF.telefoon.weergave} — dan noteren we het meteen.`,
      },
      { status: 503 }
    );
  }

  const nietDoorgekomen = NextResponse.json(
    {
      fout: `We konden uw bestelling niet doorzetten. Bel of app ons op ${BEDRIJF.telefoon.weergave}, dan regelen we het meteen.`,
    },
    { status: 502 }
  );

  try {
    const doorgestuurd = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(samenvatting),
    });
    if (!doorgestuurd.ok) return nietDoorgekomen;
  } catch {
    return nietDoorgekomen;
  }

  /* ── Online betalen, als SumUp klaarstaat ───────────────────────────────── */
  if (isAfrekenbaar && teBetalen > 0 && sumupBeschikbaar()) {
    try {
      const locale = ["nl", "en", "de"].includes(body.locale ?? "") ? body.locale : "nl";
      const { betaalUrl } = await maakCheckout({
        bedrag: teBetalen,
        referentie,
        omschrijving: `Visschaal ${referentie} — ${BEDRIJF.naam}`,
        retourUrl: `${BEDRIJF.domein}/${locale}/bestellen/bedankt?ref=${referentie}`,
        email: email || undefined,
      });
      return NextResponse.json({ ok: true, referentie, betaalUrl, totaal: teBetalen });
    } catch {
      // Betaalpagina lukt niet? Dan is de bestelling al doorgestuurd naar de
      // winkel; die wordt gewoon bij levering afgerekend. Nooit de klant
      // laten stranden om een betaalprobleem.
      return NextResponse.json({
        ok: true,
        referentie,
        totaal: teBetalen,
        betalen: "bij-levering",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    referentie,
    totaal: isAfrekenbaar ? teBetalen : null,
    betalen: "bij-levering",
  });
}
