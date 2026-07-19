import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RevealGroup } from "@/components/shared/RevealGroup";
import { VisschaalAanvraag } from "./VisschaalAanvraag";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Visschalen & Feestschotels Leiden | Op maat + offerte — Schaap's Vis";
  const description =
    "Visschaal of feestschotel nodig in Leiden? Van borrelplank tot kerstschaal — u vertelt wat u wilt, wij maken een offerte op maat. Gerookte vis, garnalen, zeevruchten en salades. Op bestelling.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/visschalen`,
      languages: {
        nl: "/nl/visschalen",
        en: "/en/visschalen",
        de: "/de/visschalen",
        "x-default": "/nl/visschalen",
      },
    },
    openGraph: { title, description, locale, type: "website" },
  };
}

const stappen = [
  ["1", "Stuur ons een appje", "App of bel ons met de gelegenheid, het aantal personen en uw wensen. Een voorbeeld uitkiezen mag, maar hoeft niet."],
  ["2", "Wij maken een prijs op maat", "Elke schaal is maatwerk. Op basis van de grootte, het aantal en uw wensen — bijvoorbeeld extra Hollandse garnalen — laten we u vrijblijvend een prijs weten."],
  ["3", "Vers opgehaald", "Akkoord? Dan maken we uw schaal vers en mooi opgemaakt klaar. U haalt hem op aan de Herenstraat 48."],
];

const faq = [
  {
    q: "Hoe werkt het bestellen van een visschaal?",
    a: "Het snelst gaat via WhatsApp: u appt ons wat u zoekt — de gelegenheid, het aantal personen en uw wensen. Wij laten u vrijblijvend een prijs op maat weten. Na uw akkoord maken we de schaal vers voor u klaar. Liever niet appen? Bel ons of laat uw gegevens achter via het formulier.",
  },
  {
    q: "Werken jullie met vaste prijzen?",
    a: "Nee, elke schaal is maatwerk. De prijs hangt af van de grootte, het aantal schalen en uw wensen — wilt u bijvoorbeeld extra Hollandse garnalen, dan verwerken we dat in de prijs. Daarom werken we met een prijs op maat in plaats van vaste bedragen.",
  },
  {
    q: "Hoe ver van tevoren moet ik aanvragen?",
    a: "Voor een mooie schaal plannen we graag een paar dagen vooruit. Rond feestdagen (Kerst, Oud & Nieuw) adviseren we ruim op tijd aan te vragen — die weken zijn druk.",
  },
  {
    q: "Kan ik rekening laten houden met allergieën?",
    a: "Zeker. Geef uw allergieën of dieetwensen door in de aanvraag — bijvoorbeeld zonder schaaldieren of een deel zonder rauwe vis — en wij houden daar rekening mee.",
  },
  {
    q: "Kan ik zelf bepalen wat erop komt?",
    a: "Ja, dat is juist de bedoeling. Beschrijf in uw eigen woorden wat u lekker vindt en voor welke gelegenheid, dan stellen wij de schaal daarop af.",
  },
];

export default async function VisschalenPage({
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
      { "@type": "ListItem", position: 2, name: "Visschalen", item: `https://www.schaapsvishandel.nl/${locale}/visschalen` },
    ],
  };

  return (
    <>
      <JsonLd />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "var(--navy)" }}>
        <p className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: "rgba(246,250,253,0.6)" }}>
          Borrel · Verjaardag · Bruiloft · Kerst
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Visschalen &amp; feestschotels op maat
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: "rgba(246,250,253,0.85)" }}>
          Geen kant-en-klare bestelling, maar een schaal precies zoals u hem wilt. We werken niet met
          vaste prijzen — u stuurt ons een appje met wat u zoekt (gelegenheid, aantal personen, wensen)
          en wij laten u een prijs op maat weten.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="#offerte"
            className="inline-block px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)", borderRadius: "6px" }}
          >
            Vraag uw schaal aan &rarr;
          </a>
          <a
            href="#voorbeelden"
            className="inline-block px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ border: "1px solid rgba(246,250,253,0.4)", color: "var(--cream)", borderRadius: "6px" }}
          >
            Bekijk voorbeelden
          </a>
        </div>
      </section>

      <RevealGroup>
      {/* Zo werkt het */}
      <section style={{ backgroundColor: "white" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Zo werkt het
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {stappen.map(([num, titel, tekst]) => (
              <div key={num} className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: "var(--navy)" }}
                >
                  {num}
                </div>
                <p className="font-bold text-base mb-1" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>{titel}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealGroup>

      {/* Voorbeelden + offerteformulier (interactief) */}
      <VisschaalAanvraag />

      <RevealGroup>
      {/* FAQ */}
      <section style={{ backgroundColor: "white" }} className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
            Veelgestelde vragen over visschalen
          </h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group p-5" style={{ border: "1px solid var(--sand)" }}>
                <summary className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold" style={{ listStyle: "none", color: "var(--navy)", fontFamily: "Playfair Display, serif" }}>
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
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white" style={{ fontFamily: "Playfair Display, serif" }}>
          Zin gekregen?
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(246,250,253,0.7)" }}>
          Vraag vrijblijvend een offerte aan, of overleg even met ons — we denken graag mee.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="#offerte"
            className="inline-block px-8 py-4 tracking-wide font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Offerte aanvragen &rarr;
          </a>
          <a
            href="https://wa.me/31715149802?text=Hallo%20Schaap's%20Vishandel,%20ik%20heb%20een%20vraag%20over%20een%20visschaal%20of%20feestschotel."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 tracking-wide font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
          >
            Overleg via WhatsApp
          </a>
        </div>
      </section>
      </RevealGroup>
    </>
  );
}
