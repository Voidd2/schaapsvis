import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Viskraam Leiden — Vismarkt (wo) & Aalmarkt bij de Waag (za) | Schaap's Vis";
  const description =
    "De viskraam van Schaap's Vishandel: woensdag op de Vismarkt (Nieuwe Rijn) en zaterdag op de Aalmarkt bij de Waag in Leiden, en vrijdag bij Hoogvliet in Voorschoten.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/marktkraam-leiden`,
      languages: {
        nl: "/nl/marktkraam-leiden",
        en: "/en/marktkraam-leiden",
        de: "/de/marktkraam-leiden",
        "x-default": "/nl/marktkraam-leiden",
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

const kramen = [
  {
    dag: "Woensdag",
    titel: "Vismarkt — Nieuwe Rijn, Leiden",
    tijd: "08:30 – 17:00",
    tekst:
      "Op woensdag vindt u onze viskraam op de Vismarkt aan de Nieuwe Rijn in het centrum van Leiden. Sinds de verplaatsing van de zaterdagkramen staat hier midden in de stad onze verse vis, kibbeling en haring klaar.",
    maps: "https://maps.google.com/?q=Vismarkt+Nieuwe+Rijn+Leiden",
    kleur: "var(--seafoam)",
  },
  {
    dag: "Zaterdag",
    titel: "Aalmarkt — bij de Waag, Leiden",
    tijd: "08:30 – 17:00",
    tekst:
      "Op zaterdag staan we op de Aalmarkt, recht voor de historische Waag in hartje Leiden. Al generaties lang dé plek voor een vers broodje haring, een bakje kibbeling of uw vis voor het weekend.",
    maps: "https://maps.google.com/?q=Aalmarkt+Waag+Leiden",
    kleur: "var(--gold)",
  },
  {
    dag: "Vrijdag",
    titel: "Hoogvliet — Voorschoten",
    tijd: "08:30 – 17:30",
    tekst:
      "Op vrijdag vindt u onze kraam op de parkeerplaats bij Hoogvliet in Voorschoten. Dezelfde verse vis en vertrouwde kwaliteit, dicht bij huis voor onze klanten uit Voorschoten en omgeving.",
    maps: "https://maps.google.com/?q=Hoogvliet+Voorschoten",
    kleur: "var(--lichtblauw)",
  },
];

const faq = [
  {
    q: "Waar staat de viskraam van Schaap's in Leiden?",
    a: "Op woensdag op de Vismarkt aan de Nieuwe Rijn, en op zaterdag op de Aalmarkt bij de Waag — beide in het centrum van Leiden. Daarnaast is onze vaste winkel op Herenstraat 48.",
  },
  {
    q: "Welke dagen staat Schaap's op de markt?",
    a: "Woensdag (Vismarkt Leiden), zaterdag (Aalmarkt Leiden) en vrijdag (bij Hoogvliet in Voorschoten). De winkel aan de Herenstraat 48 is van maandag tot en met zaterdag open.",
  },
  {
    q: "Waar vind ik de viskraam op zaterdag in Leiden?",
    a: "Op zaterdag staan we op de Aalmarkt, recht voor de Waag in het centrum van Leiden, van 08:30 tot 17:00.",
  },
  {
    q: "Staat Schaap's ook op de markt in Voorschoten?",
    a: "Ja, op vrijdag staat onze viskraam op de parkeerplaats bij Hoogvliet in Voorschoten, van 08:30 tot 17:30.",
  },
];

export default async function MarktkraamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://www.schaapsvishandel.nl/${locale}` },
      { "@type": "ListItem", position: 2, name: "Marktkramen", item: `https://www.schaapsvishandel.nl/${locale}/marktkraam-leiden` },
    ],
  };

  return (
    <>
      <JsonLd />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section
        className="py-16 px-6 text-center"
        style={{
          backgroundColor: "var(--navy-dark)",
          backgroundImage: "url(/images/scene-markt.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
      >
        <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-70" style={{ color: "var(--sand)" }}>
          Woensdag · Zaterdag · Vrijdag
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Onze viskramen in Leiden &amp; Voorschoten
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(246,250,253,0.8)" }}>
          Verse vis, kibbeling en haring — vers van de kraam. Woensdag op de Vismarkt aan de Nieuwe Rijn,
          zaterdag op de Aalmarkt bij de Waag, en vrijdag bij Hoogvliet in Voorschoten.
        </p>
      </section>

      {/* Kramen */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {kramen.map((k) => (
            <div key={k.dag} className="bg-white p-6" style={{ borderTop: `4px solid ${k.kleur}` }}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: k.kleur }}>
                {k.dag}
              </p>
              <h2 className="text-lg font-bold mb-1 leading-snug" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
                {k.titel}
              </h2>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--charcoal)", opacity: 0.6 }}>
                {k.tijd}
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                {k.tekst}
              </p>
              <a
                href={k.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline underline-offset-2"
                style={{ color: "var(--salmon)" }}
              >
                Route &rarr;
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-8 p-6" style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--navy)" }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)" }}>
            <strong>Liever naar de winkel?</strong> Onze vaste viswinkel vindt u op{" "}
            <strong>Herenstraat 48</strong> in Leiden, maandag tot en met zaterdag.{" "}
            <Link href={`/${locale}/bezoek-ons`} className="underline" style={{ color: "var(--navy)" }}>
              Bekijk alle locaties &amp; openingstijden →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: "white" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Veelgestelde vragen over onze marktkramen
          </h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group p-5" style={{ border: "1px solid var(--sand)" }}>
                <summary
                  className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold"
                  style={{ listStyle: "none", color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {f.q}
                  <svg className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Vis reserveren voor de markt?
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(246,250,253,0.7)" }}>
          Bestel vooruit — dan ligt het voor u klaar op de kraam of in de winkel.
        </p>
        <Link
          href={`/${locale}/bestellen`}
          className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          Vooruit bestellen &rarr;
        </Link>
      </section>
    </>
  );
}
