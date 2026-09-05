import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN, euro } from "@/lib/bedrijf";
import { BEZORGING, gemeenteBySlug, kostenVoor } from "@/lib/bezorging";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viswinkel-voorschoten",
    title: "Viswinkel Voorschoten — verse vis op de vrijdagmarkt | Schaap's Vis",
    description:
      "Verse vis in Voorschoten? Schaap's Vishandel staat elke vrijdag met de viskraam bij Hoogvliet. Kibbeling, haring, biologische Varlaks zalm en duurzame vis, sinds 1938. Bezorgen kan ook.",
  });
}

const FAQ = [
  {
    v: "Waar staat Schaap's Vishandel in Voorschoten?",
    a: "Elke vrijdag staat onze viskraam op de parkeerplaats bij Hoogvliet in Voorschoten, van 08:30 tot 17:30.",
  },
  {
    v: "Welke dag is de viskraam in Voorschoten?",
    a: "Op vrijdag. De rest van de week vindt u ons in de winkel op Herenstraat 48 in Leiden en op de Leidse markt (woensdag en zaterdag).",
  },
  {
    v: "Bezorgen jullie ook in Voorschoten?",
    a: "Ja, verse vis en visschalen. Rijtijd vanaf de winkel is ongeveer 15 minuten. Bezorgkosten € 4,95, gratis vanaf € 60. Gebakken vis bezorgen we niet — kibbeling en lekkerbek zijn na twintig minuten in een doos niet lekker meer.",
  },
  {
    v: "Hebben jullie biologische zalm in Voorschoten?",
    a: "Ja. Onze biologische Varlaks zalm (ASC en EU-biologisch, zonder antibiotica of hormonen) gaat mee naar de vrijdagmarkt. Reserveer gerust vooruit, dan leggen we hem apart.",
  },
  {
    v: "Kan ik in Voorschoten vooruit bestellen?",
    a: "Zeker. Bestel online of bel 071 514 9802 en geef aan dat u het op vrijdag in Voorschoten wilt ophalen — dan staat het klaar.",
  },
];

const REDENEN = [
  [
    "Sinds 1938",
    "Vier generaties Leids visvakmanschap, en al jaren hetzelfde gezicht achter de kraam bij Hoogvliet.",
  ],
  [
    "Biologische Varlaks zalm",
    "ASC én EU-biologisch, gekweekt boven de poolcirkel zonder antibiotica of hormonen. Zeldzaam in de regio.",
  ],
  [
    "Écht gerookt, MSC gevangen",
    "Duurzaam gevangen en in eigen huis gerookt. Geen kunstmatige rooksmaak uit een fles.",
  ],
];

export default async function ViswinkelVoorschotenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const kraam = VERKOOPPUNTEN.find((punt) => punt.id === "voorschoten")!;
  const gemeente = gemeenteBySlug("voorschoten")!;

  return (
    <>
      <JsonLd />
      <Schema
        data={[
          vraagSchema(FAQ),
          kruimelSchema("nl", [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: "Viswinkel Voorschoten", pad: "/viswinkel-voorschoten" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Voorschoten" },
        ]}
        label="Elke vrijdag bij Hoogvliet"
        titel="Verse vis in Voorschoten"
        intro="Schaap's Vishandel staat sinds jaar en dag op vrijdag met de kraam in Voorschoten. Kibbeling, haring, verse filet en biologische Varlaks zalm — en wie er niet uitkomt, laat het bezorgen."
        knoppen={[
          { label: "Vooruit bestellen", href: `/${locale}/bestellen` },
          {
            label: "Bezorgen in Voorschoten",
            href: `/${locale}/bezorgen/voorschoten`,
            soort: "lijn",
          },
        ]}
        feiten={[
          { label: "Kraam", waarde: `${kraam.adres} — ${kraam.dagen}` },
          { label: "Bezorgen", waarde: `${euro(kostenVoor(gemeente))}, gratis vanaf ${euro(BEZORGING.gratisVanaf)}` },
          { label: "Rijtijd", waarde: `${gemeente.rijtijd} vanaf de winkel` },
        ]}
      />

      {/* ── De vrijdagmarkt ───────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16">
          <div>
            <Kop label="De vrijdagmarkt" titel="Elke vrijdag bij Hoogvliet" />
            <div className="lees">
              <p>
                U vindt de kraam op de parkeerplaats bij Hoogvliet, van 08:30 tot 17:30.
                Dezelfde dagverse vis als in de Leidse winkel — alleen dichterbij.
              </p>
              <p>
                Van kibbeling en Hollandse Nieuwe tot verse filet en biologische zalm. Vraag
                gerust wat er die dag het mooist ligt, of bestel vooruit zodat het klaarligt.
              </p>
            </div>
            <a
              href={kraam.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              Route naar Hoogvliet Voorschoten &rarr;
            </a>
          </div>

          <div className="pt-6" style={{ borderTop: "2px solid var(--navy)" }}>
            <p className="kapitaal mb-3">Wijken waar we bezorgen</p>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
              {gemeente.wijken.join(" · ")}
            </p>
            <p className="text-sm mt-4" style={{ color: "var(--grijs)" }}>
              {gemeente.intro}
            </p>
            <Link
              href={`/${locale}/bezorgen/voorschoten`}
              className="inline-block mt-4 font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              Bezorging in Voorschoten &rarr;
            </Link>
          </div>
        </div>
      </Sectie>

      {/* ── Waarom hier ───────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop titel="Waarom klanten uit Voorschoten voor Schaap's kiezen" />
        <ul className="grid sm:grid-cols-3 gap-x-10 gap-y-8">
          {REDENEN.map(([titel, tekst]) => (
            <li key={titel} className="pt-4" style={{ borderTop: "2px solid var(--gold)" }}>
              <h3 className="text-[1.15rem] mb-2">{titel}</h3>
              <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
                {tekst}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 mt-9">
          <Link href={`/${locale}/assortiment`} className="knop knop-navy">
            Het assortiment
          </Link>
          <Link href={`/${locale}/varlaks`} className="knop knop-lijn">
            Over Varlaks biologische zalm
          </Link>
        </div>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel="Veelgestelde vragen — Voorschoten" />
        <Vragen vragen={FAQ} />
      </Sectie>

      <PaginaSlot
        titel="Bestel vooruit voor de vrijdagmarkt"
        tekst="Reserveer uw vis en haal het vrijdag op bij Hoogvliet. Liever thuis? We bezorgen verse vis en visschalen in heel Voorschoten."
        knoppen={[
          { label: "Vooruit bestellen", href: `/${locale}/bestellen` },
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
