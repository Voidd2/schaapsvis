import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { googleRating, googleReviewCount } from "@/lib/reviews";
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
        text: "De winkel is op Herenstraat 48, 2313 AL Leiden (di–vr 09:00–18:00, za 09:00–17:00; maandag gesloten). Op zaterdag staan wij bij de Waag (Aalmarkt) en op woensdag bij Dille & Camille. Op vrijdag staan wij op de parkeerplaats bij Hoogvliet in Voorschoten (08:30–17:30).",
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
        text: "Ja! Via onze website kunt u kibbeling, haring, vissoep, feestschotels en meer vooraf reserveren. Wij bellen of appen u terug met een bevestiging en de ophaaltijd.",
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
        text: "Ja. Wij voeren MSC-gecertificeerde Hollandse garnalen (Heiploeg en SOLT), ASC-gecertificeerde gerookte Noorse zalm (High Seas), en biologische Varlaks-zalm uit Noord-Noorwegen. Op onze Eerlijke Vis-pagina leggen wij per product uit waar het vandaan komt.",
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

      {/* Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--navy-dark)",
          backgroundImage: "url(/images/scene-vis.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
        className="py-16 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-60" style={{ color: "var(--sand)" }}>
            Herenstraat 48 · Leiden
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Viswinkel in Leiden —<br />verse vis sinds 1938
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(250,246,239,0.78)" }}>
            Vier generaties vakmanschap op de Herenstraat. Dagverse kibbeling, haring, Hollandse
            garnalen en biologische zalm — direct van leverancier naar toonbank, zonder omwegen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/bestellen`}
              className="font-semibold px-6 py-3 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              Bestel vooruit
            </Link>
            <a
              href="tel:+31715149802"
              className="font-semibold px-6 py-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "var(--cream)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              071 514 9802
            </a>
            <a
              href="https://wa.me/31715149802"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold px-6 py-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--seafoam)", color: "var(--cream)" }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* USP strip ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--gold)" }} className="py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 justify-between items-center">
          {[
            "Sinds 1938 — vier generaties",
            "Dagvers van de veiling",
            "MSC · ASC · Biologisch",
            `${googleRating} van 5 op Google (${googleReviewCount} beoordelingen)`,
            "Drie verkooppunten in de regio",
          ].map((u) => (
            <span key={u} className="text-sm font-semibold" style={{ color: "var(--navy-dark)" }}>
              {u}
            </span>
          ))}
        </div>
      </section>

      {/* Producten ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
          >
            Wat vindt u bij ons?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { naam: "Kibbeling", omschrijving: "Knapperig gebakken kabeljauw of MSC-gecertificeerde Alaska koolvis — dé Hollandse klassieker.", href: `/${locale}/assortiment`, badge: "MSC" },
              { naam: "Hollandse Haring", omschrijving: "Rauwe Hollandse Nieuwe haring op een zacht broodje met ui en augurk. Half juni is het feest.", href: `/${locale}/assortiment`, badge: null },
              { naam: "Hollandse Garnalen", omschrijving: "Dagverse Noordzeegarnalen (Crangon crangon) van Heiploeg en SOLT, MSC-gecertificeerd van de Waddenkust.", href: `/${locale}/assortiment`, badge: "MSC" },
              { naam: "Varlaks Biologische Zalm", omschrijving: "Premium biologische zalmfilet uit Noord-Noorwegen, boven de poolcirkel gekweekt. ASC gecertificeerd.", href: `/${locale}/varlaks`, badge: "BIO · ASC" },
              { naam: "Gerookte Noorse Zalm", omschrijving: "Koud gerookte zalm van High Seas (Den Heijer), lang gesneden in dunne plakken. ASC gecertificeerd.", href: `/${locale}/assortiment`, badge: "ASC" },
              { naam: "Lekkerbek & Vissoep", omschrijving: "Verse wijting in luchtig beslag, en huisgemaakte vissoep — elke dag vers bereid in de winkel.", href: `/${locale}/assortiment`, badge: null },
            ].map(({ naam, omschrijving, href, badge }) => (
              <Link
                key={naam}
                href={href}
                className="block p-6 group transition-shadow hover:shadow-md"
                style={{ backgroundColor: "white", border: "1px solid var(--sand)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>
                    {naam}
                  </h3>
                  {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 ml-2 flex-shrink-0" style={{ backgroundColor: "var(--seafoam)", color: "white" }}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                  {omschrijving}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/assortiment`}
              className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "var(--navy)" }}
            >
              Volledig assortiment bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* Locaties ────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
          >
            Waar vindt u ons?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                naam: "Winkel — Herenstraat",
                adres: "Herenstraat 48, 2313 AL Leiden",
                uren: "Di–vr 09:00–18:00 · Za 09:00–17:00",
                maps: "https://maps.google.com/?q=Herenstraat+48+Leiden",
              },
              {
                naam: "Markt Leiden",
                adres: "Nieuwe Rijn, centrum Leiden",
                uren: "Wo + za 08:30–17:00",
                maps: "https://maps.google.com/?q=Nieuwe+Rijn+Leiden",
              },
              {
                naam: "Voorschoten",
                adres: "Bij Hoogvliet Voorschoten",
                uren: "Elke vrijdag",
                maps: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
              },
            ].map(({ naam, adres, uren, maps }) => (
              <div key={naam} className="p-6" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--gold)", fontFamily: "var(--font-display)" }}>
                  {naam}
                </h3>
                <p className="text-sm mb-1" style={{ color: "rgba(250,246,239,0.75)" }}>{adres}</p>
                <p className="text-sm mb-4" style={{ color: "rgba(250,246,239,0.6)" }}>{uren}</p>
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--salmon)" }}
                >
                  Route →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}
          >
            Veelgestelde vragen
          </h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((faq) => (
              <div key={faq.name} className="border-b pb-6" style={{ borderColor: "var(--sand)" }}>
                <h3 className="font-bold mb-2" style={{ color: "var(--navy)" }}>
                  {faq.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy-dark)" }} className="py-14 px-6 text-center">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
        >
          Bestel vooruit of kom langs
        </h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "rgba(250,246,239,0.7)" }}>
          Reserveer uw vis online of bel/app ons direct. Wij zorgen dat het klaarstaat.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${locale}/bestellen`}
            className="font-semibold px-8 py-3.5 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Online bestellen →
          </Link>
          <a
            href="tel:+31715149802"
            className="font-semibold px-8 py-3.5 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "var(--cream)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            071 514 9802
          </a>
        </div>
      </section>
    </>
  );
}
