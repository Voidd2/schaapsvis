import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN } from "@/lib/bedrijf";
import { Beeld } from "@/components/ui/Beeld";
import type { BeeldNaam } from "@/lib/beeld";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/marktkraam-leiden",
    title: "Viskraam Leiden — woensdag en zaterdag op de markt | Schaap's Vis",
    description:
      "De viskraam van Schaap's Vishandel: woensdag en zaterdag op de markt in Leiden, vrijdag bij Hoogvliet in Voorschoten. Verse vis, kibbeling en haring van de kraam.",
  });
}

/**
 * De marktkramen komen uit `VERKOOPPUNTEN` in `src/lib/bedrijf.ts`.
 *
 * Eerder stonden de dagen en adressen hier nóg een keer, met een andere plek
 * voor de woensdagmarkt dan in de bedrijfsgegevens. Voor lokale vindbaarheid is
 * dat het slechtste wat je kunt doen: Google vergelijkt naam, adres en tijden
 * over álle vermeldingen heen, en wat elkaar tegenspreekt telt niet mee.
 */
const KRAMEN = VERKOOPPUNTEN.filter((punt) => punt.id !== "winkel");

/** Welke foto bij welke kraam hoort. Zie `src/lib/beeld.ts`. */
const BEELD_PER_KRAAM: Record<string, BeeldNaam> = {
  markt: "marktZaterdag",
  "markt-woensdag": "marktWoensdag",
  voorschoten: "marktVoorschoten",
};

const TOELICHTING: Record<string, string> = {
  markt:
    "Recht voor de historische Waag, in hartje Leiden. Al generaties lang de plek voor een broodje haring, een bakje kibbeling of de vis voor het weekend.",
  "markt-woensdag":
    "Midden in de stad, halverwege de week. Dezelfde toonbank als in de winkel: verse vis, gebakken vis en haring.",
  voorschoten:
    "Op de parkeerplaats bij Hoogvliet. Dezelfde vis en dezelfde prijzen als in Leiden, alleen dichter bij huis.",
};

const FAQ = [
  {
    v: "Waar staat de viskraam van Schaap's in Leiden?",
    a: "Op zaterdag op de Aalmarkt, bij de Waag. Op woensdag bij Dille & Camille. Beide in het centrum van Leiden, van 08:30 tot 17:00. De vaste winkel is op Herenstraat 48.",
  },
  {
    v: "Welke dagen staat Schaap's op de markt?",
    a: "Woensdag en zaterdag in Leiden, en vrijdag bij Hoogvliet in Voorschoten. De winkel aan de Herenstraat 48 is dinsdag tot en met zaterdag open.",
  },
  {
    v: "Kan ik vis vooruit bestellen voor de kraam?",
    a: "Alleen visschalen bestelt u online. Voor andere producten kunt u ons via WhatsApp vragen naar beschikbaarheid en de mogelijkheden om het bij de kraam op te halen.",
  },
  {
    v: "Staat Schaap's ook op de markt in Voorschoten?",
    a: "Ja, op vrijdag van 08:30 tot 17:30 op de parkeerplaats bij Hoogvliet in Voorschoten.",
  },
];

export default async function MarktkraamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />
      <Schema
        data={[
          vraagSchema(FAQ),
          kruimelSchema("nl", [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: "Marktkramen", pad: "/marktkraam-leiden" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Marktkramen" },
        ]}
        label="Woensdag · vrijdag · zaterdag"
        titel="Onze viskramen in Leiden en Voorschoten"
        intro="Verse vis, kibbeling en haring, vers van de kraam. Drie dagen in de week staan we buiten; de rest van de week vindt u ons in de winkel op de Herenstraat."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
        ]}
        feiten={KRAMEN.map((kraam) => ({
          label: kraam.dagen.split(" ")[0],
          waarde: `${kraam.adres}, ${kraam.plaats}`,
        }))}
      />

      {/* ── De kramen ─────────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          label="Waar en wanneer"
          titel="Drie kramen, drie dagen"
          intro="De tijden hieronder zijn de openingstijden van de markt zelf. Bij slecht weer staan we er ook — daar zijn we visboer voor."
        />
        <ul style={{ borderTop: "1px solid var(--linen)" }}>
          {KRAMEN.map((kraam) => (
            <li
              key={kraam.id}
              className="grid md:grid-cols-[13rem_1fr] lg:grid-cols-[13rem_12rem_1fr] gap-x-8 gap-y-4 py-7"
              style={{ borderBottom: "1px solid var(--linen)" }}
            >
              <Beeld
                naam={BEELD_PER_KRAAM[kraam.id]}
                verhouding="liggend"
                streep="var(--navy)"
              />
              <div>
                <h2 className="text-[1.25rem] mb-1">{kraam.naam}</h2>
                <p className="text-sm" style={{ color: "var(--grijs)" }}>
                  {kraam.dagen}
                </p>
              </div>
              <div className="lees">
                <p className="font-semibold" style={{ color: "var(--ink)" }}>
                  {kraam.adres}, {kraam.plaats}
                </p>
                <p style={{ color: "var(--charcoal)" }}>{TOELICHTING[kraam.id]}</p>
                <a
                  href={kraam.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-semibold underline underline-offset-4"
                  style={{ color: "var(--navy)" }}
                >
                  Route &rarr;
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl" style={{ color: "var(--charcoal)" }}>
          Liever naar de winkel? Die is op <strong>{BEDRIJF.adres.straat}</strong> in Leiden,
          dinsdag tot en met zaterdag.{" "}
          <Link
            href={`/${locale}/bezoek-ons`}
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--navy)" }}
          >
            Alle locaties en openingstijden
          </Link>
          .
        </p>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel="Veelgestelde vragen over de kraam" />
        <Vragen vragen={FAQ} />
      </Sectie>

      <PaginaSlot
        titel="Vis reserveren voor de kraam?"
        tekst="Zoekt u iets voor bij de kraam? Vraag ons via WhatsApp naar de mogelijkheden. Alleen visschalen kunt u online bestellen."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          {
            label: BEDRIJF.telefoon.weergave,
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
      />
    </>
  );
}
