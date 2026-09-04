import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Viswinkel Voorschoten — Verse Vis op de Vrijdagmarkt | Schaap's Vis";
  const description =
    "Verse vis in Voorschoten? Schaap's Vishandel staat elke vrijdag met de viskraam bij Hoogvliet. Kibbeling, haring, biologische Varlaks zalm en duurzame vis — sinds 1938.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/viswinkel-voorschoten`,
      languages: {
        nl: "/nl/viswinkel-voorschoten",
        en: "/en/viswinkel-voorschoten",
        de: "/de/viswinkel-voorschoten",
        "x-default": "/nl/viswinkel-voorschoten",
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

const faq = [
  {
    q: "Waar staat Schaap's Vishandel in Voorschoten?",
    a: "Elke vrijdag staat onze viskraam op de parkeerplaats bij Hoogvliet in Voorschoten, van 08:30 tot 17:30.",
  },
  {
    q: "Welke dag is de viskraam in Voorschoten?",
    a: "Op vrijdag. De rest van de week vindt u ons in de winkel op Herenstraat 48 in Leiden en op de Leidse markt (woensdag en zaterdag).",
  },
  {
    q: "Hebben jullie biologische zalm in Voorschoten?",
    a: "Ja. Onze biologische Varlaks zalm (ASC + EU-biologisch, zonder antibiotica of hormonen) nemen we mee naar de vrijdagmarkt in Voorschoten. Reserveer gerust vooruit, dan leggen we hem voor u apart.",
  },
  {
    q: "Kan ik in Voorschoten vooruit bestellen?",
    a: "Zeker. Bestel online of via WhatsApp en geef aan dat u het op vrijdag in Voorschoten wilt ophalen — dan staat het voor u klaar.",
  },
];

export default async function ViswinkelVoorschotenPage({
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
      { "@type": "ListItem", position: 2, name: "Viswinkel Voorschoten", item: `https://www.schaapsvishandel.nl/${locale}/viswinkel-voorschoten` },
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
          Elke vrijdag · bij Hoogvliet Voorschoten
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
          Verse vis in Voorschoten
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(250,246,239,0.8)" }}>
          Schaap&apos;s Vishandel — sinds 1938 — staat elke vrijdag met de viskraam in Voorschoten.
          Verse vis, kibbeling, haring en onze biologische Varlaks zalm, dicht bij huis.
        </p>
      </section>

      {/* Vrijdag Voorschoten */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3 font-semibold opacity-50" style={{ color: "var(--navy)" }}>
              De vrijdagmarkt
            </p>
            <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>
              Elke vrijdag bij Hoogvliet
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
              U vindt onze kraam op de parkeerplaats bij Hoogvliet in Voorschoten, van 08:30 tot 17:30.
              Dezelfde dagverse vis en vertrouwde kwaliteit als in onze Leidse winkel — alleen dichterbij
              voor onze klanten uit Voorschoten en omgeving.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
              Van kibbeling en Hollandse Nieuwe tot verse filet en biologische zalm: vraag gerust wat er
              die dag het mooist is, of bestel vooruit zodat het voor u klaarligt.
            </p>
            <a
              href="https://maps.google.com/?q=Hoogvliet+Voorschoten"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 text-sm font-semibold underline underline-offset-2"
              style={{ color: "var(--salmon)" }}
            >
              Route naar Hoogvliet Voorschoten &rarr;
            </a>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/scene-markt.svg"
            alt="Viskraam van Schaap's Vishandel bij Hoogvliet in Voorschoten"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </section>

      {/* Waarom Schaap's */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>
            Waarom klanten uit Voorschoten voor Schaap&apos;s kiezen
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              ["Sinds 1938", "Vier generaties Leids visvakmanschap — een vertrouwd gezicht op de markt."],
              ["Biologische Varlaks zalm", "Als enige in de regio: ASC + EU-biologische zalm zonder antibiotica of hormonen."],
              ["Écht gerookt & MSC", "Duurzaam gevangen (MSC) en ambachtelijk gerookt — geen kunstmatige rooksmaak."],
            ].map(([t, d]) => (
              <div key={t} className="bg-white p-5">
                <p className="font-bold text-base mb-1" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>{t}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-wrap gap-3 justify-center">
            <Link href={`/${locale}/assortiment`} className="inline-block text-sm font-semibold px-6 py-3 text-white" style={{ backgroundColor: "var(--navy)" }}>
              Bekijk het assortiment →
            </Link>
            <Link href={`/${locale}/varlaks`} className="inline-block text-sm font-semibold px-6 py-3 border" style={{ borderColor: "var(--navy)", color: "var(--navy)" }}>
              Over Varlaks biologische zalm →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: "white" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "var(--font-display)" }}>
            Veelgestelde vragen — Voorschoten
          </h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group p-5" style={{ border: "1px solid var(--sand)" }}>
                <summary className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold" style={{ listStyle: "none", color: "var(--navy)", fontFamily: "var(--font-display)" }}>
                  {f.q}
                  <svg className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-display)" }}>
          Bestel vooruit voor de vrijdagmarkt
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(250,246,239,0.7)" }}>
          Reserveer uw vis en haal het vrijdag op bij Hoogvliet in Voorschoten.
        </p>
        <Link href={`/${locale}/bestellen`} className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--salmon)" }}>
          Vooruit bestellen &rarr;
        </Link>
      </section>
    </>
  );
}
