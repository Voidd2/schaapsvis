import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { googleRating, googleReviewCount } from "@/lib/reviews";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { BEDRIJF, ADRES_REGEL, VERKOOPPUNTEN } from "@/lib/bedrijf";
import { eenTaalMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  // Nederlandstalige landingspagina. De Duitse tegenhanger staat onder een
  // eigen adres (/de/frischer-fisch-leiden) omdat "Fischgeschäft Leiden" een
  // ander zoekwoord is dan "viswinkel Leiden".
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viswinkel-leiden",
    title: "Viswinkel in Leiden — verse vis sinds 1938 | Schaap's Vishandel",
    description:
      "Schaap's Vishandel is de viswinkel op de Herenstraat 48 in Leiden. Dagverse kibbeling, haring, Hollandse garnalen en biologische zalm, ook op de Leidse markt. Vier generaties visboer.",
    paren: { de: "/frischer-fisch-leiden" },
  });
}

// ── FAQ schema for rich snippets ─────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Waar is Schaap's Vishandel in Leiden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De winkel is op Herenstraat 48, 2313 AL Leiden (di–vr 09:00–18:00, za 09:00–17:00; maandag gesloten). Op zaterdag staan wij bij de Waag (Aalmarkt) en op woensdag bij Dille & Camille. Op vrijdag staan wij op de parkeerplaats bij Hoogvliet in Voorschoten (08:00–17:30).",
      },
    },
    {
      "@type": "Question",
      name: "Wanneer staat Schaap op de markt in Leiden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Op zaterdag staan wij bij de Waag (Aalmarkt) en op woensdag bij Dille & Camille in Leiden. Beide markten open van 08:30 tot 17:00 uur.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik vis vooruit bestellen bij Schaap's Vishandel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Alleen visschalen kunt u online bestellen. Voor andere producten stuurt u ons een WhatsApp-bericht. Dan bespreken we wat mogelijk is en wat beschikbaar is.",
      },
    },
    {
      "@type": "Question",
      name: "Wanneer is de Hollandse Nieuwe er?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De Hollandse Nieuwe haring arriveert traditioneel vanaf half juni. Wij melden het in onze nieuwsbrief zodra het eerste vaatje binnen is.",
      },
    },
    {
      "@type": "Question",
      name: "Verkoopt Schaap's Vishandel duurzame vis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Wij voeren MSC-gecertificeerde Hollandse garnalen (Heiploeg en SOLT), ASC-gecertificeerde gerookte Noorse zalm (High Seas), en VÅRLAKS-zalm uit Noord-Noorwegen. Op onze biologische-vispagina leggen we herkomst en keurmerken uit. Vraag naar de certificering van het specifieke product.",
      },
    },
  ],
};

export default async function ViswinkelLeidenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Viswinkel Leiden" },
        ]}
        label={ADRES_REGEL}
        titel="Viswinkel in Leiden — verse vis sinds 1938"
        intro="Vier generaties vakmanschap op de Herenstraat. Dagverse kibbeling, haring, Hollandse garnalen en biologische zalm — direct van leverancier naar toonbank, zonder omwegen."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: BEDRIJF.telefoon.weergave, href: `tel:${BEDRIJF.telefoon.e164}`, extern: true, soort: "lijn" },
        ]}
        feiten={[
          { label: "Sinds", waarde: "1938 — vier generaties" },
          { label: "Keurmerken", waarde: "MSC · ASC · biologisch" },
          { label: "Google", waarde: `${googleRating} van 5 (${googleReviewCount})` },
        ]}
      />

      {/* ── Wat er ligt ───────────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          label="In de toonbank"
          titel="Wat u bij ons vindt"
          intro="De aanvoer bepaalt het aanbod, dus dit wisselt. Dit is waar we het vaakst om gevraagd worden."
        />
        <ul style={{ borderTop: "1px solid var(--linen)" }}>
          {[
            { naam: "Kibbeling", omschrijving: "Knapperig gebakken kabeljauw of MSC-gecertificeerde Alaska koolvis — de Hollandse klassieker.", href: `/${locale}/assortiment`, badge: "MSC" },
            { naam: "Hollandse haring", omschrijving: "Rauwe Hollandse Nieuwe op een zacht broodje met ui en augurk. Half juni is het feest.", href: `/${locale}/assortiment`, badge: null },
            { naam: "Hollandse garnalen", omschrijving: "Dagverse Noordzeegarnalen van Heiploeg en SOLT, MSC-gecertificeerd van de Waddenkust.", href: `/${locale}/assortiment`, badge: "MSC" },
            { naam: "VÅRLAKS-zalm", omschrijving: "Zalmfilet uit Noord-Noorwegen, boven de poolcirkel gekweekt.", href: `/${locale}/varlaks`, badge: "VÅRLAKS" },
            { naam: "Gerookte Noorse zalm", omschrijving: "Koud gerookt van High Seas, lang gesneden in dunne plakken.", href: `/${locale}/assortiment`, badge: "ASC" },
            { naam: "Lekkerbek en vissoep", omschrijving: "Verse wijting in luchtig beslag, en huisgemaakte soep — elke dag vers bereid in de winkel.", href: `/${locale}/assortiment`, badge: null },
          ].map(({ naam, omschrijving, href, badge }) => (
            <li key={naam} style={{ borderBottom: "1px solid var(--linen)" }}>
              <Link
                href={href}
                className="group grid sm:grid-cols-[15rem_1fr] gap-x-8 gap-y-1 py-5"
              >
                <span className="flex items-baseline gap-3">
                  <span
                    className="text-[1.15rem] group-hover:underline underline-offset-4"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {naam}
                  </span>
                  {badge && (
                    <span className="kapitaal shrink-0" style={{ color: "var(--seafoam)" }}>
                      {badge}
                    </span>
                  )}
                </span>
                <span className="text-[0.98rem] leading-relaxed" style={{ color: "var(--charcoal)" }}>
                  {omschrijving}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/assortiment`}
          className="inline-block mt-7 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          Het hele assortiment &rarr;
        </Link>
      </Sectie>

      {/* ── Waar u ons vindt ──────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop label="Drie plekken" titel="Waar u ons vindt" />
        <ul className="grid sm:grid-cols-3 gap-x-10 gap-y-8">
          {VERKOOPPUNTEN.filter((punt) => punt.id !== "markt-woensdag").map((punt) => (
            <li key={punt.id} className="pt-4" style={{ borderTop: "2px solid var(--navy)" }}>
              <h3 className="text-[1.15rem] mb-1">{punt.naam}</h3>
              <p style={{ color: "var(--charcoal)" }}>
                {punt.adres}
                <br />
                {punt.plaats}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--grijs)" }}>
                {punt.dagen}
              </p>
              <a
                href={punt.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--navy)" }}
              >
                Route &rarr;
              </a>
            </li>
          ))}
        </ul>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel="Veelgestelde vragen" />
        <Vragen
          vragen={faqSchema.mainEntity.map((q) => ({ v: q.name, a: q.acceptedAnswer.text }))}
        />
      </Sectie>

      <PaginaSlot
        titel="Kom langs voor uw vis"
        tekst="De winkel is dinsdag tot en met zaterdag open. Alleen visschalen bestelt u online. Voor andere visproducten kunt u ons via WhatsApp vragen wat mogelijk is."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          { label: "Openingstijden en route", href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
