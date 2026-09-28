import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { eenTaalMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, VERKOOPPUNTEN } from "@/lib/bedrijf";


export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viswinkel-voorschoten",
    title: "Viswinkel Voorschoten — verse vis op de vrijdagmarkt | Schaap's Vis",
    description:
      "Verse vis in Voorschoten? Schaap's Vishandel staat elke vrijdag met de viskraam bij Hoogvliet. Kibbeling, haring, VÅRLAKS-zalm en duurzame vis, sinds 1938.",
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
    v: "Kan ik vis bestellen?",
    a: "Alleen visschalen kunt u online bestellen. Voor andere producten of wensen stuurt u ons een WhatsApp-bericht; we kijken graag wat mogelijk is.",
  },
  {
    v: "Hebben jullie biologische zalm in Voorschoten?",
    a: "Vraag via WhatsApp naar het actuele aanbod en de certificering van de zalm op de vrijdagmarkt.",
  },
  {
    v: "Kan ik in Voorschoten vooruit bestellen?",
    a: "Alleen visschalen kunt u online bestellen. Stuur ons voor andere producten een WhatsApp-bericht en geef aan dat u in Voorschoten wilt ophalen. We bespreken graag wat mogelijk is.",
  },
];

const REDENEN = [
  [
    "Sinds 1938",
    "Vier generaties Leids visvakmanschap, en al jaren hetzelfde gezicht achter de kraam bij Hoogvliet.",
  ],
  [
    "VÅRLAKS-zalm",
    "Zalm uit Noord-Noorwegen. Vraag naar actuele herkomst en productcertificering.",
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
        intro="Schaap's Vishandel staat sinds jaar en dag op vrijdag met de kraam in Voorschoten. Kibbeling, haring, verse filet en VÅRLAKS-zalm. Vraag ons naar actuele beschikbaarheid."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          {
            label: "Visschalen samenstellen",
            href: `/${locale}/visschalen`,
            soort: "lijn",
          },
        ]}
        feiten={[
          { label: "Kraam", waarde: `${kraam.adres} — ${kraam.dagen}` },
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
            <p className="kapitaal mb-3">Visschalen voor uw gezelschap</p>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>
              Voor een borrel, verjaardag of feest.
            </p>
            <p className="text-sm mt-4" style={{ color: "var(--grijs)" }}>
              Alleen visschalen kunt u online bestellen. Andere vis of een bijzondere wens? Neem contact met ons op via WhatsApp.
            </p>
            <Link
              href={`/${locale}/visschalen`}
              className="inline-block mt-4 font-semibold underline underline-offset-4"
              style={{ color: "var(--navy)" }}
            >
              Stel uw visschaal samen &rarr;
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
            Over VÅRLAKS-zalm
          </Link>
        </div>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel="Veelgestelde vragen — Voorschoten" />
        <Vragen vragen={FAQ} />
      </Sectie>

      <PaginaSlot
        titel="Een vraag voor de vrijdagmarkt?"
        tekst="Kom vrijdag langs bij Hoogvliet. Alleen visschalen kunt u online bestellen; voor andere vis bespreken we de mogelijkheden graag via WhatsApp."
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
